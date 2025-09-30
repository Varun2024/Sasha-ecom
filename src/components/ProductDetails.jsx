
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
import { BookText } from 'lucide-react'; // Optional: for a nice icon
import { v4 as uuid } from 'uuid';
import { useAuth } from '../context/AuthContext/index.jsx';
import ProductMarquee from './Discover.jsx';

export default function ProductDetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userLoggedIn } = useAuth();
    // --- Component State ---
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // ADDED: State to manage the selected size
    const [selectedSize, setSelectedSize] = useState(null);

    // --- Reviews State ---
    const [reviews, setReviews] = useState([]);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewImage, setNewReviewImage] = useState(null);
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedColor, setSelectedColor] = useState(['Select a color']);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isCombo, setIsCombo] = useState(false);


    // --- Contexts ---
    const { cart, dispatch: cartDispatch } = useCart();
    const { wishlist, dispatch: wishlistDispatch } = useWishlist();
    const availableColors = useMemo(() => {
        if (!product || !product.color || typeof product.color !== 'string') {
            setIsCombo(false);
            return [];
        }

        const colorString = product.color.trim();

        // ✅ Check if it's the combo format
        if (colorString.startsWith('(')) {
            setIsCombo(true);
            // Parse the combo string: (a,b,c), (d,e,f)
            return colorString
                .split(/\s*,\s*\(/) // Split by " , ("
                .map(part => part.replace(/[()]/g, '')) // Remove parentheses
                .map(combo => combo.split(',').map(color => color.trim())); // Create inner array
        } else {
            // ✅ It's the normal format
            setIsCombo(false);
            return colorString.split(',').map(c => c.trim());
        }
    }, [product]); // Dependency: re-run only when product changes

    // Set the default selection once colors are parsed
    useEffect(() => {
        if (availableColors.length > 0) {
            setSelectedColor(availableColors[0]);
        }
    }, [availableColors]);
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

    const handleBuyNow = () => {
        // First, check if a size is required and not selected
        if (isSizeRequiredAndNotSelected) {
            toast.error("Please select a size first!", { position: "bottom-right" });
            return;
        }

        // Now, check if the user is logged in
        if (currentUser) {
            // If logged in, add to cart and navigate to checkout
            addCartItem(product, quantity, selectedSize, selectedColor);
            navigate('/checkout');
        } else {
            // If not logged in, redirect to the login page
            toast.info("Please log in to proceed.", { position: "bottom-right" });
            navigate('/login'); // Or '/signup'
        }
    };

    // --- Wishlist Status Effect ---
    useEffect(() => {
        if (product) {
            setIsWishlisted(wishlist.some(item => item.id === product.id));
        }
    }, [wishlist, product]);


    // --- Event Handlers ---
    const addCartItem = (item, qty, size, color) => {
        // Validation check
        if (item.size && !size) {
            toast.error("Please select a size first!");
            return;
        }
        setIsClicked(true);
        cartDispatch({ type: 'ADD', payload: { ...item, id: uuid(), quantity: qty, selectedSize: size, selectedColor: color } });
        toast.success(`${item.name} (Size: ${size}, Color: ${color}, x${qty}) added to cart!`, { position: "bottom-right" });
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
        if (!currentUser) {
            toast.error("Please log in to submit a review.", { position: "bottom-right" });
            return;
        }

        setIsSubmitting(true);

        const newReview = {
            id: uuid(),
            author: currentUser.user.displayName, // In a real app, get this from an auth context
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
            window.location.reload();

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


    // For description toggle
    const descriptionText = product.description || "No description available for this product. Please check back later for more details.";
    const isLongDescription = descriptionText.length > 250; // Set a character limit for truncation


    // ADDED: Prepare available sizes array and check if a size selection is required
    const availableSizes = (product.size && typeof product.size === 'string') ? product.size.split(',') : [];

    const isSizeRequiredAndNotSelected = availableSizes.length > 0 && !selectedSize;

    // understand this
    // const availableColors = (product.color && typeof product.color === 'string') ? product.color.split(',').map(c => c.trim()) : [];

    const discountPercentage = product.mrp ? Math.round(((product.mrp - product.sale) / product.mrp) * 100) : 0;
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
                        </div>
                        {/* --- END: Image Gallery --- */}

                        {/* Product Info */}
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
                                    <span className="bg-gradient-to-r from-green-400 to-green-600 px-3 py-1 rounded-full text-sm font-medium"> {discountPercentage}% OFF</span>


                                </div>
                                {availableColors.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold">
                                            Color: <span className="text-gray-500 capitalize">{selectedColor}</span>
                                        </h3>

                                        {isCombo ? (
                                            // --- UI for COMBO Products (renders groups of swatches) ---
                                            <div className="flex flex-wrap items-center gap-3">
                                                {availableColors.map((combo, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedColor(combo)}
                                                        // Compare arrays by turning them into strings to check for active state
                                                        className={`p-2 rounded-lg border-2 flex items-center gap-1.5 duration-200 transition-all ${Array.isArray(selectedColor) && selectedColor.join(',') === combo.join(',')
                                                                ? 'bg-gray-400 border-white shadow-lg'
                                                                : 'bg-gray-200 border-white/30 hover:bg-gray-500/40'
                                                            }`}
                                                    >
                                                        {/* Inner map to render the color circles for each combo */}
                                                        {combo.map((color, colorIndex) => (
                                                            <div
                                                                key={colorIndex}
                                                                className="w-6 h-6 rounded-full border border-white/50"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            // --- UI for NORMAL Products ---
                                            <div className="flex flex-wrap items-center gap-3">
                                                {availableColors.map((color) => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        title={color}
                                                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${selectedColor === color
                                                            ? 'border-black scale-110 shadow-lg'
                                                            : 'border-gray-300 hover:border-white/60'
                                                            }`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* --- ADDED: Size Selector UI --- */}
                            {availableSizes.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        Select Size:
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium ${selectedSize === size
                                                    ? 'bg-white text-black border-white shadow-lg'
                                                    : 'bg-gray-300 text-black border-white/80 hover:border-white'
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
                                        disabled={isSizeRequiredAndNotSelected || selectedColor === 'Select color'}
                                        onClick={() => { addCartItem(product, quantity, selectedSize, selectedColor) }}
                                        className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_black] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>{isSizeRequiredAndNotSelected ? 'Select a Size' : 'Add to Cart'}</span>
                                    </button>
                                    <button
                                        disabled={isSizeRequiredAndNotSelected || selectedColor === 'Select color'}
                                        onClick={() => handleBuyNow()}
                                        className="inline-block rounded-lg border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                                <div className="text-sm bg-red-500/70 shadow-lg p-3 rounded-lg border border-white/20 transition-all duration-300" style={{ display: isSizeRequiredAndNotSelected || selectedColor === 'Select color' ? 'block' : 'none' }}>
                                    <span className='text-white'>Please select a size and a color before adding to cart or buying !!</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                                <div className="flex items-center space-x-2 text-sm"><Truck className="w-5 h-5 text-green-400" /><span>Free Shipping over ₹2000</span></div>
                                <div className="flex items-center space-x-2 text-sm"><Shield className="w-5 h-5 text-blue-400" /><span>Fine Quality</span></div>
                                <div className="flex items-center space-x-2 text-sm"><RotateCcw className="w-5 h-5 text-purple-400" /><span>10 Day Returns</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 mx-8 mb-8 p-6 border-t border-white/20">
                        <div className="flex items-center gap-2">
                            <BookText className="w-5 h-5 text-gray-400" />
                            <h3 className="text-xl font-semibold">Description</h3>
                        </div>
                        <p
                            className="text-gray-400 leading-relaxed"
                            style={{ whiteSpace: 'pre-line' }} // This preserves line breaks from the database
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
                    {/* --- END: Product Description Section --- */}


                    {/* marquees */}
                    <ProductMarquee />



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
                                className="w-full p-3 bg-white/5 rounded-lg border border-gray-800/20 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                                rows="4"
                            ></textarea>

                            <div className="flex justify-between items-center mt-4">
                                {/* <label className="flex items-center border-2 gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-300/20 transition-all hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none">
                                    <Camera className="w-5 h-5" />
                                    <span>{newReviewImage ? 'Change Image' : 'Add Image'}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label> */}
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
                                            <p className="mt-2 text-gray-600">{review.text}</p>
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