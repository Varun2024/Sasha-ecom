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
// Make sure this path is correct for your project structure
import { db } from "../firebase/firebaseConfig"; 

// Reusable Form Component for Adding and Editing Products
const ProductForm = ({ toggleForm, fetchProducts, productToEdit }) => {
    const isEditMode = Boolean(productToEdit);

    // State to manage form text data
    const [formData, setFormData] = useState({
        name: "",
        color: "",
        sale: "",
        category: "",
        mrp: "",
        stock: "",
        imageUrl: "", // This will hold the final URL
    });

    // State for the selected image file
    const [imageFile, setImageFile] = useState(null);

    // Pre-fill the form if in edit mode
    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: productToEdit.name,
                color: productToEdit.color,
                sale: productToEdit.sale,
                category: productToEdit.category,
                mrp: productToEdit.mrp,
                stock: productToEdit.stock,
                imageUrl: productToEdit.imageUrl,
            });
        }
    }, [productToEdit, isEditMode]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            if (files && files[0]) {
                setImageFile(files[0]);
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Function to add a new product to Firestore
    const addProduct = async (productData) => {
        try {
            const q = query(collection(db, "products"), where("name", "==", productData.name));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.warn("A product with this name already exists");
                return;
            }

            const newProductId = uuid();
            const productRef = doc(db, "products", newProductId);
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

    // Function to update an existing product in Firestore
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Start with the existing image URL if in edit mode
        let uploadedImageUrl = isEditMode ? formData.imageUrl : "";

        // If a new image file is selected, upload it first
        if (imageFile) {
            toast.info("Uploading image, please wait...");
            const uploadFormData = new FormData();
            uploadFormData.append("image", imageFile);
            
            try {
                // IMPORTANT: Replace with your actual server URL if it's different
                const response = await fetch("http://localhost:5000/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const result = await response.json();
                
                if (result.success) {
                    uploadedImageUrl = result.data.url; // Get URL from server response
                    toast.success("Image uploaded successfully!");
                } else {
                    toast.error(`Image upload failed: ${result.message}`);
                    return; // Stop if upload fails
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("An error occurred during image upload.");
                return;
            }
        }
        
        // For new products, an image is required
        if (!uploadedImageUrl) {
            toast.warn("Please select an image for the product.");
            return;
        }

        // Prepare final data for Firestore
        const finalProductData = { ...formData, imageUrl: uploadedImageUrl };

        if (isEditMode) {
            updateProduct(productToEdit.id, finalProductData);
        } else {
            addProduct(finalProductData);
        }
    };

    return (
        <div className="relative bg-white p-6 rounded-xl shadow-sm space-y-6 z-10">
            <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <input className="border p-2 rounded-md" type="text" name="name" placeholder="Product Name" required value={formData.name} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="text" name="color" placeholder="Color" required value={formData.color} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="text" name="category" placeholder="Category" required value={formData.category} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="number" name="mrp" placeholder="MRP" required value={formData.mrp} onChange={handleChange} />
                    <input className="border p-2 rounded-md" type="text" name="sale" placeholder="Sale price" required value={formData.sale} onChange={handleChange} />   
                    <input className="border p-2 rounded-md" type="number" name="stock" placeholder="Stock Quantity" required value={formData.stock} onChange={handleChange} />
                    {/* File input doesn't use 'value'. It's only required for new products. */}
                    <input className="border p-2 rounded-md" type="file" name="image" accept="image/*" onChange={handleChange} required={!isEditMode} />
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
        try {
            await deleteDoc(doc(db, "products", productId));
            toast.success("Product deleted successfully");
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
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
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
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
                                    <th className="p-4 hidden sm:table-cell">Color</th>
                                    <th className="p-4 hidden md:table-cell">Category</th>
                                    <th className="p-4">MRP</th>
                                    <th className="p-4">Sale</th>
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
                                        <td className="p-4 hidden sm:table-cell">{product.color}</td>
                                        <td className="p-4 hidden md:table-cell">{product.category}</td>
                                        <td className="p-4">₹{product.mrp}</td>
                                        <td className="p-4">₹{product.sale}</td>
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
