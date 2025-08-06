/* eslint-disable no-unused-vars */
<<<<<<< HEAD
import React, { useContext, useState } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Zap, Volume2, Battery, Bluetooth } from 'lucide-react';
import DataContext from '../context/Context';
import { useLocation } from 'react-router-dom';
=======
import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Zap, Volume2, Battery, Bluetooth } from 'lucide-react';
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e

export default function ProductDetailsPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState('midnight');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('features');
<<<<<<< HEAD
    const { productData } = useContext(DataContext);
    // Load data from localStorage in case of a refresh
    const [product, setProduct] = useState(() => {
        const stored = localStorage.getItem('productData');
        return stored ? JSON.parse(stored) : null;
    });


=======
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e

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

<<<<<<< HEAD


    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-8 ">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 mt-10">
=======
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                    <div className="grid lg:grid-cols-2 gap-8 p-8">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative group">
                                <img
<<<<<<< HEAD
                                    src={productData.imageUrl? productData.imageUrl : product.imageUrl}
=======
                                    src={images[selectedImage]}
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                    alt="Product"
                                    className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        </div>

                        {/* Product Info */}
<<<<<<< HEAD
                        <div className="space-y-6 ">
                            <div>
                                <div className="flex justify-end mb-2">
                                    {/* <span className="text-purple-700 text-sm font-medium tracking-wide uppercase">Premium Audio</span> */}
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-red-500 ' : 'bg-white/10  hover:bg-white/20'
=======
                        <div className="space-y-6 text-white">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-purple-300 text-sm font-medium tracking-wide uppercase">Premium Audio</span>
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                            }`}
                                    >
                                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
<<<<<<< HEAD
                                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-300 bg-clip-text text-transparent">
                                    {productData.name ? productData.name : product.name}
=======
                                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                    SoundPro Wireless Headphones
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
<<<<<<< HEAD
                                    <span className="/80">{productData.rating ? productData.rating : product.rating} ({productData.reviewCount ? productData.reviewCount : product.reviewCount} reviews)</span>
=======
                                    <span className="text-white/80">4.8 (2,847 reviews)</span>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
<<<<<<< HEAD
                                    <span className="text-3xl font-bold ">{productData.price ? productData.price : product.price}</span>
                                    <span className="bg-gradient-to-r from-green-400 to-green-600  px-3 py-1 rounded-full text-sm font-medium">
=======
                                    <span className="text-3xl font-bold text-white">$299</span>
                                    <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
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
<<<<<<< HEAD
                                                ? 'border-white scale-110 shadow-lg'
                                                : 'border-white/30 hover:border-white/60 hover:scale-105'
=======
                                                    ? 'border-white scale-110 shadow-lg'
                                                    : 'border-white/30 hover:border-white/60 hover:scale-105'
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
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
<<<<<<< HEAD
                                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700  py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button className="bg-white/10 hover:bg-white/20  py-4 px-6 rounded-xl font-semibold transition-all duration-300 border border-white/20">
=======
                                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button className="bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 border border-white/20">
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
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

                    {/* Product Details Tabs */}
                    <div className="border-t border-white/20">
                        <div className="flex space-x-8 px-8 pt-8">
<<<<<<< HEAD
                            {['features', 'reviews'].map((tab) => (
=======
                            {['features', 'reviews', 'specs'].map((tab) => (
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 px-2 font-semibold capitalize transition-all duration-300 ${activeTab === tab
<<<<<<< HEAD
                                        ? ' border-b-2 border-purple-400'
                                        : '/60 hover:'
=======
                                            ? 'text-white border-b-2 border-purple-400'
                                            : 'text-white/60 hover:text-white'
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-8">
                            {activeTab === 'features' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300"
                                        >
                                            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-lg">
<<<<<<< HEAD
                                                <feature.icon className="w-6 h-6 " />
                                            </div>
                                            <div>
                                                <h4 className=" font-semibold mb-1">{feature.title}</h4>
                                                <p className="/70 text-sm">{feature.desc}</p>
=======
                                                <feature.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                                                <p className="text-white/70 text-sm">{feature.desc}</p>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="bg-white/5 p-6 rounded-xl">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
<<<<<<< HEAD
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center  font-semibold">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className=" font-semibold">{review.name}</h4>
=======
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {review.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-semibold">{review.name}</h4>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                                        <div className="flex items-center space-x-1">
                                                            {[...Array(review.rating)].map((_, i) => (
                                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
<<<<<<< HEAD
                                                <span className="/60 text-sm">{review.date}</span>
                                            </div>
                                            <p className="/80">{review.comment}</p>
=======
                                                <span className="text-white/60 text-sm">{review.date}</span>
                                            </div>
                                            <p className="text-white/80">{review.comment}</p>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'specs' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
<<<<<<< HEAD
                                        <h4 className=" font-semibold text-lg mb-4">Technical Specifications</h4>
=======
                                        <h4 className="text-white font-semibold text-lg mb-4">Technical Specifications</h4>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                        {[
                                            { label: 'Driver Size', value: '40mm Dynamic' },
                                            { label: 'Frequency Response', value: '20Hz - 40kHz' },
                                            { label: 'Impedance', value: '32 Ohms' },
                                            { label: 'Sensitivity', value: '105 dB/mW' }
                                        ].map((spec, index) => (
                                            <div key={index} className="flex justify-between py-2 border-b border-white/10">
<<<<<<< HEAD
                                                <span className="/70">{spec.label}</span>
                                                <span className=" font-medium">{spec.value}</span>
=======
                                                <span className="text-white/70">{spec.label}</span>
                                                <span className="text-white font-medium">{spec.value}</span>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
<<<<<<< HEAD
                                        <h4 className=" font-semibold text-lg mb-4">Connectivity & Battery</h4>
=======
                                        <h4 className="text-white font-semibold text-lg mb-4">Connectivity & Battery</h4>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                        {[
                                            { label: 'Bluetooth Version', value: '5.3' },
                                            { label: 'Battery Life', value: '30 hours' },
                                            { label: 'Charging Time', value: '2 hours' },
                                            { label: 'Weight', value: '250g' }
                                        ].map((spec, index) => (
                                            <div key={index} className="flex justify-between py-2 border-b border-white/10">
<<<<<<< HEAD
                                                <span className="/70">{spec.label}</span>
                                                <span className=" font-medium">{spec.value}</span>
=======
                                                <span className="text-white/70">{spec.label}</span>
                                                <span className="text-white font-medium">{spec.value}</span>
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}