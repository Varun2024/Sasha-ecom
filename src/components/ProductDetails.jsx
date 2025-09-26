
// /* eslint-disable no-unused-vars */
// import React, { useContext, useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig'; // Adjust path to your Firebase config

// // --- UI & Context ---
// import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Send, Camera } from 'lucide-react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useCart } from '../context/CartContext';
// import { useWishlist } from '../context/WishlistContext.jsx';
// import { v4 as uuid } from 'uuid';

// export default function ProductDetailsPage() {
//     const { productId } = useParams();
//     const navigate = useNavigate();

//     // --- Component State ---
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedColor, setSelectedColor] = useState('midnight');
//     const [quantity, setQuantity] = useState(1);
//     const [isWishlisted, setIsWishlisted] = useState(false);
//     const [isClicked, setIsClicked] = useState(false);

//     // ADDED: State to manage the selected size
//     const [selectedSize, setSelectedSize] = useState(null);

//     // --- Reviews State ---
//     const [reviews, setReviews] = useState([]);
//     const [newReviewText, setNewReviewText] = useState('');
//     const [newReviewImage, setNewReviewImage] = useState(null);
//     const [newReviewRating, setNewReviewRating] = useState(5);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // --- Contexts ---
//     const { cart, dispatch: cartDispatch } = useCart();
//     const { wishlist, dispatch: wishlistDispatch } = useWishlist();

//     // --- Data Fetching Effect ---
//     useEffect(() => {
//         const fetchProduct = async () => {
//             if (!productId) return;
//             setLoading(true);
//             try {
//                 const docRef = doc(db, "products", productId);
//                 const docSnap = await getDoc(docRef);

//                 if (docSnap.exists()) {
//                     const productData = { id: docSnap.id, ...docSnap.data() };
//                     setProduct(productData);
//                     setReviews(productData.reviews || []);

//                     // ADDED: Set the default selected size if availableSizes exists
//                     if (productData.availableSizes && productData.availableSizes.length > 0) {
//                         setSelectedSize(productData.availableSizes[0]);
//                     }
//                 } else {
//                     console.log("No such document!");
//                     toast.error("Product not found.");
//                     setProduct(null);
//                 }
//             } catch (error) {
//                 console.error("Error fetching product:", error);
//                 toast.error("Failed to load product details.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProduct();
//     }, [productId]);

//     // --- Wishlist Status Effect ---
//     useEffect(() => {
//         if (product) {
//             setIsWishlisted(wishlist.some(item => item.id === product.id));
//         }
//     }, [wishlist, product]);


//     // --- Event Handlers ---
//     // CHANGED: The addCartItem function now includes the selected size in the payload.
//     const addCartItem = (item, qty, size) => {
//         setIsClicked(true);
//         // Append the selected size to the item payload
//         cartDispatch({ type: 'ADD', payload: { ...item, id: uuid(), quantity: qty, selectedSize: size } });
//         toast.success(`${item.name} (Size: ${size}, x${qty}) added to cart!`, { position: "bottom-right" });
//     };

//     const handleWishlistToggle = () => {
//         if (!product) return;
//         const action = isWishlisted ? 'REMOVE_ITEM' : 'ADD_ITEM';
//         const payload = isWishlisted ? product.id : product;
//         wishlistDispatch({ type: action, payload });
//     };

//     const handleReviewSubmit = async (e) => {
//         e.preventDefault();
//         if (!newReviewText.trim()) {
//             toast.error("Please write a review before submitting.", { position: "bottom-right" });
//             return;
//         }

//         setIsSubmitting(true);

//         const newReview = {
//             id: uuid(),
//             author: 'CurrentUser', // In a real app, get this from an auth context
//             rating: newReviewRating,
//             text: newReviewText,
//         };

//         const updatedReviews = [newReview, ...reviews];

//         try {
//             const productDocRef = doc(db, "products", productId);
//             await updateDoc(productDocRef, {
//                 reviews: updatedReviews
//             });

//             setReviews(updatedReviews);
//             setNewReviewText('');
//             setNewReviewImage(null);
//             setNewReviewRating(5);
//             toast.success("Thank you for your review!", { position: "bottom-right" });

//         } catch (error) {
//             console.error("Error submitting review: ", error);
//             toast.error("Failed to submit review. Please try again.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleImageUpload = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setNewReviewImage(URL.createObjectURL(e.target.files[0]));
//         }
//     };

//     // --- Render Logic ---
//     if (loading) {
//         return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
//     }

//     if (!product) {
//         return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
//     }


//     return (
//         <div className="min-h-screen">
//             <div className="container mx-auto px-4 py-8">
//                 <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-10">
//                     <ToastContainer theme="dark" />
//                     <div className="grid lg:grid-cols-2 gap-8 p-8">
//                         {/* Image Gallery */}
//                         <div className="relative group">
//                             <img
//                                 src={product.imageUrl}
//                                 alt={product.name}
//                                 className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl"
//                             />
//                         </div>

//                         {/* Product Info */}
//                         <div className="space-y-6 flex flex-col">
//                             <div>
//                                 <div className="flex justify-between items-start">
//                                     <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-300 bg-clip-text text-transparent">
//                                         {product.name}
//                                     </h1>
//                                     <button
//                                         onClick={handleWishlistToggle}
//                                         className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-gray-300/20' : 'bg-white/10 hover:bg-gray-600/20'}`}
//                                     >
//                                         <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
//                                     </button>
//                                 </div>
//                                 <div className="flex items-center space-x-2 mb-4">
//                                     <div className="flex items-center">
//                                         {[...Array(5)].map((_, i) => (
//                                             <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
//                                         ))}
//                                     </div>
//                                     <span>{product.rating} ({reviews.length} reviews)</span>
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <div className="flex items-center space-x-3">
//                                     <span className="text-3xl font-bold">₹{product.sale}</span>
//                                     <span className="line-through text-gray-500 mr-2">₹{product.mrp}</span>
//                                     <span className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-full text-sm font-medium"> 25% OFF</span>
//                                 </div>
//                             </div>
//                             {/* availble sizes */}
//                             {product.size}

//                             <div className="space-y-4 pt-4 mt-auto"> {/* Use mt-auto to push to bottom */}
//                                 <div className="flex items-center space-x-4">
//                                     <span className="text-lg font-semibold">Quantity:</span>
//                                     <div className="flex items-center bg-white/10 rounded-lg">
//                                         <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-white/10 rounded-l-lg">-</button>
//                                         <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
//                                         <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-white/10 rounded-r-lg">+</button>
//                                     </div>
//                                 </div>
//                                 <div className="flex space-x-3">
//                                     <button
//                                         disabled={isClicked}
//                                         onClick={() => addCartItem(product, quantity, selectedSize)}
//                                         className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         <ShoppingCart className="w-5 h-5" />
//                                         {/* <span>{isClicked ? 'Added!' : isSizeRequiredAndNotSelected ? 'Select a Size' : 'Add to Cart'}</span> */}
//                                     </button>
//                                     <button

//                                         onClick={() => { addCartItem(product, quantity, selectedSize); navigate('/checkout') }}
//                                         className="inline-block rounded-lg border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
//                                     >
//                                         Buy Now
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
//                                 <div className="flex items-center space-x-2 text-sm"><Truck className="w-5 h-5 text-green-400" /><span>Free Shipping over ₹2000</span></div>
//                                 <div className="flex items-center space-x-2 text-sm"><Shield className="w-5 h-5 text-blue-400" /><span>Fine Quality</span></div>
//                                 <div className="flex items-center space-x-2 text-sm"><RotateCcw className="w-5 h-5 text-purple-400" /><span>30 Day Returns</span></div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Customer Reviews Section (No changes here) */}
//                     <div className="p-8 border-t border-white/20">
//                         <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
//                         <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20">
//                             <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
//                             <div className="flex items-center mb-4">
//                                 {[...Array(5)].map((_, i) => (
//                                     <Star key={i} className={`w-6 h-6 cursor-pointer transition-colors ${i < newReviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} onClick={() => setNewReviewRating(i + 1)} />
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
//                                 <button
//                                     type="submit"
//                                     disabled={isSubmitting}
//                                     className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <Send className="w-5 h-5" />
//                                     <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
//                                 </button>
//                             </div>
//                             {newReviewImage && <img src={newReviewImage} alt="Review preview" className="mt-4 h-24 w-24 object-cover rounded-lg" />}
//                         </form>

//                         <div className="space-y-6">
//                             {reviews.map(review => (
//                                 <div key={review.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
//                                     <div className="flex items-start gap-4">
//                                         <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center font-bold text-xl">{review.author.charAt(0)}</div>
//                                         <div className="flex-1">
//                                             <div className="flex items-center justify-between">
//                                                 <h4 className="font-bold text-lg">{review.author}</h4>
//                                                 <div className="flex">
//                                                     {[...Array(5)].map((_, i) => (
//                                                         <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                             <p className="mt-2 text-gray-300">{review.text}</p>
//                                             {review.image && <img src={review.image} alt="User review" className="mt-4 rounded-lg max-h-64 object-cover" />}
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
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// --- UI & Context ---
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Send, Camera } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext.jsx';
import { v4 as uuid } from 'uuid';

export default function ProductDetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    // --- Component State ---
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // ADDED: State to manage the selected size
    const [selectedSize, setSelectedSize] = useState(null);

    // --- Reviews State ---
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewImage, setNewReviewImage] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedColor, setSelectedColor] = useState('Select color');
    const [selectedImage, setSelectedImage] = useState(null);
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
                    const productData = { id: docSnap.id, ...docSnap.data() };
                    setProduct(productData);
                    setReviews(productData.reviews || []);
                    // ADDED: Set the initial selected image when product data loads
                    if (productData.imageUrls && productData.imageUrls.length > 0) {
                        // Use the new array format if available
                        setSelectedImage(productData.imageUrls[0]);
                    } else if (productData.imageUrl) {
                        // Fallback to the old single imageUrl string if the array isn't found
                        setSelectedImage(productData.imageUrl);
                    }
                    // ADDED: Process the size string and set the default selected size
                    if (productData.size && typeof productData.size === 'string') {
                        const availableSizes = productData.size.split(',');
                        if (availableSizes.length > 0) {
                            setSelectedSize(availableSizes[0]); // Set default to the first size
                        }
                    }
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
    const addCartItem = (item, qty, size) => {
        // Validation check
        if (item.size && !size) {
            toast.error("Please select a size first!");
            return;
        }
        setIsClicked(true);
        cartDispatch({ type: 'ADD', payload: { ...item, id: uuid(), quantity: qty, selectedSize: size } });
        toast.success(`${item.name} (Size: ${size}, x${qty}) added to cart!`, { position: "bottom-right" });
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        const action = isWishlisted ? 'REMOVE_ITEM' : 'ADD_ITEM';
        const payload = isWishlisted ? product.id : product;
        wishlistDispatch({ type: action, payload });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReviewText.trim()) {
            toast.error("Please write a review before submitting.", { position: "bottom-right" });
            return;
        }

        setIsSubmitting(true);

        const newReview = {
            id: uuid(),
            author: 'CurrentUser', // In a real app, get this from an auth context
            rating: newReviewRating,
            text: newReviewText,
            // image field is omitted as per your request to handle it later
        };

        const updatedReviews = [newReview, ...reviews];

        try {
            // Get a reference to the specific product document
            const productDocRef = doc(db, "products", productId);

            // Update only the 'reviews' field in the Firestore document
            await updateDoc(productDocRef, {
                reviews: updatedReviews
            });

            // Update local state to show the new review instantly
            setReviews(updatedReviews);

            // Reset form fields
            setNewReviewText('');
            setNewReviewImage(null);
            setNewReviewRating(5);
            toast.success("Thank you for your review!", { position: "bottom-right" });

        } catch (error) {
            console.error("Error submitting review: ", error);
            toast.error("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = (e) => {
        // ... (rest of the function is unchanged)
    };

    // --- Render Logic ---
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
    }

    // ADDED: Prepare available sizes array and check if a size selection is required
    const availableSizes = (product.size && typeof product.size === 'string') ? product.size.split(',') : [];
    console.log('size list', availableSizes)
    const isSizeRequiredAndNotSelected = availableSizes.length > 0 && !selectedSize;

    // understand this
    const availableColors = (product.color && typeof product.color === 'string') ? product.color.split(',').map(c => c.trim()) : [];

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <ToastContainer autoClose={3000} hideProgressBar={true} theme="dark" />
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-10">
                    <div className="grid lg:grid-cols-2 gap-8 p-8">
                        {/* understand this */}
                        {/* --- CHANGED: Image Gallery --- */}
                        <div className="flex flex-col gap-4">
                            <div className="relative group w-full h-96 lg:h-[500px]">
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-scale-down rounded-2xl shadow-xl transition-transform duration-300 ease-in-out"
                                />
                            </div>
                            {/* Thumbnails */}
                            {product.imageUrls && product.imageUrls.length > 1 && (
                                <div className="flex flex-wrap gap-3">
                                    {product.imageUrls.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(url)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                selectedImage === url 
                                                ? 'border-white scale-105' 
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={url} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* --- END: Image Gallery --- */}

                        {/* Product Info */}
                        <div className="space-y-6 flex flex-col">
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
                                        {/* Star rating logic... */}
                                    </div>
                                    <span>{reviews.length} reviews</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-bold">₹{product.sale}</span>
                                    <span className="line-through text-gray-500 mr-2">₹{product.mrp}</span>
                                    <span className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-full text-sm font-medium"> 25% OFF</span>
                                    

                                </div>
                                {availableColors.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">
                                        Color: <span className="text-gray-500 capitalize">{selectedColor}</span>
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                title={color}
                                                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                                                    selectedColor === color
                                                        ? 'border-black scale-110 shadow-lg'
                                                        : 'border-gray-300 hover:border-white/60'
                                                }`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            </div>
                            {/* --- ADDED: Size Selector UI --- */}
                            {availableSizes.length > 0 && (
                                <div className="space-y-3">
                                    {/* <h3 className="text-lg font-semibold">
                                        Available Sizes:  <span className="font-light text-sm">{product.size}</span>
                                    </h3> */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        Select Size:
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium ${selectedSize === size
                                                        ? 'bg-white text-black border-white shadow-lg'
                                                        : 'bg-transparent text-black border-white/80 hover:border-white'
                                                    }`}
                                            >
                                                {size}
                                            </button>

                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 mt-auto">
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
                                        disabled={isSizeRequiredAndNotSelected}
                                        onClick={() => { addCartItem(product, quantity, selectedSize) }}
                                        className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>{isSizeRequiredAndNotSelected ? 'Select a Size' : 'Add to Cart'}</span>
                                    </button>
                                    <button
                                        disabled={isSizeRequiredAndNotSelected}
                                        onClick={() => { addCartItem(product, quantity, selectedSize); navigate('/checkout') }}
                                        className="inline-block rounded-lg border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                                {/* Shipping info ... */}
                            </div>
                        </div>
                    </div>

                    {/* Customer Reviews Section (Unchanged) ... */}
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
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
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