import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { PlusCircle, MoreVertical } from "lucide-react";
import { v4 as uuid } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase/firebaseConfig";

const AddProductPage = ({ toggleAdd, fetchProducts }) => {
    const addProduct = async (product) => {
        try {
            const productRef = doc(db, "products", product.id);
            const docSnap = await getDoc(productRef);

            if (docSnap.exists()) {
                console.error("Product already exists");
                return;
            }

            await setDoc(productRef, product);
            toast.success("Product added successfully", {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: true,
            });

            setTimeout(() => {
                toggleAdd(false);
                fetchProducts(); // refresh product list
            }, 2000);

        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <ToastContainer />
            <h2>Add New Product</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                const product = {
                    id: uuid(),
                    name: e.target.name.value,
                    sku: e.target.sku.value,
                    category: e.target.category.value,
                    price: e.target.price.value,
                    stock: e.target.stock.value,
                    imageUrl: e.target.imageUrl.value
                };
                addProduct(product);
            }}>
                <div className="grid grid-cols-1 gap-4 mb-10">
                    <input className="border p-2 rounded-md" type="text" name="name" placeholder="Product Name" required />
                    <input className="border p-2 rounded-md" type="text" name="sku" placeholder="SKU" required />
                    <input className="border p-2 rounded-md" type="text" name="category" placeholder="Category" required />
                    <input className="border p-2 rounded-md" type="number" name="price" placeholder="Price" required />
                    <input className="border p-2 rounded-md" type="number" name="stock" placeholder="Stock Quantity" required />
                    <input className="border p-2 rounded-md" type="text" name="imageUrl" placeholder="Image URL" required />
                </div>
                <div className="flex items-center justify-between">
                    <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Add Product
                    </button>
                    <button type="button" className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors" onClick={() => toggleAdd(false)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const ProductsView = () => {
    const [toggleAdd, setToggleAdd] = useState(false);
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productList);
            console.log("Fetched products:", productList);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }; 

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            {!toggleAdd && (
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6 ">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <h3 className="text-xl font-semibold text-gray-800">Product Catalog</h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() => setToggleAdd(true)}>
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
                                        <td className="p-4">{product.price}</td>
                                        <td className="p-4">{product.stock}</td>
                                        <td className="p-4">
                                            <button className="hover:text-gray-900"><MoreVertical size={20} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {toggleAdd && <AddProductPage toggleAdd={setToggleAdd} fetchProducts={fetchProducts} />}
        </>
    );
};

export default ProductsView;
