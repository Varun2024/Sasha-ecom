// import { useEffect, useState } from "react";
// import {
//     doc,
//     setDoc,
//     collection,
//     getDocs,
//     deleteDoc,
//     updateDoc,
//     query,
//     where,
// } from "firebase/firestore";
// import { PlusCircle, MoreVertical, X, Trash2 } from "lucide-react"; // ADDED: X icon for removal
// import { v4 as uuid } from "uuid";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { db } from "../firebase/firebaseConfig";

// // Reusable Form Component for Adding and Editing Products
// const ProductForm = ({ toggleForm, fetchProducts, productToEdit }) => {
//     const isEditMode = Boolean(productToEdit);

//     // CHANGED: State now manages an array of image URLs
//     const [formData, setFormData] = useState({
//         name: "",
//         color: "",
//         sale: "",
//         category: "",
//         mrp: "",
//         stock: "",
//         description: "",
//         imageUrls: [], // CHANGED: from imageUrl to imageUrls array
//     });

//     // ADDED: State for newly selected image files (File objects)
//     const [imageFiles, setImageFiles] = useState([]);
//     // ✅ State for size/stock pairs
//     const [sizes, setSizes] = useState([{ id: uuid(), size: '', stock: '' }]);

//     // Pre-fill the form if in edit mode
//     useEffect(() => {
//         if (isEditMode) {
//             setFormData({
//                 name: productToEdit.name || "",
//                 color: productToEdit.color || "",
//                 sale: productToEdit.sale || "",
//                 category: productToEdit.category || "",
//                 mrp: productToEdit.mrp || "",
//                 stock: productToEdit.stock || "",
//                 description: productToEdit.description || "",
//                 imageUrls: productToEdit.imageUrls || [], // CHANGED: Populate imageUrls array
//             });
//             // Populate sizes from product data if it exists
//             if (productToEdit.sizes && productToEdit.sizes.length > 0) {
//                 setSizes(productToEdit.sizes.map(s => ({ ...s, id: uuid() })));
//             }
//         }
//     }, [productToEdit, isEditMode]);
//     // --- Handlers for new size/stock state ---
//     const handleSizeChange = (id, field, value) => {
//         setSizes(currentSizes => currentSizes.map(s => s.id === id ? { ...s, [field]: value } : s));
//     };

//     const addSize = () => {
//         setSizes([...sizes, { id: uuid(), size: '', stock: '' }]);
//     };

//     const removeSize = (id) => {
//         if (sizes.length > 1) {
//             setSizes(sizes.filter(s => s.id !== id));
//         } else {
//             toast.warn("Product must have at least one size.");
//         }
//     };

//     // CHANGED: Handle multiple file selection
//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "image") {
//             if (files) {
//                 // Append new files to the existing array
//                 setImageFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
//             }
//         } else {
//             setFormData((prev) => ({ ...prev, [name]: value }));
//         }
//     };

//     // ADDED: Function to remove a newly selected image before upload
//     const handleRemoveNewImage = (index) => {
//         setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//     };

//     // ADDED: Function to remove an already uploaded image (in edit mode)
//     const handleRemoveExistingImage = (index) => {
//         setFormData((prev) => ({
//             ...prev,
//             imageUrls: prev.imageUrls.filter((_, i) => i !== index),
//         }));
//     };

//     // Function to add a new product to Firestore
//     const addProduct = async (productData) => {
//         try {
//             const q = query(collection(db, "products"), where("name", "==", productData.name));
//             const querySnapshot = await getDocs(q);

//             if (!querySnapshot.empty) {
//                 toast.warn("A product with this name already exists");
//                 return;
//             }

//             const newProductId = uuid();
//             const productRef = doc(db, "products", newProductId);
//             await setDoc(productRef, { ...productData, id: newProductId });

//             toast.success("Product added successfully");
//             setTimeout(() => {
//                 toggleForm(false);
//                 fetchProducts();
//             }, 1500);
//         } catch (error) {
//             console.error("Error adding product:", error);
//             toast.error("Failed to add product");
//         }
//     };

//     // Function to update an existing product in Firestore
//     const updateProduct = async (productId, productData) => {
//         try {
//             const productRef = doc(db, "products", productId);
//             await updateDoc(productRef, productData);
//             toast.success("Product updated successfully");
//             setTimeout(() => {
//                 toggleForm(false);
//                 fetchProducts();
//             }, 1500);
//         } catch (error) {
//             console.error("Error updating product:", error);
//             toast.error("Failed to update product");
//         }
//     };

//     // CHANGED: Handle submission with multiple image uploads
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         let uploadedImageUrls = [];

//         // If new files are selected, upload them
//         if (imageFiles.length > 0) {
//             toast.info("Uploading images, please wait...");

//             // Use Promise.all to upload all files concurrently for better performance
//             const uploadPromises = imageFiles.map(file => {
//                 const uploadFormData = new FormData();
//                 uploadFormData.append("image", file);
//                 return fetch("https://sasha-backend.onrender.com/api/upload", {
//                     method: "POST",
//                     body: uploadFormData,
//                 }).then(response => response.json());
//             });

//             try {
//                 const results = await Promise.all(uploadPromises);
//                 const successfulUploads = results.filter(result => result.success);

//                 if (successfulUploads.length !== imageFiles.length) {
//                     toast.error("Some images failed to upload. Please try again.");
//                     return; // Stop if any upload fails
//                 }

//                 uploadedImageUrls = successfulUploads.map(result => result.data.url);
//                 toast.success("All images uploaded successfully!");
//             } catch (error) {
//                 console.error("Error uploading images:", error);
//                 toast.error("An error occurred during image upload.");
//                 return;
//             }
//         }

//         // Combine existing URLs (in edit mode) with newly uploaded ones
//         const finalImageUrls = [...formData.imageUrls, ...uploadedImageUrls];

//         // An image is required for all products
//         if (finalImageUrls.length === 0) {
//             toast.warn("Please select at least one image for the product.");
//             return;
//         }

//         // Format the sizes array for Firestore (remove temporary id)
//         const finalSizes = sizes.map(({ size, stock }) => ({
//             size,
//             stock: Number(stock)
//         }));

//         // Prepare final data for Firestore
//         const finalProductData = {
//             ...formData,
//             imageUrls: finalImageUrls,
//             sizes: finalSizes,
//         };
//         // Remove old top-level size/stock fields if they exist
//         delete finalProductData.size;
//         delete finalProductData.stock;

//         if (isEditMode) {
//             updateProduct(productToEdit.id, finalProductData);
//         } else {
//             addProduct(finalProductData);
//         }
//     };

//     return (
//         <div className="relative bg-white p-6 rounded-xl shadow-sm space-y-6 z-10">
//             <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="grid grid-cols-1 gap-4 mb-10">
//                     {/* CHANGED: File input now accepts multiple files */}
//                     <input className="border p-2 rounded-md" type="file" name="image" accept="image/*" onChange={handleChange} multiple />

//                     {/* --- ADDED: Image Preview Section --- */}
//                     <div className="flex flex-wrap gap-4 border p-4 rounded-md min-h-[100px]">
//                         {/* Preview for existing images (in edit mode) */}
//                         {formData.imageUrls.map((url, index) => (
//                             <div key={index} className="relative w-24 h-24">
//                                 <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
//                                 <button
//                                     type="button"
//                                     onClick={() => handleRemoveExistingImage(index)}
//                                     className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 leading-none"
//                                 >
//                                     <X size={14} />
//                                 </button>
//                             </div>
//                         ))}
//                         {/* Preview for new images */}
//                         {imageFiles.map((file, index) => (
//                             <div key={index} className="relative w-24 h-24">
//                                 <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} className="w-full h-full object-cover rounded-md" />
//                                 <button
//                                     type="button"
//                                     onClick={() => handleRemoveNewImage(index)}
//                                     className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 leading-none"
//                                 >
//                                     <X size={14} />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>

//                     <input className="border p-2 rounded-md"
//                         type="text"
//                         name="name"
//                         placeholder="Product Name"
//                         required
//                         value={formData.name}
//                         onChange={handleChange} />
//                     <input className="border p-2 rounded-md" type="text" name="color" placeholder="Color" required value={formData.color} onChange={handleChange} />

//                     <input className="border p-2 rounded-md" type="text" name="category" placeholder="Category" required value={formData.category} onChange={handleChange} />
//                     <input className="border p-2 rounded-md" type="number" name="mrp" placeholder="MRP" required value={formData.mrp} onChange={handleChange} />
//                     <input className="border p-2 rounded-md" type="text" name="sale" placeholder="Sale price" required value={formData.sale} onChange={handleChange} />

//                     {/* ✅ DYNAMIC SIZES & STOCK SECTION */}
//                     <div className="p-4 border rounded-lg space-y-3">
//                         <h3 className="font-semibold text-gray-700">Sizes & Stock</h3>
//                         {sizes.map((s, index) => (
//                             <div key={index} className="flex items-center gap-2">
//                                 <input
//                                     placeholder="Size (e.g., M)"
//                                     value={s.size}
//                                     onChange={(e) => handleSizeChange(s.id, 'size', e.target.value)}
//                                     className="border p-2 rounded-md w-1/2"
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder="Stock"
//                                     value={s.stock}
//                                     onChange={(e) => handleSizeChange(s.id, 'stock', e.target.value)}
//                                     className="border p-2 rounded-md w-1/2"
//                                 />
//                                 <button type="button" onClick={() => removeSize(s.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-full">
//                                     <Trash2 size={16} />
//                                 </button>
//                             </div>
//                         ))}
//                         <button type="button" onClick={addSize} className="text-sm font-medium text-blue-600 mt-2">
//                             + Add Another Size
//                         </button>
//                     </div>
//                     <textarea className="border p-2 rounded-md" name="description" placeholder="Product Description" required value={formData.description} onChange={handleChange}></textarea>
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
//                         {isEditMode ? "Save Changes" : "Add Product"}
//                     </button>
//                     <button type="button" className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors" onClick={() => toggleForm(false)}>
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };


// const ProductsView = () => {
//     const [showForm, setShowForm] = useState(false);
//     const [products, setProducts] = useState([]);
//     const [productToEdit, setProductToEdit] = useState(null);
//     const [openMenuId, setOpenMenuId] = useState(null);

//     const fetchProducts = async () => {
//         try {
//             const querySnapshot = await getDocs(collection(db, "products"));
//             const productList = querySnapshot.docs.map((doc) => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setProducts(productList);
//         } catch (error) {
//             console.error("Error fetching products:", error);
//             toast.error("Failed to fetch products.");
//         }
//     };

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     const handleDelete = async (productId) => {
//         setOpenMenuId(null);
//         try {
//             await deleteDoc(doc(db, "products", productId));
//             toast.success("Product deleted successfully");
//             fetchProducts();
//         } catch (error) {
//             console.error("Error deleting product:", error);
//             toast.error("Failed to delete product");
//         }
//     };  

//     const handleEdit = (product) => {
//         setProductToEdit(product);
//         setShowForm(true);
//         setOpenMenuId(null);
//     };

//     const handleAdd = () => {
//         setProductToEdit(null);
//         setShowForm(true);
//     };

//     return (
//         <>
//             <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
//             {!showForm && (
//                 <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <h3 className="text-xl font-semibold text-gray-800">Product Catalog</h3>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors" onClick={handleAdd}>
//                             <PlusCircle size={20} />
//                             <span>Add New Product</span>
//                         </button>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left">
//                             <thead>
//                                 <tr className="border-b bg-gray-50">
//                                     <th className="p-4">Product</th>
//                                     <th className="p-4 hidden sm:table-cell">Color</th>
//                                     <th className="p-4 hidden md:table-cell">Category</th>
//                                     <th className="p-4 hidden lg:table-cell">Sizes</th>
//                                     <th className="p-4">MRP</th>
//                                     <th className="p-4">Sale</th>
//                                     <th className="p-4">Total Stock</th>
//                                     <th className="p-4">Description</th>
//                                     <th className="p-4"></th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {products.map((product) => {
//                                     // CHANGED: Logic to handle both imageUrls array and single imageUrl string for backward compatibility.
//                                     let displayImage = 'https://via.placeholder.com/150'; // Default fallback
//                                     if (product.imageUrls && product.imageUrls.length > 0) {
//                                         displayImage = product.imageUrls[0];
//                                     } else if (product.imageUrl) {
//                                         displayImage = product.imageUrl;
//                                     }
//                                     // ✅ Calculate total stock from the new sizes array
//                                     const totalStock = product.sizes?.reduce((sum, s) => sum + Number(s.stock || 0), 0) ?? product.stock;
//                                     const availableSizes = product.sizes?.map(s => s.size).join(', ') ?? product.size;


//                                     return (
//                                         <tr key={product.id} className="border-b hover:bg-gray-50">
//                                             <td className="p-4 font-medium text-gray-800">
//                                                 <div className="flex items-center gap-6">
//                                                     <img
//                                                         src={displayImage}
//                                                         alt={product.name}
//                                                         className="w-12 h-12 rounded-md object-cover"
//                                                     />
//                                                     <span className="max-w-[10rem] truncate">{product.name}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="p-4 max-w-[2rem] truncate">{product.color}</td>
//                                             <td className="p-4 hidden md:table-cell">{product.category}</td>
//                                             <td className="p-4 text-gray-600">{availableSizes}</td>
//                                             <td className="p-4 text-gray-600">₹{product.mrp}</td>
//                                             <td className="p-4">₹{product.sale}</td>
//                                             <td className="p-4 text-gray-600 font-medium">{totalStock}</td>
//                                             <td className="p-4 max-w-[1rem] truncate">{product.description}</td>
//                                             <td className="p-4">
//                                                 <div className="relative">
//                                                     <button className="hover:text-gray-900" onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}>
//                                                         <MoreVertical size={20} />
//                                                     </button>
//                                                     {openMenuId === product.id && (
//                                                         <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
//                                                             <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleEdit(product); }}>
//                                                                 Edit
//                                                             </a>
//                                                             <a className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" onClick={(e) => { e.preventDefault(); handleDelete(product.id); }}>
//                                                                 Delete
//                                                             </a>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}
//             {showForm && <ProductForm toggleForm={setShowForm} fetchProducts={fetchProducts} productToEdit={productToEdit} />}
//         </>
//     );
// };

// export default ProductsView;


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
import { PlusCircle, MoreVertical, X, Trash2 } from "lucide-react";
import { v4 as uuid } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase/firebaseConfig";

//==============================================================================
// ✅ Reusable Form Component (Heavily Modified for Variants)
//==============================================================================
const ProductForm = ({ toggleForm, fetchProducts, productToEdit }) => {
  const isEditMode = Boolean(productToEdit);

  // --- COMMON PRODUCT DATA ---
  // This state holds data shared by all variants
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    mrp: "",
    sale: "",
    description: "",
  });

  // --- ✅ VARIANT STATE ---
  // This is the new core state. It's an array of variant objects.
  // Each variant has its own color, images, and sizes.
  const [variants, setVariants] = useState([
    {
      id: uuid(), // React key
      colorName: "",
      imageUrls: [], // Existing, uploaded URLs
      imageFiles: [], // New files to upload
      sizes: [{ id: uuid(), size: "", stock: "" }], // Sizes for *this* variant
    },
  ]);

  // Pre-fill the form if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // 1. Set common data
      setFormData({
        name: productToEdit.name || "",
        category: productToEdit.category || "",
        mrp: productToEdit.mrp || "",
        sale: productToEdit.sale || "",
        description: productToEdit.description || "",
      });

      // 2. Set variant data
      if (productToEdit.variants && productToEdit.variants.length > 0) {
        setVariants(
          productToEdit.variants.map((v) => ({
            id: uuid(), // Add new React key
            colorName: v.colorName || "",
            imageUrls: v.imageUrls || [],
            imageFiles: [], // Start with no new files
            sizes:
              v.sizes && v.sizes.length > 0
                ? v.sizes.map((s) => ({ ...s, id: uuid() })) // Add React keys
                : [{ id: uuid(), size: "", stock: "" }],
          }))
        );
      }
      // Fallback for old data structure (optional, but good practice)
      else {
        setVariants([
          {
            id: uuid(),
            colorName: productToEdit.color || "",
            imageUrls: productToEdit.imageUrls || [productToEdit.imageUrl] || [],
            imageFiles: [],
            sizes:
              productToEdit.sizes && productToEdit.sizes.length > 0
                ? productToEdit.sizes.map((s) => ({ ...s, id: uuid() }))
                : [{ id: uuid(), size: "", stock: "" }],
          },
        ]);
      }
    }
  }, [productToEdit, isEditMode]);

  // --- ✅ VARIANT HANDLERS ---
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: uuid(),
        colorName: "",
        imageUrls: [],
        imageFiles: [],
        sizes: [{ id: uuid(), size: "", stock: "" }],
      },
    ]);
  };

  const removeVariant = (variantId) => {
    if (variants.length > 1) {
      setVariants(variants.filter((v) => v.id !== variantId));
    } else {
      toast.warn("Product must have at least one variant.");
    }
  };

  // Handles color name change
  const handleVariantChange = (variantId, field, value) => {
    setVariants((currentVariants) =>
      currentVariants.map((v) =>
        v.id === variantId ? { ...v, [field]: value } : v
      )
    );
  };

  // Handles adding new image files to a specific variant
  const handleVariantImageChange = (variantId, files) => {
    if (files) {
      setVariants((currentVariants) =>
        currentVariants.map((v) =>
          v.id === variantId
            ? { ...v, imageFiles: [...v.imageFiles, ...Array.from(files)] }
            : v
        )
      );
    }
  };

  // Removes a new, un-uploaded image file
  const handleRemoveNewImage = (variantId, index) => {
    setVariants((currentVariants) =>
      currentVariants.map((v) =>
        v.id === variantId
          ? { ...v, imageFiles: v.imageFiles.filter((_, i) => i !== index) }
          : v
      )
    );
  };

  // Removes an existing, already-uploaded image URL
  const handleRemoveExistingImage = (variantId, index) => {
    setVariants((currentVariants) =>
      currentVariants.map((v) =>
        v.id === variantId
          ? { ...v, imageUrls: v.imageUrls.filter((_, i) => i !== index) }
          : v
      )
    );
  };

  // --- ✅ NESTED SIZE HANDLERS ---
  // These now all require a variantId to know *which* variant's sizes to change
  const handleSizeChange = (variantId, sizeId, field, value) => {
    setVariants((currentVariants) =>
      currentVariants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              sizes: v.sizes.map((s) =>
                s.id === sizeId ? { ...s, [field]: value } : s
              ),
            }
          : v
      )
    );
  };

  const addSize = (variantId) => {
    setVariants((currentVariants) =>
      currentVariants.map((v) =>
        v.id === variantId
          ? { ...v, sizes: [...v.sizes, { id: uuid(), size: "", stock: "" }] }
          : v
      )
    );
  };

  const removeSize = (variantId, sizeId) => {
    setVariants((currentVariants) =>
      currentVariants.map((v) => {
        if (v.id !== variantId) return v;
        if (v.sizes.length <= 1) {
          toast.warn("A variant must have at least one size.");
          return v;
        }
        return {
          ...v,
          sizes: v.sizes.filter((s) => s.id !== sizeId),
        };
      })
    );
  };

  // --- COMMON FORM DATA HANDLER ---
  const handleCommonChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- FIRESTORE HANDLERS (Unchanged) ---
  const addProduct = async (productData) => {
    // ... (Your existing addProduct function)
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

  const updateProduct = async (productId, productData) => {
    // ... (Your existing updateProduct function)
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

  // --- ✅ SUBMIT HANDLER (Heavily Modified) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.info("Processing product, please wait...");

    try {
      const finalVariantsData = [];

      // We must use a for...of loop to handle async uploads sequentially
      for (const variant of variants) {
        let uploadedImageUrls = [];

        // 1. Upload new images for *this* variant
        if (variant.imageFiles.length > 0) {
          toast.info(
            `Uploading images for ${variant.colorName || "new variant"}...`
          );

          const uploadPromises = variant.imageFiles.map((file) => {
            const uploadFormData = new FormData();
            uploadFormData.append("image", file);
            return fetch("https://sasha-backend.onrender.com/api/upload", {
              method: "POST",
              body: uploadFormData,
            }).then((response) => response.json());
          });

          const results = await Promise.all(uploadPromises);
          const successfulUploads = results.filter((result) => result.success);

          if (successfulUploads.length !== variant.imageFiles.length) {
            toast.error(
              `Some images failed to upload for ${variant.colorName}.`
            );
            return; // Stop submission
          }
          uploadedImageUrls = successfulUploads.map((result) => result.data.url);
        }

        // 2. Combine existing and new URLs for this variant
        const finalImageUrls = [...variant.imageUrls, ...uploadedImageUrls];
        if (finalImageUrls.length === 0) {
          toast.error(
            `Variant "${variant.colorName}" must have at least one image.`
          );
          return;
        }

        // 3. Format sizes for this variant
        const finalSizes = variant.sizes
          .map(({ size, stock }) => ({
            size,
            stock: Number(stock || 0),
          }))
          .filter(s => s.size); // Filter out empty size fields

        if (finalSizes.length === 0 || finalSizes.some(s => !s.size || (s.stock < 0))) {
            toast.error(`Please fill all size/stock fields for "${variant.colorName}".`);
            return;
        }

        // 4. Add this complete variant's data to our final array
        finalVariantsData.push({
          colorName: variant.colorName,
          imageUrls: finalImageUrls,
          sizes: finalSizes,
        });
      }

      // 5. Prepare final *product* data
      const finalProductData = {
        ...formData,
        variants: finalVariantsData, // Add the array of variants
      };

      // 6. Add or Update
      if (isEditMode) {
        await updateProduct(productToEdit.id, finalProductData);
      } else {
        await addProduct(finalProductData);
      }
    } catch (error) {
      console.error("Error processing product:", error);
      toast.error("An error occurred. Please check console.");
    }
  };

  // --- ✅ JSX (Heavily Modified) ---
  return (
    <div className="relative bg-white p-6 rounded-xl shadow-sm space-y-6 z-10">
      <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- Common Product Details --- */}
        <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold text-lg text-gray-800">Common Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="border p-2 rounded-md" type="text" name="name" placeholder="Product Name" required value={formData.name} onChange={handleCommonChange} />
                <input className="border p-2 rounded-md" type="text" name="category" placeholder="Category" required value={formData.category} onChange={handleCommonChange} />
                <input className="border p-2 rounded-md" type="number" name="mrp" placeholder="MRP" required value={formData.mrp} onChange={handleCommonChange} />
                <input className="border p-2 rounded-md" type="number" name="sale" placeholder="Sale Price" required value={formData.sale} onChange={handleCommonChange} />
                <textarea className="border p-2 rounded-md md:col-span-2" name="description" placeholder="Product Description" required value={formData.description} onChange={handleCommonChange}></textarea>
            </div>
        </div>

        {/* --- ✅ Variants Section --- */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg text-gray-800">Product Variants (by Color)</h3>
          {variants.map((variant, variantIndex) => (
            <div
              key={variant.id}
              className="p-4 border-2 border-dashed rounded-lg space-y-4 relative"
            >
              {/* --- Remove Variant Button --- */}
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(variant.id)}
                  className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 leading-none"
                >
                  <X size={16} />
                </button>
              )}

              <h4 className="font-semibold text-gray-700">
                Variant {variantIndex + 1}
              </h4>
              
              {/* --- Color Input --- */}
              <input
                className="border p-2 rounded-md w-full"
                type="text"
                placeholder="Color Name (e.g., Red, Navy Blue)"
                required
                value={variant.colorName}
                onChange={(e) =>
                  handleVariantChange(variant.id, "colorName", e.target.value)
                }
              />

              {/* --- Image Uploader (per variant) --- */}
              <div>
                <label className="text-sm font-medium text-gray-700">Images for this color</label>
                <input
                  className="border p-2 rounded-md w-full mt-1"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleVariantImageChange(variant.id, e.target.files)
                  }
                  multiple
                />
              </div>

              {/* --- Image Preview (per variant) --- */}
              <div className="flex flex-wrap gap-4 border p-4 rounded-md min-h-[100px]">
                {/* Existing Images */}
                {variant.imageUrls.map((url, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveExistingImage(variant.id, index)
                      }
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {/* New Images */}
                {variant.imageFiles.map((file, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={URL.createObjectURL(file)} alt={`New Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(variant.id, index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* --- Sizes & Stock (per variant) --- */}
              <div className="p-4 border rounded-lg space-y-3">
                <h3 className="font-semibold text-gray-700">Sizes & Stock for {variant.colorName || "this color"}</h3>
                {variant.sizes.map((s, index) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <input
                      placeholder="Size (e.g., M)"
                      value={s.size}
                      onChange={(e) =>
                        handleSizeChange(variant.id, s.id, "size", e.target.value)
                      }
                      className="border p-2 rounded-md w-1/2"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={s.stock}
                      onChange={(e) =>
                        handleSizeChange(
                          variant.id,
                          s.id,
                          "stock",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded-md w-1/2"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(variant.id, s.id)}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSize(variant.id)}
                  className="text-sm font-medium text-blue-600 mt-2"
                >
                  + Add Another Size
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- Add Variant Button --- */}
        <button
          type="button"
          onClick={addVariant}
          className="w-full text-center px-4 py-2 border border-dashed border-blue-500 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          + Add Another Color Variant
        </button>

        {/* --- Form Submission Buttons --- */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditMode ? "Save Changes" : "Add Product"}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => toggleForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

//==============================================================================
// ✅ Products View (List Table Modified)
//==============================================================================
const ProductsView = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

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

  const handleDelete = async (productId) => {
    setOpenMenuId(null);
    try {
      await deleteDoc(doc(db, "products", productId));
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setShowForm(true);
    setOpenMenuId(null);
  };

  const handleAdd = () => {
    setProductToEdit(null);
    setShowForm(true);
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      {!showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Product Catalog
            </h3>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleAdd}
            >
              <PlusCircle size={20} />
              <span>Add New Product</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4">Product</th>
                  <th className="p-4 hidden sm:table-cell">Colors</th>
                  <th className="p-4 hidden md:table-cell">Category</th>
                  <th className="p-4 hidden lg:table-cell">Sizes</th>
                  <th className="p-4">MRP</th>
                  <th className="p-4">Sale</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  // --- ✅ Updated Logic for Variant Data ---
                  
                  // Get first image of first variant (or fallback)
                  let displayImage = "https://via.placeholder.com/150";
                  if (
                    product.variants &&
                    product.variants.length > 0 &&
                    product.variants[0].imageUrls &&
                    product.variants[0].imageUrls.length > 0
                  ) {
                    displayImage = product.variants[0].imageUrls[0];
                  } else if (product.imageUrls && product.imageUrls.length > 0) {
                    displayImage = product.imageUrls[0]; // Fallback 1
                  } else if (product.imageUrl) {
                    displayImage = product.imageUrl; // Fallback 2
                  }

                  // Calculate total stock across all variants
                  const totalStock =
                    product.variants?.reduce(
                      (totalSum, variant) =>
                        totalSum +
                        variant.sizes.reduce(
                          (variantSum, s) => variantSum + Number(s.stock || 0),
                          0
                        ),
                      0
                    ) ?? product.stock; // Fallback

                  // Get all available colors
                  const availableColors =
                    product.variants?.map((v) => v.colorName).join(", ") ??
                    product.color; // Fallback

                  // Get all unique sizes
                  const allSizes = product.variants?.flatMap((v) => v.sizes.map((s) => s.size)) ?? [];
                  const uniqueSizes = [...new Set(allSizes)].join(", ");

                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">
                        <div className="flex items-center gap-6">
                          <img
                            src={displayImage}
                            alt={product.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <span className="max-w-[10rem] truncate">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 max-w-[10rem] truncate">{availableColors}</td>
                      <td className="p-4 hidden md:table-cell">
                        {product.category}
                      </td>
                      <td className="p-4 text-gray-600 max-w-[10rem] truncate">{uniqueSizes}</td>
                      <td className="p-4 text-gray-600">₹{product.mrp}</td>
                      <td className="p-4">₹{product.sale}</td>
                      <td className="p-4 text-gray-600 font-medium">
                        {totalStock}
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <button
                            className="hover:text-gray-900"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === product.id ? null : product.id
                              )
                            }
                          >
                            <MoreVertical size={20} />
                          </button>
                          {openMenuId === product.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                              <a
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEdit(product);
                                }}
                              >
                                Edit
                              </a>
                              <a
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(product.id);
                                }}
                              >
                                Delete
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showForm && (
        <ProductForm
          toggleForm={setShowForm}
          fetchProducts={fetchProducts}
          productToEdit={productToEdit}
        />
      )}
    </>
  );
};

export default ProductsView;