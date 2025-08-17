
import { useEffect, useState } from "react";
import {
    doc,
    setDoc,
    collection,
    getDocs,
    deleteDoc,
    updateDoc,
    query,
    where,    
} from "firebase/firestore";
import { PlusCircle, MoreVertical } from "lucide-react";
import { v4 as uuid } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import { db } from "../firebase/firebaseConfig";

// Reusable Form Component for Adding and Editing Products
const ProductForm = ({ toggleForm, fetchProducts, productToEdit }) => {
    const isEditMode = Boolean(productToEdit);

    // State to manage form data
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        price: "",
        stock: "",
        imageUrl: "",
    });

    // Pre-fill the form if in edit mode
    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: productToEdit.name,
                sku: productToEdit.sku,
                category: productToEdit.category,
                price: productToEdit.price,
                stock: productToEdit.stock,
                imageUrl: productToEdit.imageUrl,
            });
        }
    }, [productToEdit, isEditMode]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Function to add a new product
    const addProduct = async (productData) => {
        try {
            // Check if a product with the same name already exists
            const q = query(collection(db, "products"), where("name", "==", productData.name));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.warn("A product with this name already exists");
                return;
            }

            const newProductId = uuid();
            const productRef = doc(db, "products", newProductId);
            // Store the ID within the document as well
            await setDoc(productRef, { ...productData, id: newProductId });

            toast.success("Product added successfully");
            setTimeout(() => {
                toggleForm(false);
                fetchProducts();
            }, 1500);
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product");
        }
    };

    // Function to update an existing product
    const updateProduct = async (productId, productData) => {
        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, productData);
            toast.success("Product updated successfully");
            setTimeout(() => {
                toggleForm(false);
                fetchProducts();
            }, 1500);
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            updateProduct(productToEdit.id, formData);
        } else {
            addProduct(formData);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <input className="border p-2 rounded-md" type="text" name="name" placeholder="Product Name" required value={formData.name} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="text" name="sku" placeholder="SKU" required value={formData.sku} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="text" name="category" placeholder="Category" required value={formData.category} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="number" name="price" placeholder="Price" required value={formData.price} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="number" name="stock" placeholder="Stock Quantity" required value={formData.stock} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="text" name="imageUrl" placeholder="Image URL" required value={formData.imageUrl} onChange={handleChange} />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        {isEditMode ? "Save Changes" : "Add Product"}
                    </button>
                    <button type="button" className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors" onClick={() => toggleForm(false)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};


const ProductsView = () => {
    const [showForm, setShowForm] = useState(false);
    const [products, setProducts] = useState([]);
    const [productToEdit, setProductToEdit] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null); // To control which menu is open

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productList);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products.");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle product deletion
    const handleDelete = async (productId) => {
        setOpenMenuId(null); // Close the menu
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", productId));
                toast.success("Product deleted successfully");
                fetchProducts(); // Refresh the list
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };

    // Set up for editing a product
    const handleEdit = (product) => {
        setProductToEdit(product);
        setShowForm(true);
        setOpenMenuId(null); // Close the menu
    };

    // Set up for adding a new product
    const handleAdd = () => {
        setProductToEdit(null); // Clear any existing edit data
        setShowForm(true);
    };

    return (
        <>
            <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar />
            {!showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h3 className="text-xl font-semibold text-gray-800">Product Catalog</h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors" onClick={handleAdd}>
                            <PlusCircle size={20} />
                            <span>Add New Product</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-4">Product</th>
                                    <th className="p-4 hidden sm:table-cell">SKU</th>
                                    <th className="p-4 hidden md:table-cell">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">
                                            <div className="flex items-center gap-4">
                                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                                                <span>{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell">{product.sku}</td>
                                        <td className="p-4 hidden md:table-cell">{product.category}</td>
                                        <td className="p-4">${product.price}</td>
                                        <td className="p-4">{product.stock}</td>
                                        <td className="p-4">
                                            <div className="relative">
                                                <button className="hover:text-gray-900" onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}>
                                                    <MoreVertical size={20} />
                                                </button>
                                                {openMenuId === product.id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleEdit(product); }}>
                                                            Edit
                                                        </a>
                                                        <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleDelete(product.id); }}>
                                                            Delete
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {showForm && <ProductForm toggleForm={setShowForm} fetchProducts={fetchProducts} productToEdit={productToEdit} />}
        </>
    );
};

export default ProductsView;