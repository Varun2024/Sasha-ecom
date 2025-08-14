// import { collection, doc, getDoc, setDoc } from "firebase/firestore";
// import { MoreVertical, PlusCircle } from "lucide-react";
// import { db } from "../firebase/firebaseConfig";
// import { useEffect, useState } from "react";
// import { v4 as uuid } from 'uuid';
// import { toast, ToastContainer } from "react-toastify";

// const productsData = [
//     {
//         id: 1,
//         name: "Classic Crewneck T-Shirt",
//         sku: "CL-TS-001",
//         category: "T-Shirts",
//         price: "$25.00",
//         stock: 150,
//         imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=T-Shirt"
//     },
//     { id: 2, name: "Slim-Fit Denim Jeans", sku: "CL-JN-001", category: "Jeans", price: "$79.99", stock: 80, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Jeans" },
//     { id: 3, name: "Wool Blend Peacoat", sku: "CL-CT-001", category: "Coats", price: "$199.50", stock: 30, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Coat" },
//     { id: 4, name: "V-Neck Cashmere Sweater", sku: "CL-SW-001", category: "Sweaters", price: "$120.00", stock: 55, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Sweater" },
//     { id: 5, name: "Leather Ankle Boots", sku: "SH-BT-001", category: "Shoes", price: "$150.00", stock: 40, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Boots" },
//     { id: 6, name: "Silk Scarf", sku: "AC-SC-001", category: "Accessories", price: "$45.00", stock: 120, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Scarf" },
// ];


// const P = async () => {
//     try {
//         // const pRef = doc(db, "products", "product.id");
//         const docSnap = await getDoc(collection(db, "products"));
//         const productList = docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         if (productList.length > 0) {
//             console.log("Product data:", productList);
//         } else {
//             console.log("No such document!");
//         }
//         // return docSnap.data();
//     } catch (error) {
//         console.error("Error fetching product:", error);
//     }
// }



// const AddProductPage = ({ toggleAdd }) => {
//     return (
//         <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
//             <ToastContainer />
//             <h2>Add New Product</h2>
//             <form onSubmit={(e) => {
//                 e.preventDefault();
//                 const product = {
//                     id: uuid(),
//                     name: e.target.name.value,
//                     sku: e.target.sku.value,
//                     category: e.target.category.value,
//                     price: e.target.price.value,
//                     stock: e.target.stock.value,
//                     imageUrl: e.target.imageUrl.value
//                 };
//                 addProduct(product, toggleAdd);
//             }}>
//                 <div className="grid grid-cols-1 gap-4 mb-10">
//                     <input className="border border-gray-300 p-2 rounded-md" type="text" name="name" placeholder="Product Name" required />
//                     <input className="border border-gray-300 p-2 rounded-md" type="text" name="sku" placeholder="SKU" required />
//                     <input className="border border-gray-300 p-2 rounded-md" type="text" name="category" placeholder="Category" required />
//                     <input className="border border-gray-300 p-2 rounded-md" type="number" name="price" placeholder="Price" required />
//                     <input className="border border-gray-300 p-2 rounded-md" type="number" name="stock" placeholder="Stock Quantity" required />
//                     <input className="border border-gray-300 p-2 rounded-md" type="text" name="imageUrl" placeholder="Image URL" required />
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
//                         Add Product
//                     </button>
//                     <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors" onClick={() => toggleAdd(false)}>
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// const addProduct = async (product, toggleAdd) => {
//     try {
//         // Check if product already exists
//         const productRef = doc(db, "products", product.id);
//         const docSnap = await getDoc(productRef);
//         if (docSnap.exists()) {
//             console.error("Product already exists");
//             return;
//         }
//         await setDoc(doc(db, "products", product.id), product);
//         toast.success("Product added successfully", {
//             position: "bottom-right",
//             autoClose: 2000,
//             hideProgressBar: true,
//         });
//         setTimeout(() => toggleAdd(false), 2000);

//     } catch (error) {
//         console.error("Error checking product existence:", error);
//     }

// }



// const ProductsView = () => {
//     const [toggleAdd, setToggleAdd] = useState(false);
//     useEffect(() => {
//         P();
//     }, []);
//     return (
//         <>
//             {!toggleAdd && (
//                 <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
//                     <button onClick={P}>fetch</button>
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <h3 className="text-xl font-semibold text-gray-800">Product Catalog</h3>
//                         <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setToggleAdd(!toggleAdd)}>
//                             <PlusCircle size={20} />
//                             <span>Add New Product</span>
//                         </button>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <thead >
//                                 <tr className="border-b bg-gray-50">
//                                     <th className="p-4 text-sm font-semibold text-gray-600">Product</th>
//                                     <th className="p-4 text-sm font-semibold text-gray-600 hidden sm:table-cell">SKU</th>
//                                     <th className="p-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Category</th>
//                                     <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
//                                     <th className="p-4 text-sm font-semibold text-gray-600">Stock</th>
//                                     <th className="p-4 text-sm font-semibold text-gray-600"></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {productsData.map((product) => (
//                                     <tr key={product.id} className="border-b hover:bg-gray-50">
//                                         <td className="p-4 text-sm text-gray-800 font-medium">
//                                             <div className="flex items-center gap-4">
//                                                 <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
//                                                 <span>{product.name}</span>
//                                             </div>
//                                         </td>
//                                         <td className="p-4 text-sm text-gray-600 hidden sm:table-cell">{product.sku}</td>
//                                         <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{product.category}</td>
//                                         <td className="p-4 text-sm text-gray-800 font-medium">{product.price}</td>
//                                         <td className="p-4 text-sm text-gray-600">{product.stock}</td>
//                                         <td className="p-4 text-sm text-gray-600">
//                                             <button className="hover:text-gray-900"><MoreVertical size={20} /></button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>)}
//             <div className="">
//                 {toggleAdd && <AddProductPage toggleAdd={setToggleAdd} />}
//             </div>
//         </>
//     );
// };

// export default ProductsView;

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
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
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
