/* eslint-disable no-unused-vars */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext/index.jsx';
import { toast, ToastContainer } from 'react-toastify';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

// --- Cart Item Component ---
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    let displayImage = 'https://placehold.co/200x300/f8f8f8/cccccc?text=No+Image';
    if (item.imageUrls && item.imageUrls.length > 0) {
        displayImage = item.imageUrls[0];
    } else if (item.imageUrl) {
        displayImage = item.imageUrl;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 py-8 border-b border-gray-100 group animate-in fade-in duration-500">
            <div className="w-32 h-44 bg-[#fafafa] flex-shrink-0 overflow-hidden rounded-sm">
                <img
                    src={displayImage}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                />
            </div>
            
            <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900">{item.name}</h3>
                    <p className="text-[11px] tracking-widest text-gray-400 uppercase font-light">{item.category}</p>
                    <div className="pt-2 space-y-1">
                        {item.selectedSize && (
                            <p className='text-[10px] tracking-widest uppercase text-gray-500'>
                                Size: <span className='text-gray-900 font-medium'>{item.selectedSize}</span>
                            </p>
                        )}
                        <p className='text-[10px] tracking-widest uppercase text-gray-500'>
                            Color: <span className='text-gray-900 font-medium'>{item.selectedColor}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-end justify-between mt-4 sm:mt-0 gap-4">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                        >
                            <Minus className="w-3 h-3 text-gray-400" />
                        </button>
                        <span className="w-10 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                        >
                            <Plus className="w-3 h-3 text-gray-400" />
                        </button>
                    </div>
                    
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 tracking-wider">₹{(item.sale * item.quantity).toFixed(2)}</p>
                        <button
                            onClick={() => onRemove(item.id, item.name)}
                            className="text-[9px] tracking-[0.2em] uppercase text-red-300 hover:text-red-500 transition-colors mt-2"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Order Summary Component ---
const OrderSummary = ({ subtotal }) => {
    const SHIPPING_COST = subtotal > 2000 ? 0 : 50;
    const total = subtotal + SHIPPING_COST;
    const { userLoggedIn } = useAuth();
    
    return (
        <div className="bg-[#fafafa] p-8 rounded-sm sticky top-32 border border-gray-50">
            <h2 className="text-[12px] tracking-[0.3em] uppercase font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Bag Summary</h2>
            
            <div className="space-y-4 text-[13px] font-light text-gray-600">
                <div className="flex justify-between tracking-wide">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between tracking-wide">
                    <span>Estimated Shipping</span>
                    <span className={SHIPPING_COST === 0 ? 'text-green-600 font-medium uppercase text-[11px]' : 'text-gray-900'}>
                        {SHIPPING_COST === 0 ? 'Complimentary' : `₹${SHIPPING_COST.toFixed(2)}`}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 mt-8 pt-6">
                <span className="text-xs tracking-[0.2em] uppercase font-bold text-gray-900">Total</span>
                <span className="text-lg font-semibold text-gray-900">₹{total.toFixed(2)}</span>
            </div>

            <button
                onClick={() => {
                    if (userLoggedIn) {
                        window.location.href = '/checkout';
                    } else {
                        toast.error("PLEASE LOG IN TO PROCEED");
                        setTimeout(() => { window.location.href = '/login'; }, 1500);
                    }
                }}
                className="mt-10 w-full bg-black text-white text-[11px] font-bold tracking-[0.3em] uppercase py-5 hover:bg-gray-800 transition-all duration-300"
            >
                Secure Checkout
            </button>
            
            <p className="text-[10px] text-gray-400 mt-6 text-center leading-relaxed tracking-wider">
                **COMPLIMENTARY DELIVERY ON ALL ORDERS ABOVE ₹2000
            </p>
        </div>
    );
};

export default function CartPage() {
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity > 0) {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
        }
    };

    const handleRemoveItem = (id, name) => {
        dispatch({ type: 'REMOVE', payload: id });
        toast.info(`${name.toUpperCase()} REMOVED`, { theme: 'light' });
    };

    const subtotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.sale * item.quantity), 0);
    }, [cart]);

    return (
        <div className="bg-white min-h-screen pt-32 pb-20">
            <ToastContainer theme='light' hideProgressBar position="bottom-center" />
            <div className="container mx-auto px-4 lg:px-12">
                {cart.length > 0 ? (
                    <div className="max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-16">
                        {/* Main Cart Items */}
                        <main className="lg:col-span-8">
                            <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
                                <div>
                                    <h1 className="text-3xl font-light tracking-[0.1em] text-gray-900 uppercase">Shopping <span className="font-semibold">Bag</span></h1>
                                    <p className="text-[11px] tracking-widest text-gray-400 mt-2 uppercase">{cart.length} Items</p>
                                </div>
                                <button onClick={() => dispatch({ type: 'CLEAR' })} className="text-[10px] tracking-widest text-gray-300 hover:text-black uppercase underline underline-offset-4">
                                    Clear Bag
                                </button>
                            </div>

                            <div className="space-y-2">
                                {cart.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>
                            
                            <button onClick={() => navigate('/all')} className="mt-12 flex items-center gap-3 text-[11px] tracking-widest text-gray-400 hover:text-black uppercase transition-colors font-medium">
                                <ArrowLeft className="w-4 h-4" /> Continue Collections
                            </button>
                        </main>

                        {/* Sidebar Summary */}
                        <aside className="lg:col-span-4">
                            <OrderSummary subtotal={subtotal} />
                        </aside>
                    </div>
                ) : (
                    <div className="text-center py-20 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-100" strokeWidth={1} />
                        <h2 className="mt-8 text-xl font-light tracking-widest text-gray-900 uppercase">Your bag is empty</h2>
                        <p className="text-gray-400 mt-4 text-[13px] font-light tracking-wide uppercase">
                            Discover our latest curations and find your next favorite piece.
                        </p>
                        <button
                            onClick={() => navigate('/all')}
                            className="mt-10 inline-block bg-black text-white px-12 py-4 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-all"
                        >
                            Explore All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}