/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// CHANGED: Import updateDoc to write back to Firestore
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Adjust path to your Firebase config

// --- UI & Context ---
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Send, Camera } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext.jsx';
import { v4 as uuid } from 'uuid';

// --- REMOVED: Mock data is no longer needed ---

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
    // CHANGED: State is now initialized as an empty array, to be filled by Firestore data.
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewImage, setNewReviewImage] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState(5);
    // ADDED: State to manage the submission button's state
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    // CHANGED: Populate reviews from the product document. Default to an empty array if no reviews exist.
                    setReviews(productData.reviews || []);
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

    // CHANGED: Rewrote handleReviewSubmit to be async and update Firestore
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
                                    {/* CHANGED: Review count is now dynamic based on the reviews array length */}
                                    <span>{product.rating} ({reviews.length} reviews)</span>
                                </div>
                            </div>
                            
                            {/* ... Rest of your product info JSX ... */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-bold">₹{product.sale}</span>
                                    <span className="line-through text-gray-500 mr-2">₹{product.mrp}</span>
                                    <span className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-full text-sm font-medium"> 25% OFF</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Color: {product.color}</h3>
                                <div className="flex space-x-3">
                                    <button
                                        key={product.color}
                                        onClick={() => setSelectedColor(product.color)}
                                        className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${selectedColor === product.color ? 'border-white scale-110 shadow-lg' : 'border-white/30 hover:border-white/60'}`}
                                        style={{ backgroundColor: product.color }}
                                    />
                                    {/* {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${selectedColor === color.name ? 'border-white scale-110 shadow-lg' : 'border-white/30 hover:border-white/60'}`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                    ))} */}
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
                                <div className="flex items-center space-x-2 text-sm"><Truck className="w-5 h-5 text-green-400" /><span>Free Shipping over ₹2000</span></div>
                                <div className="flex items-center space-x-2 text-sm"><Shield className="w-5 h-5 text-blue-400" /><span>Fine Quality</span></div>
                                <div className="flex items-center space-x-2 text-sm"><RotateCcw className="w-5 h-5 text-purple-400" /><span>30 Day Returns</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/20">
                        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
                        <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20">
                            {/* ... form content ... */}
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
                                {/* ADDED: Button is now disabled while submitting and shows a loading state */}
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
                                            {/* This part will be null for now, but is ready for when you add image URLs from Cloudinary */}
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