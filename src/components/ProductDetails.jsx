
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Send, X, ChevronLeft, ChevronRight, Maximize2, MessageSquare } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext.jsx';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../context/AuthContext/index.jsx';
import MoreLikeProducts from './MoreLikeProducts.jsx';

export default function ProductDetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userLoggedIn } = useAuth();
    const { dispatch: cartDispatch } = useCart();
    const { wishlist, dispatch: wishlistDispatch } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModalIndex, setCurrentModalIndex] = useState(0);

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const docSnap = await getDoc(doc(db, "products", productId));
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() };
                    setProduct(data);
                    setReviews(data.reviews || []);
                    if (data.variants?.length > 0) {
                        setSelectedVariant(data.variants[0]);
                        setSelectedImage(data.variants[0].imageUrls[0]);
                    }
                }
            } catch (error) { toast.error("ERROR LOADING PRODUCT"); }
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (product) setIsWishlisted(wishlist.some(item => item.id === product.id));
    }, [wishlist, product]);

    const handleVariantSelect = (v) => {
        setSelectedVariant(v);
        setSelectedImage(v.imageUrls[0]);
        setSelectedSize(null);
    };

    const addCartItem = (buyNow = false) => {
        if (!selectedVariant) return toast.error("PLEASE SELECT A COLOR");
        if (!userLoggedIn) return (toast.error("PLEASE LOGIN TO CONTINUE"), navigate('/login'));
        if (selectedVariant.sizes?.length > 0 && !selectedSize) return toast.error("PLEASE SELECT A SIZE");

        const cartItem = {
            productId: product.id,
            name: product.name,
            sale: product.sale,
            id: uuid(),
            quantity,
            selectedColor: selectedVariant.colorName,
            selectedSize,
            imageUrl: selectedVariant.imageUrls[0],
        };

        cartDispatch({ type: 'ADD', payload: cartItem });
        if (!buyNow) toast.success("ADDED TO BAG");
        else navigate('/checkout');
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!userLoggedIn) return toast.error("PLEASE LOGIN TO REVIEW");
        if (!comment.trim()) return toast.error("PLEASE ADD A COMMENT");

        setSubmittingReview(true);
        const newReview = {
            id: uuid(),
            userName: currentUser.displayName || currentUser.email.split('@')[0],
            rating,
            comment,
            date: new Date().toISOString(),
            userId: currentUser.uid
        };

        try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, {
                reviews: arrayUnion(newReview)
            });
            setReviews(prev => [newReview, ...prev]);
            setComment("");
            setRating(5);
            toast.success("REVIEW PUBLISHED");
        } catch (error) {
            toast.error("COULD NOT POST REVIEW");
        } finally {
            setSubmittingReview(false);
        }
    };

    const openLightbox = (index) => {
        setCurrentModalIndex(index);
        setIsModalOpen(true);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[10px] tracking-[0.3em] uppercase opacity-50 italic">Sasha Atelier Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center uppercase tracking-widest">Product not found.</div>;

    return (
        <div className="min-h-screen bg-white mt-10 pb-20 font-light">
            <ToastContainer position="bottom-center" theme="light" autoClose={2000} hideProgressBar />
            
            <div className="container mx-auto px-4 lg:px-20 max-w-8xl">
                <div className="grid lg:grid-cols-12 gap-16">
                    
                    {/* LEFT: GALLERY SECTION */}
                    <div className="lg:col-span-7">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative group overflow-hidden bg-[#f9f9f9] border border-gray-50 cursor-zoom-in aspect-[3/4] lg:aspect-auto">
                                <img 
                                    src={selectedImage} 
                                    alt={product.name}
                                    className="w-full h-full lg:h-screen object-contain transition-transform duration-1000 group-hover:scale-110 grayscale-[0.1] hover:grayscale-0"
                                    onClick={() => openLightbox(selectedVariant.imageUrls.indexOf(selectedImage))}
                                />
                                <div className="absolute bottom-4 right-4 bg-white/80 p-3 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} className="text-gray-900" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                        {/* TRUST POINTS */}
                        <div className="grid grid-cols-3 gap-4 mt-10 border-y border-gray-50">
                            <div className="text-center space-y-3">
                                <Truck className="mx-auto w-5 h-5 text-gray-300" strokeWidth={1} />
                                <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium leading-relaxed">Complimentary <br/>Shipping</p>
                            </div>
                            <div className="text-center space-y-3 border-x border-gray-50">
                                <Shield className="mx-auto w-5 h-5 text-gray-300" strokeWidth={1} />
                                <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium leading-relaxed">Secured <br/>Checkout</p>
                            </div>
                            <div className="text-center space-y-3">
                                <RotateCcw className="mx-auto w-5 h-5 text-gray-300" strokeWidth={1} />
                                <p className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-medium leading-relaxed">14 Day <br/>Returns</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PRODUCT INFO SECTION */}
                    <div className="lg:col-span-5 space-y-12">
                        <section className="space-y-6">
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl md:text-4xl font-light tracking-[0.15em] uppercase text-gray-900 leading-tight">
                                    {product.name}
                                </h1>
                                <button onClick={() => wishlistDispatch({ type: isWishlisted ? 'REMOVE_ITEM' : 'ADD_ITEM', payload: isWishlisted ? product.id : product })}>
                                    <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-black text-black' : 'text-gray-300 hover:text-black'}`} strokeWidth={1.5} />
                                </button>
                            </div>
                            
                            <div className="flex items-baseline gap-6 pt-2">
                                <p className="text-3xl font-normal text-gray-900">₹{product.sale}</p>
                                <p className="text-sm text-gray-500 line-through font-light">₹{product.mrp}</p>
                                <span className="text-[15px] tracking-[0.3em] text-black font-bold uppercase bg-gray-50 px-2 py-1">
                                    -{Math.round(((product.mrp - product.sale)/product.mrp)*100)}%
                                </span>
                            </div>
                        </section>

                        {/* COLOR VARIANT SELECTION */}
                        <div className="space-y-6">
                            <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400">
                                Selection: <span className="text-gray-900 font-normal">{selectedVariant?.colorName}</span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {product.variants?.map((v, i) => (
                                    <button 
                                        key={i}
                                        onClick={() => handleVariantSelect(v)}
                                        className={`w-16 h-20 p-1 border transition-all duration-500 ${selectedVariant?.colorName === v.colorName ? 'border-black' : 'border-gray-100 opacity-40 hover:opacity-100'}`}
                                    >
                                        <img src={v.imageUrls[0]} className="w-full h-full object-cover grayscale-[0.2]" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SIZE SELECTION */}
                        {selectedVariant?.sizes?.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400">Size</p>
                                    <button className="text-[9px] uppercase tracking-widest underline underline-offset-8 text-gray-300 hover:text-black transition-colors">Measurement Guide</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {selectedVariant.sizes.map(({ size, stock }) => (
                                        <button
                                            key={size}
                                            disabled={stock === 0}
                                            onClick={() => setSelectedSize(size)}
                                            className={`min-w-[70px] py-4 text-[11px] font-bold tracking-widest border transition-all duration-300 ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white border-gray-100 text-gray-900 hover:border-black'} ${stock === 0 ? 'opacity-20 cursor-not-allowed border-dashed' : ''}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ACTIONS */}
                        <div className="space-y-4 pt-4">
                            <button 
                                onClick={() => addCartItem(false)}
                                className="w-full bg-black text-white py-6 text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-gray-800 transition-all flex items-center justify-center gap-4"
                            >
                                <ShoppingCart size={14} /> Add to Bag
                            </button>
                            <button 
                                onClick={() => addCartItem(true)}
                                className="w-full border border-gray-100 text-gray-900 py-6 text-[11px] font-bold tracking-[0.4em] uppercase hover:border-black transition-all"
                            >
                                Buy Now
                            </button>
                        </div>

                        

                        <details className="group border-b border-gray-100 pb-6 mt-20" open>
                            <summary className="flex justify-between items-center cursor-pointer list-none text-[10px] tracking-[0.4em] uppercase font-bold text-gray-900">
                                The Silhouette
                                <span className="transition-transform group-open:rotate-45 text-lg font-light">+</span>
                            </summary>
                            <p className="text-[13px] text-gray-500 font-light leading-relaxed mt-6 italic">
                                {product.description}
                            </p>
                        </details>
                    </div>
                </div>

                {/* --- CUSTOMER REVIEWS SECTION --- */}
                <section className=" pt-20 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <header className="text-center space-y-4">
                            <h2 className="text-[11px] tracking-[0.5em] uppercase font-bold text-gray-400">Atelier Feedback</h2>
                            <h3 className="text-3xl font-light tracking-widest uppercase">Client Reviews</h3>
                            <div className="flex justify-center items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < 4 ? "fill-black text-black" : "text-gray-200"} />
                                    ))}
                                </div>
                                <span className="text-[10px] tracking-widest uppercase font-bold">4.8 / 5.0 Rating</span>
                            </div>
                        </header>

                        {/* Review Form */}
                        {userLoggedIn ? (
                            <form onSubmit={handleReviewSubmit} className="bg-[#fafafa] p-8 md:p-12 space-y-8 border border-gray-50">
                                <div className="space-y-4">
                                    <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-gray-400">Share your experience</p>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button key={num} type="button" onClick={() => setRating(num)} className="transition-transform hover:scale-110">
                                                <Star size={20} className={num <= rating ? "fill-black text-black" : "text-gray-200"} strokeWidth={1} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative">
                                    <textarea 
                                        rows="3"
                                        placeholder="YOUR THOUGHTS ON THE FABRIC, FIT, AND FINISH..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-200 py-4 text-sm outline-none focus:border-black transition-colors resize-none uppercase tracking-wide placeholder:text-gray-300 font-light"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={submittingReview}
                                        className="absolute right-0 bottom-4 text-black hover:translate-x-2 transition-transform disabled:opacity-30"
                                    >
                                        {submittingReview ? <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" /> : <Send size={20} strokeWidth={1.5} />}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center p-12 bg-gray-50">
                                <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400">Login to contribute to the atelier feedback</p>
                            </div>
                        )}

                        {/* Review List */}
                        <div className="space-y-12">
                            {reviews.length > 0 ? reviews.map((rev) => (
                                <div key={rev.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                                                {rev.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[10px] tracking-widest uppercase font-bold">{rev.userName}</p>
                                                <p className="text-[9px] text-gray-400 uppercase tracking-widest">{new Date(rev.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className={i < rev.rating ? "fill-black text-black" : "text-gray-700"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 font-light leading-relaxed uppercase tracking-tight">
                                        {rev.comment}
                                    </p>
                                </div>
                            )) : (
                                <div className="text-center py-10 opacity-30">
                                    <MessageSquare size={32} className="mx-auto mb-4" strokeWidth={1} />
                                    <p className="text-[10px] tracking-[0.4em] uppercase">No reviews curated yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="mt-32">
                    <MoreLikeProducts currentCategory={product.category} currentProductId={product.id} />
                </div>
            </div>

            {/* LIGHTBOX MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300">
                    <div className="p-6 flex justify-between items-center border-b border-gray-50">
                        <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-gray-400">Lookbook — {currentModalIndex + 1}/{selectedVariant.imageUrls.length}</span>
                        <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform duration-500"><X size={20} strokeWidth={1.5}/></button>
                    </div>
                    <div className="flex-grow flex items-center justify-center p-4 relative bg-[#fafafa]">
                        <button 
                            className="absolute left-8 p-6 hover:bg-white rounded-full transition-all duration-300"
                            onClick={() => setCurrentModalIndex(prev => (prev === 0 ? selectedVariant.imageUrls.length - 1 : prev - 1))}
                        >
                            <ChevronLeft size={24} strokeWidth={1} />
                        </button>
                        <img 
                            src={selectedVariant.imageUrls[currentModalIndex]} 
                            className="max-h-[80vh] max-w-full object-contain shadow-2xl grayscale-[0.05]" 
                            alt="Lightbox View"
                        />
                        <button 
                            className="absolute right-8 p-6 hover:bg-white rounded-full transition-all duration-300"
                            onClick={() => setCurrentModalIndex(prev => (prev === selectedVariant.imageUrls.length - 1 ? 0 : prev + 1))}
                        >
                            <ChevronRight size={24} strokeWidth={1} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}