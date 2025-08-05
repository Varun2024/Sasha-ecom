import { useState, useMemo } from 'react';

// You can install this icon library with: npm install lucide-react
import { Trash2, Plus, Minus, Tag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx'; // Import the custom hook to access cart context
import { v4 as uuid } from 'uuid';
import { Toastify } from 'toastify';

// --- Mock Cart Data ---
// In a real application, this data would come from context, state management, or an API.
const initialCartItems = [
    {
        id: 1,
        name: 'Classic White Tee',
        category: 'TopWear',
        price: 29.99,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
        quantity: 2,
        size: 'M',
    },
    {
        id: 3,
        name: 'Slim Fit Jeans',
        category: 'BottomWear',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1602293589914-9FF0554c671e?w=600&h=800&fit=crop',
        quantity: 1,
        size: '32/34',
    },
    {
        id: 4,
        name: 'Quilted Bomber Jacket',
        category: 'OuterWear',
        price: 199.50,
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d919b5ca2373?w=600&h=800&fit=crop',
        quantity: 1,
        size: 'L',
    },
];



const TAX_RATE = 0.08; // 8% tax rate
const SHIPPING_COST = 15.00;

// --- Cart Item Component ---
const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-200">
        <img
            src={item.imageUrl}
            alt={item.name}
            className="w-24 h-32 object-cover rounded-md"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x300/f8f8f8/cccccc?text=Image+Not+Found'; }}
        />
        <div className="flex-grow text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
            <button
                onClick={() => onRemove(item.id)}
                className="mt-1 text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto sm:mx-0"
            >
                <Trash2 className="w-4 h-4" /> Remove
            </button>
        </div>
        <div className="flex items-center gap-3">
            <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center text-lg font-medium text-gray-800">{item.quantity}</span>
            <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-2 bg-gray-200 rounded-full text-gray-700 hover:bg-gray-300"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
        <div className="w-24 text-center">
            <p className="text-lg font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)}</p>
        </div>
    </div>
);

// --- Order Summary Component ---
const OrderSummary = ({ subtotal }) => {
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes + SHIPPING_COST;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md md:sticky md:top-24">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
            <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">{SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
                    <span className="font-medium">{taxes.toFixed(2)}</span>
                </div>
            </div>
            <div className="flex items-center justify-between border-t mt-4 pt-4">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{total.toFixed(2)}</span>
            </div>
            <button className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                Proceed to Checkout
            </button>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Tag className="w-4 h-4" />
                <p>Have a coupon code? Apply it at checkout.</p>
            </div>
        </div>
    );
};

// --- Main Cart Page Component ---
export default function CartPage() {
    const { cart } = useCart();
    const carts = cart.map(item => ({
        ...item,
        id:uuid()
    }));
    const [cartItems, setCartItems] = useState(initialCartItems);
    const navigate = useNavigate();

    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity > 0) {
            setCartItems(
                carts.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = useMemo(() => {
        return carts.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [carts]);

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Shopping Cart</h1>
                    <p className="mt-2 text-lg text-gray-600">Review your items and proceed to checkout.</p>
                </header>

                {carts.length > 0 ? (
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cart Items Section */}
                        <main className="md:w-2/3 bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">{`Your Items (${cartItems.length})`}</h2>
                                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" />
                                    Continue Shopping
                                </button>
                            </div>
                            <div>
                                {carts.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </div>
                        </main>

                        {/* Order Summary Section */}
                        <aside className="md:w-1/3">
                            <OrderSummary subtotal={subtotal} />
                        </aside>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800">Your cart is empty.</h2>
                        <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
                        <button
                            onClick={() => navigate('/')} // Navigate to home or product listing page
                            className="mt-6 px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}