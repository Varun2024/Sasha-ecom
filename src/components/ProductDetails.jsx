
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Zap, Volume2, Battery, Bluetooth } from 'lucide-react';
import DataContext from '../context/Context';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { v4 as uui } from 'uuid';

export default function ProductDetailsPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('midnight');
    const [quantity, setQuantity] = useState(1); // This state holds the selected quantity
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('features');
    const { productData } = useContext(DataContext);
    const [product, setProduct] = useState(() => {
        const stored = localStorage.getItem('productData');
        return stored ? JSON.parse(stored) : null;
    });
    const [isClicked, setIsClicked] = useState(false);
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();
    // CHANGE 1: Update the function to accept the quantity
    const addCartItem = (item, quantity) => {
        setIsClicked(true);

        // CHANGE 2: Add the quantity to the payload object
        dispatch({ type: 'ADD', payload: { ...item, id: uui(), quantity: quantity } });
        localStorage.setItem("cartCount", JSON.stringify(cart.length + 1));
        toast.success(`${item.name} (x${quantity}) added!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const images = [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop'
    ];

    const colors = [
        { name: 'midnight', value: '#1a1a2e', label: 'Midnight Black' },
        { name: 'storm', value: '#6b7280', label: 'Storm Gray' },
        { name: 'rose', value: '#f43f5e', label: 'Rose Gold' },
        { name: 'ocean', value: '#0ea5e9', label: 'Ocean Blue' }
    ];

    const features = [
        { icon: Volume2, title: 'Premium Audio', desc: '40mm drivers with Hi-Res Audio certification' },
        { icon: Battery, title: '30H Battery', desc: 'Up to 30 hours of continuous playback' },
        { icon: Bluetooth, title: 'Bluetooth 5.3', desc: 'Latest connectivity with multipoint pairing' },
        { icon: Zap, title: 'Fast Charging', desc: '15 minutes charge for 3 hours playback' }
    ];

    const reviews = [
        { name: 'Alex Chen', rating: 5, comment: 'Incredible sound quality and comfort. Best headphones I\'ve owned!', date: '2 days ago' },
        { name: 'Sarah Johnson', rating: 5, comment: 'The noise cancellation is fantastic. Perfect for travel.', date: '1 week ago' },
        { name: 'Mike Rodriguez', rating: 4, comment: 'Great build quality, though a bit pricey. Worth it for the features.', date: '2 weeks ago' }
    ];

    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-8 ">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-10">
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <div className="grid lg:grid-cols-2 gap-8 p-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <img
                                    src={productData.imageUrl ? productData.imageUrl : product.imageUrl}
                                    alt="Product"
                                    className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6 ">
                            <div>
                                <div className="flex justify-end mb-2">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-red-500 ' : 'bg-white/10  hover:bg-white/20'
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-300 bg-clip-text text-transparent">
                                    {productData.name ? productData.name : product.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="/80">{productData.rating ? productData.rating : product.rating} ({productData.reviewCount ? productData.reviewCount : product.reviewCount} reviews)</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl font-bold ">{productData.price ? productData.price : product.price}</span>
                                    <span className="bg-gradient-to-r from-green-400 to-green-600  px-3 py-1 rounded-full text-sm font-medium">
                                        25% OFF
                                    </span>
                                </div>
                                <p className="text-green-300 text-sm">Free shipping on orders over $200</p>
                            </div>

                            {/* Color Selection */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold">Color: {colors.find(c => c.name === selectedColor)?.label}</h3>
                                <div className="flex space-x-3">
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${selectedColor === color.name
                                                ? 'border-white scale-110 shadow-lg'
                                                : 'border-white/30 hover:border-white/60 hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-lg font-semibold">Quantity:</span>
                                    <div className="flex items-center bg-white/10 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 hover:bg-white/10 transition-colors rounded-l-lg"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-2 hover:bg-white/10 transition-colors rounded-r-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    {/* CHANGE 3: Pass the 'quantity' state to the function */}
                                    <button
                                        disabled={isClicked}
                                        onClick={() => addCartItem(productData ? productData : product, quantity)}
                                        className="text-white flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700  py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>{isClicked ? 'Added!' : 'Add to Cart'}</span>
                                    </button>
                                    <button 
                                    onClick={()=> {addCartItem(productData ? productData : product, quantity); navigate('/checkout')}}
                                    className="bg-white/10 hover:bg-white/20  py-4 px-6 rounded-xl font-semibold transition-all duration-300 border-1 border-gray-700">
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            {/* Trust indicators */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
                                <div className="flex items-center space-x-2 text-sm">
                                    <Truck className="w-5 h-5 text-green-400" />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    <span>2 Year Warranty</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <RotateCcw className="w-5 h-5 text-purple-400" />
                                    <span>30 Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details Tabs (code truncated for brevity) */}
                    <div className="border-t border-white/20">
                        {/* ... your tabs code ... */}
                    </div>
                </div>
            </div>
        </div>
    );
}