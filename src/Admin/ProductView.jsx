import { useEffect, useState } from "react";
import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc, query, where } from "firebase/firestore";
import { Plus, MoreVertical, X, Trash2, Tag, LayoutGrid, Search, AlertCircle } from "lucide-react";
import { v4 as uuid } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase/firebaseConfig";

//==============================================================================
// ✅ REDESIGNED FORM: The "Atelier" Product Creator
//==============================================================================
const ProductForm = ({ toggleForm, fetchProducts, productToEdit }) => {
    const isEditMode = Boolean(productToEdit);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "", category: "", mrp: "", sale: "", description: "",
    });

    const [variants, setVariants] = useState([
        { id: uuid(), colorName: "", imageUrls: [], imageFiles: [], sizes: [{ id: uuid(), size: "", stock: "" }] },
    ]);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: productToEdit.name || "",
                category: productToEdit.category || "",
                mrp: productToEdit.mrp || "",
                sale: productToEdit.sale || "",
                description: productToEdit.description || "",
            });
            if (productToEdit.variants?.length > 0) {
                setVariants(productToEdit.variants.map((v) => ({
                    id: uuid(),
                    colorName: v.colorName || "",
                    imageUrls: v.imageUrls || [],
                    imageFiles: [],
                    sizes: v.sizes?.map((s) => ({ ...s, id: uuid() })) || [{ id: uuid(), size: "", stock: "" }],
                })));
            }
        }
    }, [productToEdit, isEditMode]);

    // --- FORM HANDLERS ---
    const handleCommonChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addVariant = () => {
        setVariants([...variants, { id: uuid(), colorName: "", imageUrls: [], imageFiles: [], sizes: [{ id: uuid(), size: "", stock: "" }] }]);
    };

    const removeVariant = (id) => {
        if (variants.length > 1) setVariants(variants.filter(v => v.id !== id));
        else toast.warn("MINIMUM ONE VARIANT REQUIRED");
    };

    const handleVariantChange = (variantId, field, value) => {
        setVariants(prev => prev.map(v => v.id === variantId ? { ...v, [field]: value } : v));
    };

    const handleVariantImageChange = (variantId, files) => {
        setVariants(prev => prev.map(v => v.id === variantId ? { ...v, imageFiles: [...v.imageFiles, ...Array.from(files)] } : v));
    };

    const addSize = (variantId) => {
        setVariants(prev => prev.map(v => v.id === variantId ? { ...v, sizes: [...v.sizes, { id: uuid(), size: "", stock: "" }] } : v));
    };

    const removeSize = (variantId, sizeId) => {
        setVariants(prev => prev.map(v => v.id === variantId ? { ...v, sizes: v.sizes.filter(s => s.id !== sizeId) } : v));
    };

    const handleSizeChange = (variantId, sizeId, field, value) => {
        setVariants(prev => prev.map(v => v.id === variantId ? {
            ...v, sizes: v.sizes.map(s => s.id === sizeId ? { ...s, [field]: value } : s)
        } : v));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const toastId = toast.loading("SYNCHRONIZING ATELIER...");

        try {
            const finalVariantsData = [];
            for (const variant of variants) {
                let uploadedImageUrls = [];
                if (variant.imageFiles.length > 0) {
                    const uploadPromises = variant.imageFiles.map((file) => {
                        const uploadFormData = new FormData();
                        uploadFormData.append("image", file);
                        return fetch("https://sasha-backend.onrender.com/api/upload", {
                            method: "POST",
                            body: uploadFormData,
                        }).then((res) => res.json());
                    });
                    const results = await Promise.all(uploadPromises);
                    uploadedImageUrls = results.filter(r => r.success).map(r => r.data.url);
                }

                finalVariantsData.push({
                    colorName: variant.colorName,
                    imageUrls: [...variant.imageUrls, ...uploadedImageUrls],
                    sizes: variant.sizes.map(s => ({ size: s.size, stock: Number(s.stock || 0) })).filter(s => s.size),
                });
            }

            const finalProductData = { ...formData, variants: finalVariantsData };
            const productId = isEditMode ? productToEdit.id : uuid();
            await setDoc(doc(db, "products", productId), { ...finalProductData, id: productId }, { merge: true });

            toast.update(toastId, { render: "PRODUCT PUBLISHED", type: "success", isLoading: false, autoClose: 2000 });
            setTimeout(() => { toggleForm(false); fetchProducts(); }, 1500);
        } catch (error) {
            toast.update(toastId, { render: "PUBLISH FAILED", type: "error", isLoading: false, autoClose: 3000 });
        } finally { setIsSaving(false); }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
            <header className="flex justify-between items-end border-b border-gray-100 pb-8">
                <div>
                    <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-400 italic">Inventory</h3>
                    <h2 className="text-3xl font-light tracking-[0.1em] text-gray-900 uppercase mt-2">
                        {isEditMode ? "Modify" : "New"} <span className="font-semibold">Creation</span>
                    </h2>
                </div>
                <button onClick={() => toggleForm(false)} className="text-gray-300 hover:text-black transition-colors"><X size={24} strokeWidth={1} /></button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Specs Section */}
                <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm space-y-8">
                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-900 flex items-center gap-2"><Tag size={14} /> Spec Sheet</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Title</label>
                            <input className="w-full border-b border-gray-100 py-2 text-sm outline-none focus:border-black transition-colors uppercase tracking-wide font-light" type="text" name="name" required value={formData.name} onChange={handleCommonChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</label>
                            <input className="w-full border-b border-gray-100 py-2 text-sm outline-none focus:border-black transition-colors uppercase tracking-wide font-light" type="text" name="category" required value={formData.category} onChange={handleCommonChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">MRP</label>
                            <input className="w-full border-b border-gray-100 py-2 text-sm outline-none focus:border-black transition-colors font-light" type="number" name="mrp" required value={formData.mrp} onChange={handleCommonChange} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Sale Price</label>
                            <input className="w-full border-b border-gray-100 py-2 text-sm outline-none focus:border-black transition-colors font-light" type="number" name="sale" required value={formData.sale} onChange={handleCommonChange} />
                        </div>
                    </div>
                </div>

                {/* Variants Section */}
                <div className="space-y-10">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-900 flex items-center gap-2"><LayoutGrid size={14} /> Color Matrix</h4>
                        <button type="button" onClick={addVariant} className="text-[10px] tracking-widest uppercase font-bold border-b border-black pb-1 hover:opacity-50 transition-opacity">+ Add Variant</button>
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                        {variants.map((variant) => (
                            <div key={variant.id} className="bg-white p-8 border border-gray-100 rounded-sm relative group transition-all hover:shadow-md">
                                <button type="button" onClick={() => removeVariant(variant.id)} className="absolute top-4 right-4 text-gray-200 hover:text-red-500"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                                    <div className="md:col-span-7 space-y-6">
                                        <input className="text-xl font-light border-b border-gray-50 focus:border-black outline-none w-full uppercase tracking-widest pb-2" placeholder="COLOR" value={variant.colorName} onChange={(e) => handleVariantChange(variant.id, "colorName", e.target.value)} />
                                        <div className="flex flex-wrap gap-3">
                                            {[...variant.imageUrls, ...variant.imageFiles.map(f => URL.createObjectURL(f))].map((url, i) => (
                                                <img key={i} src={url} className="w-20 h-28 object-cover border border-gray-50" />
                                            ))}
                                            <label className="w-20 h-28 border border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-black"><Plus size={20} className="text-gray-300" /><input type="file" hidden multiple accept="image/*" onChange={(e) => handleVariantImageChange(variant.id, e.target.files)} /></label>
                                        </div>
                                    </div>
                                    <div className="md:col-span-5 bg-[#fafafa] p-6 space-y-4">
                                        <p className="text-[9px] tracking-widest uppercase font-bold text-gray-400">Inventory Allocation</p>
                                        {variant.sizes.map((s) => (
                                            <div key={s.id} className="flex gap-2">
                                                <input className="w-full bg-white border border-gray-100 p-2 text-[11px] outline-none" placeholder="SIZE" value={s.size} onChange={(e) => handleSizeChange(variant.id, s.id, "size", e.target.value)} />
                                                <input className="w-full bg-white border border-gray-100 p-2 text-[11px] outline-none" type="number" placeholder="QTY" value={s.stock} onChange={(e) => handleSizeChange(variant.id, s.id, "stock", e.target.value)} />
                                                <button type="button" onClick={() => removeSize(variant.id, s.id)} className="text-gray-300 hover:text-red-500"><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addSize(variant.id)} className="text-[9px] tracking-widest uppercase font-bold text-gray-400 hover:text-black">+ Add Matrix</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-10 flex justify-end gap-6">
                    <button type="submit" disabled={isSaving} className="px-16 py-4 bg-black text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-gray-800 disabled:bg-gray-100">{isSaving ? "Syncing..." : "Finalize creation"}</button>
                </div>
            </form>
        </div>
    );
};

//==============================================================================
// ✅ REDESIGNED PRODUCTS VIEW: The Digital Catalog
//==============================================================================
const ProductsView = () => {
    const [showForm, setShowForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [productToEdit, setProductToEdit] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) { toast.error("SYNC FAILED"); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleDelete = async (productId) => {
        if (!window.confirm("CONFIRM DELETION?")) return;
        await deleteDoc(doc(db, "products", productId));
        fetchProducts();
        setOpenMenuId(null);
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-700">
            <ToastContainer position="bottom-right" theme="light" autoClose={2000} hideProgressBar />
            {!showForm && (
                <div className="space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                        <div>
                            <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-900">Digital Archive</h3>
                            <h2 className="text-3xl font-light tracking-[0.1em] text-gray-900 uppercase mt-2">Product <span className="font-semibold">Catalog</span></h2>
                            <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-4">{products.length} Items Indexed</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative group hidden md:block">
                                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="SEARCH CATALOG..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-6 bg-transparent border-b border-gray-100 text-[10px] tracking-widest uppercase py-2 focus:border-black outline-none w-48 transition-all" 
                                />
                            </div>
                            <button onClick={() => { setProductToEdit(null); setShowForm(true); }} className="px-8 py-4 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-all">Add New Piece</button>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#fafafa] border-b border-gray-50">
                                <tr>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Atelier Ref</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hidden md:table-cell">Category</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Allocation</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Valuation</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => {
                                    const img = product.variants?.[0]?.imageUrls?.[0] || product.imageUrls?.[0] || "https://via.placeholder.com/150";
                                    const stock = product.variants?.reduce((s, v) => s + v.sizes.reduce((ss, sz) => ss + Number(sz.stock || 0), 0), 0) || 0;
                                    return (
                                        <tr key={product.id} className="group hover:bg-[#fafafa] transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-5">
                                                    <img src={img} className="w-12 h-16 object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="" />
                                                    <span className="text-[12px] font-medium tracking-tight uppercase text-gray-900">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 hidden md:table-cell"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span></td>
                                            <td className="p-6"><span className={`text-[11px] font-medium ${stock < 5 ? 'text-red-400' : 'text-gray-900'}`}>{stock} Units</span></td>
                                            <td className="p-6"><span className="text-[12px] font-bold">₹{product.sale}</span></td>
                                            <td className="p-6 text-right relative">
                                                <button onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)} className="text-gray-300 hover:text-black"><MoreVertical size={18} /></button>
                                                {openMenuId === product.id && (
                                                    <div className="absolute right-6 top-12 w-32 bg-white shadow-xl border border-gray-50 z-20 py-2">
                                                        <button onClick={() => { setProductToEdit(product); setShowForm(true); }} className="w-full text-left px-4 py-2 text-[10px] tracking-widest uppercase font-bold hover:bg-gray-50">Edit</button>
                                                        <button onClick={() => handleDelete(product.id)} className="w-full text-left px-4 py-2 text-[10px] tracking-widest uppercase font-bold text-red-400 hover:bg-red-50">Delete</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredProducts.length === 0 && (
                            <div className="py-20 text-center text-[10px] tracking-widest text-gray-400 uppercase flex flex-col items-center gap-3">
                                <AlertCircle size={24} strokeWidth={1} /> No pieces match your search
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showForm && <ProductForm toggleForm={setShowForm} fetchProducts={fetchProducts} productToEdit={productToEdit} />}
        </div>
    );
};

export default ProductsView;