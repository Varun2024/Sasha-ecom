/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// --- UI & Context ---
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Send, Camera } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext.jsx';
import { BookText } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../context/AuthContext/index.jsx';
import ProductMarquee from './Discover.jsx';

export default function ProductDetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userLoggedIn } = useAuth();
    // --- Contexts ---
    const { cart, dispatch: cartDispatch } = useCart();
    const { wishlist, dispatch: wishlistDispatch } = useWishlist();

    // --- Component State ---
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isClicked, setIsClicked] = useState(false); // For cart animation/feedback
    const [isExpanded, setIsExpanded] = useState(false); // For description

    // --- ✅ REFACTORED STATE for Variants ---
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // --- Reviews State ---
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewImage, setNewReviewImage] = useState(null); // Keep for future use
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Image Lightbox Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModalIndex, setCurrentModalIndex] = useState(0);

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

                    if (productData.variants && productData.variants.length > 0) {
                        const defaultVariant = productData.variants[0];
                        setSelectedVariant(defaultVariant);
                        if (defaultVariant.imageUrls && defaultVariant.imageUrls.length > 0) {
                            setSelectedImage(defaultVariant.imageUrls[0]);
                        }
                    } else {
                        console.warn("Product is using old data structure. Please update in admin panel.");
                        const syntheticVariant = {
                            colorName: productData.color || "Default",
                            imageUrls: productData.imageUrls || [productData.imageUrl] || [],
                            sizes: productData.sizes || (productData.size ? productData.size.split(',').map(s => ({ size: s, stock: 1 })) : [])
                        };
                        setSelectedVariant(syntheticVariant);
                        if (syntheticVariant.imageUrls.length > 0) {
                            setSelectedImage(syntheticVariant.imageUrls[0]);
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

    // --- Event Handler for selecting a color variant ---
    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        setSelectedImage(variant.imageUrls[0]);
        setSelectedSize(null);
    };

    // --- Event Handlers ---
    const addCartItem = (item, qty, variant, size) => {
        if (!variant) {
            toast.error("Please select a color!");
            return;
        }
        if (variant.sizes.length > 0 && !size) {
            toast.error("Please select a size!");
            return;
        }

        setIsClicked(true);

        const cartItem = {
            productId: item.id,
            name: item.name,
            sale: item.sale,
            mrp: item.mrp,
            id: uuid(),
            quantity: qty,
            selectedColor: variant.colorName,
            selectedSize: size,
            imageUrl: variant.imageUrls[0],
        };

        cartDispatch({ type: 'ADD', payload: cartItem });
        toast.success(
            `${cartItem.name} (${cartItem.selectedColor}, ${cartItem.selectedSize}) added to cart!`,
            { position: "bottom-right" }
        );
    };

    const handleBuyNow = () => {
        const isSizeRequired = selectedVariant?.sizes?.length > 0;
        if (!selectedVariant) {
            toast.error("Please select a color first!", { position: "bottom-right" });
            return;
        }
        if (isSizeRequired && !selectedSize) {
            toast.error("Please select a size first!", { position: "bottom-right" });
            return;
        }

        if (currentUser) {
            addCartItem(product, quantity, selectedVariant, selectedSize);
            navigate('/checkout');
        } else {
            toast.info("Please log in to proceed.", { position: "bottom-right" });
            navigate('/login');
        }
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        const action = isWishlisted ? 'REMOVE_ITEM' : 'ADD_ITEM';
        const payload = isWishlisted ? product.id : product;
        wishlistDispatch({ type: action, payload });
    };

    // --- Review Handlers ---
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReviewText.trim()) {
            toast.error("Please write a review before submitting.", { position: "bottom-right" });
            return;
        }
        if (!currentUser) {
            toast.error("Please log in to submit a review.", { position: "bottom-right" });
            return;
        }

        setIsSubmitting(true);

        const newReview = {
            id: uuid(),
            author: currentUser.user.displayName || "Anonymous",
            rating: newReviewRating,
            text: newReviewText,
        };

        const updatedReviews = [newReview, ...reviews];

        try {
            const productDocRef = doc(db, "products", productId);
            await updateDoc(productDocRef, {
                reviews: updatedReviews
            });
            setReviews(updatedReviews);
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
        // Logic for image upload
    };
    // --- End Review Handlers ---

    // --- Render Logic ---
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading product details...</div>;
    }

    if (!product || !selectedVariant) {
        return <div className="min-h-screen flex items-center justify-center">Product not found or data is corrupted.</div>;
    }

    const descriptionText = product.description || "No description available for this product.";
    const isLongDescription = descriptionText.length > 250;

    const isSizeRequired = selectedVariant.sizes && selectedVariant.sizes.length > 0;
    const isSizeNotSelected = isSizeRequired && !selectedSize;
    const isColorNotSelected = !selectedVariant;
    const isDisabled = isColorNotSelected || isSizeNotSelected;

    const discountPercentage = product.mrp ? Math.round(((product.mrp - product.sale) / product.mrp) * 100) : 0;

    // --- Image Lightbox Functions ---
    // Use the selectedVariant's images
    const currentVariantImages = selectedVariant.imageUrls || [];
    const selectedImageIndex = currentVariantImages.indexOf(selectedImage);

    const openModal = () => {
        if (currentVariantImages.length === 0) return;
        setCurrentModalIndex(selectedImageIndex >= 0 ? selectedImageIndex : 0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const goToNextImage = () => {
        if (currentVariantImages.length === 0) return;
        setCurrentModalIndex(prevIndex => (prevIndex + 1) % currentVariantImages.length);
    };

    const goToPrevImage = () => {
        if (currentVariantImages.length === 0) return;
        setCurrentModalIndex(prevIndex => (prevIndex - 1 + currentVariantImages.length) % currentVariantImages.length);
    };
    // --- End Lightbox Functions ---

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <ToastContainer autoClose={3000} hideProgressBar={true} theme="dark" />
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    <div className="grid lg:grid-cols-2 gap-8 p-8">

                        {/* --- Image Gallery --- */}
                        <div className="flex flex-col gap-4 ">
                            <div className="relative group w-full h-96 lg:h-[500px]">
                                <img
                                    src={selectedImage || 'https://via.placeholder.com/500'}
                                    alt={product.name}
                                    className="w-full h-full object-scale-down rounded-2xl shadow-xl ease-in-out border-2 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                                    onClick={openModal}
                                />
                                <div
                                    onClick={openModal}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                                    </svg>
                                </div>
                            </div>

                            {/* --- ✅ CHANGED: This is now the Image Gallery for the SELECTED color --- */}
                            {currentVariantImages.length > 1 && (
                                <div className="flex flex-wrap gap-3">
                                    {currentVariantImages.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(url)}
                                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === url
                                                ? 'border-white scale-105'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={url} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                            {/* --- END: Image Gallery --- */}
                        </div>

                        {/* --- Image Lightbox Modal --- */}
                        {isModalOpen && (
                            <div
                                className="fixed inset-0 h-screen z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
                                onClick={closeModal}
                            >
                                {/* ... (Modal JSX remains unchanged) ... */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-6 right-6 z-[60] text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div
                                    className="relative w-full h-screen flex items-center justify-center p-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
                                        className="absolute left-4 md:left-10 z-[60] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    <div className="relative max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden shadow-2xl">
                                        <img
                                            src={currentVariantImages[currentModalIndex]}
                                            alt="Enlarged product"
                                            className="w-full h-full object-contain max-w-full max-h-[90vh]"
                                        />
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
                                        className="absolute right-4 md:right-10 z-[60] text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* --- END: Image Lightbox Modal --- */}


                        {/* --- Product Info --- */}
                        <div className="space-y-6 flex flex-col">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h1 className="text-4xl font-bold mb-4 text-gray-600">
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
                                    {/* Star rating logic... */}
                                    <span>{reviews.length} reviews</span>
                                </div>
                            </div>

                            {/* Prices (Unchanged) */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-bold">₹{product.sale}</span>
                                    <span className="line-through text-gray-500 mr-2">₹{product.mrp}</span>
                                    <span className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-full text-sm font-medium"> {discountPercentage}% OFF</span>
                                </div>

                                {/* --- ✅ MODIFIED: Color Selection (Now uses Variant Thumbnails) --- */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold">
                                            Color: <span className="text-gray-500 capitalize">{selectedVariant.colorName}</span>
                                        </h3>
                                        {/* This renders image thumbnails for each color variant */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            {product.variants.map((variant, index) => {
                                                const thumbnailUrl = variant.imageUrls && variant.imageUrls.length > 0
                                                    ? variant.imageUrls[0]
                                                    : 'https://via.placeholder.com/150'; // Fallback

                                                return (
                                                    <button
                                                        key={variant.id || index}
                                                        onClick={() => handleVariantSelect(variant)}
                                                        title={variant.colorName}
                                                        // Using smaller thumbnails (w-16 h-16) to differentiate from the main image gallery
                                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                                            selectedVariant.colorName === variant.colorName
                                                            ? 'border-white scale-105 shadow-lg' // Active style
                                                            : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/50' // Inactive style
                                                        }`}
                                                    >
                                                        <img src={thumbnailUrl} alt={variant.colorName} className="w-full h-full object-cover" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                {/* --- END: Color Selection --- */}


                                {/* --- Size Selection (Reads from selectedVariant) --- */}
                                {isSizeRequired && (
                                    <div className="space-y-3">
                                        <h3 className="font-semibold">Size:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedVariant.sizes.map(({ size, stock }) => {
                                                const isOutOfStock = stock === 0;
                                                return (
                                                    <button
                                                        key={size}
                                                        onClick={() => !isOutOfStock && setSelectedSize(size)}
                                                        disabled={isOutOfStock}
                                                        className={`px-4 py-2 rounded-lg border-2 transition-all relative
                                                        ${selectedSize === size ? 'bg-white text-black border-black' : 'bg-gray-300 text-gray-800 border-gray-300'}
                                                        ${isOutOfStock
                                                                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                                                : 'hover:border-gray-500'
                                                            }
                                                    `}
                                                    >
                                                        {size}
                                                        {isOutOfStock && (
                                                            <span className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-xs" style={{ transform: 'rotate(-10deg)' }}>
                                                                SOLD OUT
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* --- Actions (Quantity, Add to Cart, Buy Now) --- */}
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
                                        disabled={isDisabled}
                                        onClick={() => { addCartItem(product, quantity, selectedVariant, selectedSize) }}
                                        className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>{isDisabled ? 'Select Options' : 'Add to Cart'}</span>
                                    </button>
                                    <button
                                        disabled={isDisabled}
                                        onClick={() => handleBuyNow()}
                                        className="inline-block rounded-lg border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                                <div className="text-sm bg-red-500/70 shadow-lg p-3 rounded-lg border border-white/20 transition-all duration-300" style={{ display: isDisabled ? 'block' : 'none' }}>
                                    <span className='text-white'>
                                        {isColorNotSelected ? 'Please select a color.' : 'Please select a size.'}
                                    </span>
                                </div>
                            </div>

                            {/* Features (Unchanged) */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                                <div className="flex items-center space-x-2 text-sm"><Truck className="w-5 h-5 text-green-400" /><span>Free Shipping over ₹2000</span></div>
                                <div className="flex items-center space-x-2 text-sm"><Shield className="w-5 h-5 text-blue-400" /><span>Fine Quality</span></div>
                                <div className="flex items-center space-x-2 text-sm"><RotateCcw className="w-5 h-5 text-purple-400" /><span>7 Day Returns</span></div>
                            </div>
                        </div>
                    </div>

                    {/* --- Description (Unchanged) --- */}
                    <div className="space-y-2 mx-8 mb-8 p-6 border-t border-white/20">
                        {/* ... (Description JSX remains unchanged) ... */}
                        <div className="flex items-center gap-2">
                            <BookText className="w-5 h-5 text-gray-400" />
                            <h3 className="text-xl font-semibold">Description</h3>
                        </div>
                        <p
                            className="text-gray-400 leading-relaxed"
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {isLongDescription && !isExpanded
                                ? `${descriptionText.substring(0, 250)}...`
                                : descriptionText
                            }
                        </p>
                        {isLongDescription && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                {isExpanded ? 'Read Less' : 'Read More'}
                            </button>
                        )}
                    </div>

                    {/* --- Marquee (Unchanged) --- */}
                    <ProductMarquee />

                    {/* --- Customer Reviews (Unchanged) --- */}
                    <div className="p-8 border-t border-white/20">
                        {/* ... (Reviews JSX remains unchanged) ... */}
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
                                className="w-full p-3 bg-white/5 rounded-lg border border-gray-800/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                                rows="4"
                            ></textarea>
                            <div className="flex justify-between items-center mt-4">
                                <div></div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 rounded-xl border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                                </button>
                            </div>
                        </form>

                        <div className="space-y-6">
                            {reviews.length > 0 ? (
                                reviews.map(review => (
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
                                                <p className="mt-2 text-gray-600">{review.text}</p>
                                                {review.image && <img src={review.image} alt="User review" className="mt-4 rounded-lg max-h-64 object-cover" />}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400">Be the first to review this product!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}