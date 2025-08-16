
// // /* eslint-disable no-unused-vars */
// // import React, { useContext, useEffect, useState } from 'react';
// // import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Zap, Volume2, Battery, Bluetooth } from 'lucide-react';
// // import DataContext from '../context/Context';
// // import { useNavigate } from 'react-router-dom';
// // import { toast, ToastContainer } from 'react-toastify';
// // import { useCart } from '../context/CartContext';
// // import { v4 as uui } from 'uuid';
// // import { useWishlist } from '../context/WishlistContext.jsx';

// // export default function ProductDetailsPage() {
// //     const [selectedImage, setSelectedImage] = useState(0);
// //     const [selectedColor, setSelectedColor] = useState('midnight');
// //     const [quantity, setQuantity] = useState(1); // This state holds the selected quantity
// //     const [isWishlisted, setIsWishlisted] = useState(false);
// //     const [activeTab, setActiveTab] = useState('features');
// //     const { productData } = useContext(DataContext);
// //     const [product, setProduct] = useState(() => {
// //         const stored = localStorage.getItem('productData');
// //         return stored ? JSON.parse(stored) : null;
// //     });
// //     const [isClicked, setIsClicked] = useState(false);
// //     const { cart, dispatch } = useCart();
// //     const navigate = useNavigate();
// //     // CHANGE 1: Update the function to accept the quantity
// //     const addCartItem = (item, quantity) => {
// //         setIsClicked(true);

// //         // CHANGE 2: Add the quantity to the payload object
// //         dispatch({ type: 'ADD', payload: { ...item, id: uui(), quantity: quantity } });
// //         localStorage.setItem("cartCount", JSON.stringify(cart.length + 1));
// //         toast.success(`${item.name} (x${quantity}) added!`, {
// //             position: "bottom-right",
// //             autoClose: 3000,
// //             hideProgressBar: true,
// //             closeOnClick: true,
// //             pauseOnHover: true,
// //             draggable: true,
// //             progress: undefined,
// //         });
// //     };
// //     const { wishlist, dispatch: wishlistDispatch } = useWishlist();
    
// //     useEffect(() => {
// //         setIsWishlisted(wishlist.some(item => item.id === product.id));
// //     }, [wishlist,product.id]);

// //     const handleWishlistToggle = () => {
// //         if (isWishlisted) {
// //             wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
// //         } else {
// //             wishlistDispatch({ type: 'ADD_ITEM', payload: product });
// //         }
// //     };

// //     const colors = [
// //         { name: 'midnight', value: '#1a1a2e', label: 'Midnight Black' },
// //         { name: 'storm', value: '#6b7280', label: 'Storm Gray' },
// //         { name: 'rose', value: '#f43f5e', label: 'Rose Gold' },
// //         { name: 'ocean', value: '#0ea5e9', label: 'Ocean Blue' }
// //     ];

// //     return (
// //         <div className="min-h-screen ">
// //             <div className="container mx-auto px-4 py-8 ">
// //                 <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-10">
// //                     <ToastContainer
// //                         position="top-right"
// //                         autoClose={3000}
// //                         hideProgressBar={false}
// //                         newestOnTop={false}
// //                         closeOnClick={false}
// //                         rtl={false}
// //                         pauseOnFocusLoss
// //                         draggable
// //                         pauseOnHover
// //                         theme="light"
// //                     />
// //                     <div className="grid lg:grid-cols-2 gap-8 p-8">
// //                         {/* Image Gallery */}
// //                         <div className="space-y-4">
// //                             <div className="relative group">
// //                                 <img
// //                                     src={productData.imageUrl ? productData.imageUrl : product.imageUrl}
// //                                     alt="Product"
// //                                     className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl transition-transform duration-500 "
// //                                 />
// //                                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
// //                             </div>
// //                         </div>

// //                         {/* Product Info */}
// //                         <div className="space-y-6 ">
// //                             <div>
// //                                 <div className="flex justify-end mb-2">
// //                                     <button
// //                                         onClick={() => handleWishlistToggle()}
// //                                         className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-gray-300/20 ' : 'bg-white/10  hover:bg-gray-600/20'
// //                                             }`}
// //                                     >
// //                                         <Heart  className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
// //                                     </button>
// //                                 </div>
// //                                 <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-300 bg-clip-text text-transparent">
// //                                     {productData.name ? productData.name : product.name}
// //                                 </h1>

// //                                 {/* Rating */}
// //                                 <div className="flex items-center space-x-2 mb-4">
// //                                     <div className="flex items-center">
// //                                         {[...Array(5)].map((_, i) => (
// //                                             <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
// //                                         ))}
// //                                     </div>
// //                                     <span className="/80">{productData.rating ? productData.rating : product.rating} ({productData.reviewCount ? productData.reviewCount : product.reviewCount} reviews)</span>
// //                                 </div>
// //                             </div>

// //                             {/* Price */}
// //                             <div className="space-y-2">
// //                                 <div className="flex items-center space-x-3">
// //                                     <span className="text-3xl font-bold ">{productData.price ? productData.price : product.price}</span>
// //                                     <span className="bg-gradient-to-r from-green-400 to-green-600  px-3 py-1 rounded-full text-sm font-medium">
// //                                         25% OFF
// //                                     </span>
// //                                 </div>
// //                                 <p className="text-green-900 text-sm">Free shipping on orders over $200</p>
// //                             </div>

// //                             {/* Color Selection */}
// //                             <div className="space-y-3">
// //                                 <h3 className="text-lg font-semibold">Color: {colors.find(c => c.name === selectedColor)?.label}</h3>
// //                                 <div className="flex space-x-3">
// //                                     {colors.map((color) => (
// //                                         <button
// //                                             key={color.name}
// //                                             onClick={() => setSelectedColor(color.name)}
// //                                             className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${selectedColor === color.name
// //                                                 ? 'border-white scale-110 shadow-lg'
// //                                                 : 'border-white/30 hover:border-white/60 hover:scale-105'
// //                                                 }`}
// //                                             style={{ backgroundColor: color.value }}
// //                                         />
// //                                     ))}
// //                                 </div>
// //                             </div>

// //                             {/* Quantity and Add to Cart */}
// //                             <div className="space-y-4">
// //                                 <div className="flex items-center space-x-4">
// //                                     <span className="text-lg font-semibold">Quantity:</span>
// //                                     <div className="flex items-center bg-white/10 rounded-lg">
// //                                         <button
// //                                             onClick={() => setQuantity(Math.max(1, quantity - 1))}
// //                                             className="px-3 py-2 hover:bg-white/10 transition-colors rounded-l-lg"
// //                                         >
// //                                             -
// //                                         </button>
// //                                         <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
// //                                         <button
// //                                             onClick={() => setQuantity(quantity + 1)}
// //                                             className="px-3 py-2 hover:bg-white/10 transition-colors rounded-r-lg"
// //                                         >
// //                                             +
// //                                         </button>
// //                                     </div>
// //                                 </div>

// //                                 <div className="flex space-x-3">
                                    
// //                                     <button
// //                                         disabled={isClicked}
// //                                         onClick={() => addCartItem(productData ? productData : product, quantity)}
// //                                         className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700  py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] shadow-lg flex items-center justify-center space-x-2">
// //                                         <ShoppingCart className="w-5 h-5" />
// //                                         <span>{isClicked ? 'Added!' : 'Add to Cart'}</span>
// //                                     </button>
// //                                     <button
// //                                         onClick={() => { addCartItem(productData ? productData : product, quantity); navigate('/checkout') }}
// //                                         className="inline-block  rounded-2xl border-2 border-dashed border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
// //                                         Buy Now
// //                                     </button>
// //                                 </div>
// //                             </div>

// //                             {/* Trust indicators */}
// //                             <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
// //                                 <div className="flex items-center space-x-2 text-sm">
// //                                     <Truck className="w-5 h-5 text-green-400" />
// //                                     <span>Free Shipping</span>
// //                                 </div>
// //                                 <div className="flex items-center space-x-2 text-sm">
// //                                     <Shield className="w-5 h-5 text-blue-400" />
// //                                     <span>2 Year Warranty</span>
// //                                 </div>
// //                                 <div className="flex items-center space-x-2 text-sm">
// //                                     <RotateCcw className="w-5 h-5 text-purple-400" />
// //                                     <span>30 Day Returns</span>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Product Details Tabs (code truncated for brevity) */}
// //                     <div className="absolute border-t border-black/20">
// //                         <button>Back</button>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }



// /* eslint-disable no-unused-vars */
// import React, { useContext, useEffect, useState } from 'react';
// import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Zap, Volume2, Battery, Bluetooth, Send, Camera } from 'lucide-react';
// import DataContext from '../context/Context';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import { useCart } from '../context/CartContext';
// import { v4 as uui } from 'uuid';
// import { useWishlist } from '../context/WishlistContext.jsx';


// // --- Mock Data for demonstration ---
// const initialReviews = [
//     {
//         id: uui(),
//         author: 'Jane Doe',
//         rating: 5,
//         text: 'Absolutely love these headphones! The sound quality is crisp and the noise cancellation is top-notch. Highly recommend!',
//         image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     },
//     {
//         id: uui(),
//         author: 'John Smith',
//         rating: 4,
//         text: 'Great product, very comfortable for long listening sessions. The battery life is impressive. Only wish it came with a harder case.',
//         image: null,
//     }
// ];


// export default function ProductDetailsPage() {
//     const [selectedImage, setSelectedImage] = useState(0);
//     const [selectedColor, setSelectedColor] = useState('midnight');
//     const [quantity, setQuantity] = useState(1);
//     const [isWishlisted, setIsWishlisted] = useState(false);
//     const [activeTab, setActiveTab] = useState('features');
//     const { productData } = useContext(DataContext);
//     const [product, setProduct] = useState(() => {
//         const stored = localStorage.getItem('productData');
//         return stored ? JSON.parse(stored) : null;
//     });
//     const [isClicked, setIsClicked] = useState(false);
//     const { cart, dispatch } = useCart();
//     const navigate = useNavigate();

//     // --- State for Reviews Section ---
//     const [reviews, setReviews] = useState(initialReviews);
//     const [newReviewText, setNewReviewText] = useState('');
//     const [newReviewImage, setNewReviewImage] = useState(null);
//     const [newReviewRating, setNewReviewRating] = useState(5);


//     const addCartItem = (item, quantity) => {
//         setIsClicked(true);
//         dispatch({ type: 'ADD', payload: { ...item, id: uui(), quantity: quantity } });
//         localStorage.setItem("cartCount", JSON.stringify(cart.length + 1));
//         toast.success(`${item.name} (x${quantity}) added!`, {
//             position: "bottom-right",
//             autoClose: 3000,
//             hideProgressBar: true,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//         });
//     };
//     const { wishlist, dispatch: wishlistDispatch } = useWishlist();
    
//     useEffect(() => {
//         if (product) {
//             setIsWishlisted(wishlist.some(item => item.id === product.id));
//         }
//     }, [wishlist, product]);

//     const handleWishlistToggle = () => {
//         if (isWishlisted) {
//             wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
//         } else {
//             wishlistDispatch({ type: 'ADD_ITEM', payload: product });
//         }
//     };

//     const handleImageUpload = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             setNewReviewImage(URL.createObjectURL(file));
//         }
//     };

//     const handleReviewSubmit = (e) => {
//         e.preventDefault();
//         if (!newReviewText.trim()) {
//             toast.error("Please write a review before submitting.", { position: "bottom-right" });
//             return;
//         }

//         const newReview = {
//             id: uui(),
//             author: 'CurrentUser', // In a real app, get this from auth context
//             rating: newReviewRating,
//             text: newReviewText,
//             image: newReviewImage,
//         };

//         setReviews([newReview, ...reviews]);
//         setNewReviewText('');
//         setNewReviewImage(null);
//         setNewReviewRating(5);
//         toast.success("Thank you for your review!", { position: "bottom-right" });
//     };


//     const colors = [
//         { name: 'midnight', value: '#1a1a2e', label: 'Midnight Black' },
//         { name: 'storm', value: '#6b7280', label: 'Storm Gray' },
//         { name: 'rose', value: '#f43f5e', label: 'Rose Gold' },
//         { name: 'ocean', value: '#0ea5e9', label: 'Ocean Blue' }
//     ];
//     if (!product) {
//         return <div>Loading product...</div>; // or a loading spinner
//     }

//     return (
//         <div className="min-h-screen ">
//             <div className="container mx-auto px-4 py-8 ">
//                 <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-10">
//                     <ToastContainer theme="dark" />
//                     <div className="grid lg:grid-cols-2 gap-8 p-8">
//                         {/* Image Gallery */}
//                         <div className="space-y-4">
//                             <div className="relative group">
//                                 <img
//                                     src={productData.imageUrl ? productData.imageUrl : product.imageUrl}
//                                     alt="Product"
//                                     className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl transition-transform duration-500 "
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                             </div>
//                         </div>

//                         {/* Product Info */}
//                         <div className="space-y-6 ">
//                             <div>
//                                 <div className="flex justify-end mb-2">
//                                     <button
//                                         onClick={() => handleWishlistToggle()}
//                                         className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-gray-300/20 ' : 'bg-white/10  hover:bg-gray-600/20'
//                                             }`}
//                                     >
//                                         <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
//                                     </button>
//                                 </div>
//                                 <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-300 bg-clip-text text-transparent">
//                                     {productData.name ? productData.name : product.name}
//                                 </h1>

//                                 {/* Rating */}
//                                 <div className="flex items-center space-x-2 mb-4">
//                                     <div className="flex items-center">
//                                         {[...Array(5)].map((_, i) => (
//                                             <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
//                                         ))}
//                                     </div>
//                                     <span className="/80">{productData.rating ? productData.rating : product.rating} ({productData.reviewCount ? productData.reviewCount : product.reviewCount} reviews)</span>
//                                 </div>
//                             </div>

//                             {/* Price */}
//                             <div className="space-y-2">
//                                 <div className="flex items-center space-x-3">
//                                     <span className="text-3xl font-bold ">{productData.price ? productData.price : product.price}</span>
//                                     <span className="bg-gradient-to-r from-green-400 to-green-600  px-3 py-1 rounded-full text-sm font-medium">
//                                         25% OFF
//                                     </span>
//                                 </div>
//                                 <p className="text-green-900 text-sm">Free shipping on orders over $200</p>
//                             </div>

//                             {/* Color Selection */}
//                             <div className="space-y-3">
//                                 <h3 className="text-lg font-semibold">Color: {colors.find(c => c.name === selectedColor)?.label}</h3>
//                                 <div className="flex space-x-3">
//                                     {colors.map((color) => (
//                                         <button
//                                             key={color.name}
//                                             onClick={() => setSelectedColor(color.name)}
//                                             className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${selectedColor === color.name
//                                                     ? 'border-white scale-110 shadow-lg'
//                                                     : 'border-white/30 hover:border-white/60 hover:scale-105'
//                                                 }`}
//                                             style={{ backgroundColor: color.value }}
//                                         />
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Quantity and Add to Cart */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center space-x-4">
//                                     <span className="text-lg font-semibold">Quantity:</span>
//                                     <div className="flex items-center bg-white/10 rounded-lg">
//                                         <button
//                                             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                             className="px-3 py-2 hover:bg-white/10 transition-colors rounded-l-lg"
//                                         >
//                                             -
//                                         </button>
//                                         <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
//                                         <button
//                                             onClick={() => setQuantity(quantity + 1)}
//                                             className="px-3 py-2 hover:bg-white/10 transition-colors rounded-r-lg"
//                                         >
//                                             +
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <div className="flex space-x-3">
                                    
//                                     <button
//                                         disabled={isClicked}
//                                         onClick={() => addCartItem(productData ? productData : product, quantity)}
//                                         className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700  py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] shadow-lg flex items-center justify-center space-x-2">
//                                         <ShoppingCart className="w-5 h-5" />
//                                         <span>{isClicked ? 'Added!' : 'Add to Cart'}</span>
//                                     </button>
//                                     <button
//                                         onClick={() => { addCartItem(productData ? productData : product, quantity); navigate('/checkout') }}
//                                         className="inline-block  rounded-lg border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
//                                         Buy Now
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Trust indicators */}
//                             <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
//                                 <div className="flex items-center space-x-2 text-sm">
//                                     <Truck className="w-5 h-5 text-green-400" />
//                                     <span>Free Shipping</span>
//                                 </div>
//                                 <div className="flex items-center space-x-2 text-sm">
//                                     <Shield className="w-5 h-5 text-blue-400" />
//                                     <span>2 Year Warranty</span>
//                                 </div>
//                                 <div className="flex items-center space-x-2 text-sm">
//                                     <RotateCcw className="w-5 h-5 text-purple-400" />
//                                     <span>30 Day Returns</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* --- NEW: Reviews and Comments Section --- */}
//                     <div className="p-8 border-t border-white/20">
//                         <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
                        
//                         {/* Review Submission Form */}
//                         <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20">
//                             <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
//                             <div className="flex items-center mb-4">
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star 
//                                         key={i} 
//                                         className={`w-6 h-6 cursor-pointer transition-colors ${i < newReviewRating ? 'fill-yellow-400' : 'text-gray-500'}`}
//                                         onClick={() => setNewReviewRating(i + 1)}
//                                     />
//                                 ))}
//                             </div>
//                             <textarea
//                                 value={newReviewText}
//                                 onChange={(e) => setNewReviewText(e.target.value)}
//                                 placeholder="Share your thoughts..."
//                                 className="w-full p-3 bg-white/5 rounded-lg border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
//                                 rows="4"
//                             ></textarea>
//                             <div className="flex justify-between items-center mt-4">
//                                 <label className="flex items-center border-2 gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-300/20 transition-all hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none">
//                                     <Camera className="w-5 h-5" />
//                                     <span>{newReviewImage ? 'Change Image' : 'Add Image'}</span>
//                                     <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
//                                 </label>
//                                 <button type="submit" className="flex items-center gap-2  rounded-xl border-2  border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
//                                     <Send className="w-5 h-5" />
//                                     <span>Submit</span>
//                                 </button>
//                             </div>
//                             {newReviewImage && <img src={newReviewImage} alt="Review preview" className="mt-4 h-24 w-24 object-cover rounded-lg" />}
//                         </form>

//                         {/* Existing Reviews List */}
//                         <div className="space-y-6">
//                             {reviews.map(review => (
//                                 <div key={review.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
//                                     <div className="flex items-start gap-4">
//                                         <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-xl">
//                                             {review.author.charAt(0)}
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="flex items-center justify-between">
//                                                 <h4 className="font-bold text-lg">{review.author}</h4>
//                                                 <div className="flex">
//                                                     {[...Array(5)].map((_, i) => (
//                                                         <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                             <p className="mt-2 text-gray-300">{review.text}</p>
//                                             {review.image && (
//                                                 <img src={review.image} alt="User review" className="mt-4 rounded-lg max-h-64 object-cover" />
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Adjust path to your Firebase config

// --- UI & Context ---
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Send, Camera } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext.jsx';
import { v4 as uuid } from 'uuid';

// --- Mock Data for Reviews (can be replaced with DB data) ---
const initialReviews = [
    {
        id: uuid(),
        author: 'Jane Doe',
        rating: 5,
        text: 'Absolutely love these! The quality is top-notch. Highly recommend!',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: uuid(),
        author: 'John Smith',
        rating: 4,
        text: 'Great product, very comfortable. The battery life is impressive.',
        image: null,
    }
];

export default function ProductDetailsPage() {
    const { productId } = useParams(); // Get product ID from URL
    const navigate = useNavigate();

    // --- Component State ---
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState('midnight');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isClicked, setIsClicked] = useState(false); // For 'Add to Cart' button state

    // --- Reviews State ---
    const [reviews, setReviews] = useState(initialReviews);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewImage, setNewReviewImage] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState(5);

    // --- Contexts ---
    const { cart, dispatch: cartDispatch } = useCart();
    const { wishlist, dispatch: wishlistDispatch } = useWishlist();

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            setLoading(true);
            try {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document!");
                    toast.error("Product not found.");
                    setProduct(null);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    // --- Wishlist Status Effect ---
    useEffect(() => {
        if (product) {
            setIsWishlisted(wishlist.some(item => item.id === product.id));
        }
    }, [wishlist, product]);


    // --- Event Handlers ---
    const addCartItem = (item, qty) => {
        setIsClicked(true);
        cartDispatch({ type: 'ADD', payload: { ...item, id: uuid(), quantity: qty } });
        toast.success(`${item.name} (x${qty}) added to cart!`, { position: "bottom-right" });
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        const action = isWishlisted ? 'REMOVE_ITEM' : 'ADD_ITEM';
        const payload = isWishlisted ? product.id : product;
        wishlistDispatch({ type: action, payload });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!newReviewText.trim()) {
            toast.error("Please write a review before submitting.", { position: "bottom-right" });
            return;
        }

        const newReview = {
            id: uuid(),
            author: 'CurrentUser', // In a real app, get this from an auth context
            rating: newReviewRating,
            text: newReviewText,
            image: newReviewImage,
        };

        setReviews([newReview, ...reviews]);
        setNewReviewText('');
        setNewReviewImage(null);
        setNewReviewRating(5);
        toast.success("Thank you for your review!", { position: "bottom-right" });
    };

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewReviewImage(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    // --- UI Data ---
    const colors = [
        { name: 'midnight', value: '#1a1a2e', label: 'Midnight Black' },
        { name: 'storm', value: '#6b7280', label: 'Storm Gray' },
        { name: 'rose', value: '#f43f5e', label: 'Rose Gold' },
        { name: 'ocean', value: '#0ea5e9', label: 'Ocean Blue' }
    ];

    // --- Render Logic ---
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-10">
                    <ToastContainer theme="dark" />
                    <div className="grid lg:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="relative group">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-300 bg-clip-text text-transparent">
                                        {product.name}
                                    </h1>
                                    <button
                                        onClick={handleWishlistToggle}
                                        className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-gray-300/20' : 'bg-white/10 hover:bg-gray-600/20'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                                        ))}
                                    </div>
                                    <span>{product.rating} ({product.reviewCount} reviews)</span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-bold">₹{product.price}</span>
                                    <span className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-full text-sm font-medium">25% OFF</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Color: {colors.find(c => c.name === selectedColor)?.label}</h3>
                                <div className="flex space-x-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${selectedColor === color.name ? 'border-white scale-110 shadow-lg' : 'border-white/30 hover:border-white/60'}`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-lg font-semibold">Quantity:</span>
                                    <div className="flex items-center bg-white/10 rounded-lg">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-white/10 rounded-l-lg">-</button>
                                        <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-white/10 rounded-r-lg">+</button>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        disabled={isClicked}
                                        onClick={() => addCartItem(product, quantity)}
                                        className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>{isClicked ? 'Added!' : 'Add to Cart'}</span>
                                    </button>
                                    <button
                                        onClick={() => { addCartItem(product, quantity); navigate('/checkout') }}
                                        className="inline-block rounded-lg border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                                <div className="flex items-center space-x-2 text-sm"><Truck className="w-5 h-5 text-green-400" /><span>Free Shipping</span></div>
                                <div className="flex items-center space-x-2 text-sm"><Shield className="w-5 h-5 text-blue-400" /><span>2 Year Warranty</span></div>
                                <div className="flex items-center space-x-2 text-sm"><RotateCcw className="w-5 h-5 text-purple-400" /><span>30 Day Returns</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/20">
                        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
                        <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20">
                            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-6 h-6 cursor-pointer transition-colors ${i < newReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} onClick={() => setNewReviewRating(i + 1)} />
                                ))}
                            </div>
                            <textarea
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full p-3 bg-white/5 rounded-lg border border-white/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                                rows="4"
                            ></textarea>
                            <div className="flex justify-between items-center mt-4">
                                <label className="flex items-center border-2 gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-300/20 transition-all hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none">
                                    <Camera className="w-5 h-5" />
                                    <span>{newReviewImage ? 'Change Image' : 'Add Image'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                                <button type="submit" className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                                    <Send className="w-5 h-5" />
                                    <span>Submit</span>
                                </button>
                            </div>
                            {newReviewImage && <img src={newReviewImage} alt="Review preview" className="mt-4 h-24 w-24 object-cover rounded-lg" />}
                        </form>

                        <div className="space-y-6">
                            {reviews.map(review => (
                                <div key={review.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-xl">{review.author.charAt(0)}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-lg">{review.author}</h4>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-gray-300">{review.text}</p>
                                            {review.image && <img src={review.image} alt="User review" className="mt-4 rounded-lg max-h-64 object-cover" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}