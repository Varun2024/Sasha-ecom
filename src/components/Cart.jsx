/* eslint-disable no-unused-vars */
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

// --- UI Libraries ---
import { toast } from 'react-toastify'; // Ensure ToastContainer is in your App.js
import { Trash2, Plus, Minus, Tag, ArrowLeft, ShoppingCart } from 'lucide-react';

// --- Cart Item Component ---
const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
        <img
            src={item.imageUrl}
            alt={item.name}
            className="w-28 h-36 object-cover rounded-md"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x300/f8f8f8/cccccc?text=Image+Not+Found'; }}
        />
        <div className="flex-grow text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
            <button
                onClick={() => onRemove(item.id, item.name)}
                className="mt-2 text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto sm:mx-0"
            >
                <Trash2 className="w-4 h-4" /> Remove
            </button>
        </div>
        <div className="flex items-center gap-3">
            <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2.5 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-xl font-medium text-gray-800">{item.quantity}</span>
            <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-2.5 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 transition-colors"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
        <div className="w-28 text-center sm:text-right">
            <p className="text-xl font-bold text-gray-900">₹{(item.sale * item.quantity).toFixed(2)}</p>
        </div>
    </div>
);

// --- Order Summary Component ---
const OrderSummary = ({ subtotal }) => {
    const navigate = useNavigate();
    const TAX_RATE = 0.08;
    const SHIPPING_COST = subtotal > 2000 ? 0 : 99; // Free shipping over ₹2000

    const taxes = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_COST;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg md:sticky md:top-24">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
            <div className="space-y-3 text-gray-700">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={`font-medium ₹{SHIPPING_COST === 0 ? 'text-green-600' : ''}`}>
                        {SHIPPING_COST === 0 ? 'Free' : `₹${SHIPPING_COST.toFixed(2)}`}
                    </span>
                </div>
                {/* <div className="flex justify-between"><span>Taxes</span><span className="font-medium">₹{taxes.toFixed(2)}</span></div> */}
            </div>
            <div className="flex items-center justify-between border-t mt-4 pt-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
            </div>
            <button
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full rounded-lg border-2 border-black bg-black px-8 py-3 font-semibold uppercase text-white transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_#6b7280] active:translate-x-[0px] active:translate-y-[0px] active:rounded-lg active:shadow-none"
            >
                Proceed to Checkout
            </button>
        </div>
    );
};

// --- Main Cart Page Component ---
export default function CartPage() {
    // Correctly use the cart context as the single source of truth.
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();

    // Handlers now only dispatch actions to the reducer.
    // The reducer is responsible for all state changes.
    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity > 0) {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
        }
    };

    // eslint-disable-next-line no-unused-vars
    const handleRemoveItem = (id, name) => {
        dispatch({ type: 'REMOVE', payload: id });
        toast.error(`₹{name} removed from cart.`);
    };

    const handleClearCart = () => {
        dispatch({ type: 'CLEAR' });
        toast.info('Your cart has been cleared.');
    };
    
    // The subtotal is memoized for performance and recalculates when the cart state changes.
    const subtotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.sale * item.quantity, 0);
    }, [cart]);

    return (
        <div className="bg-slate-50 min-h-screen pt-20 pb-16">
            <div className="container mx-auto px-4">
                <header className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
                </header>

                {cart.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cart Items Section */}
                        <main className="md:w-2/3 space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                                </button>
                                <button onClick={handleClearCart} className="text-sm font-medium text-red-500 hover:text-red-700">
                                    Clear Cart
                                </button>
                            </div>
                            {cart.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </main>

                        {/* Order Summary Section */}
                        <aside className="md:w-1/3">
                            <OrderSummary subtotal={subtotal} />
                        </aside>
                    </div>
                ) : (
                    // --- Enhanced Empty Cart View ---
                    <div className="text-center py-20 px-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-sm">
                        <ShoppingCart className="mx-auto h-16 w-16 text-gray-300" />
                        <h2 className="mt-6 text-2xl font-bold text-gray-800">Your cart is feeling a bit lonely.</h2>
                        <p className="text-gray-500 mt-2">
                            Add some amazing products to see them here.
                        </p>
                        <button
                            onClick={() => navigate('/all')}
                            className="inline-block mt-8 rounded-lg border-2 border-black bg-white px-8 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}