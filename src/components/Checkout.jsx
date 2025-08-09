import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle } from 'lucide-react';

const TAX_RATE = 0.08;
const SHIPPING_COST = 15.00;

// A component to display the current step in the checkout process
const CheckoutStep = ({ number, title, active }) => (
    <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${active ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
            {number}
        </div>
        <h2 className={`text-lg font-semibold ${active ? 'text-white' : 'text-gray-400'}`}>{title}</h2>
    </div>
);

// Form for collecting shipping information
const ShippingForm = ({ onNext, formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Zip Code</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
            </div>
            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 mt-6">
                Continue to Payment
            </button>
        </form>
    );
};

// Form for collecting payment information
const PaymentForm = ({ onNext, onBack, formData, setFormData }) => {
     const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
                <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="•••• •••• •••• ••••" required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Expiration Date</label>
                    <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="MM/YY" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">CVC</label>
                    <input type="text" name="cvc" value={formData.cvc} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="•••" required />
                </div>
            </div>
            <div className="flex gap-4 mt-6">
                <button type="button" onClick={onBack} className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                    Back to Shipping
                </button>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                    Review Order
                </button>
            </div>
        </form>
    );
};

// Component for reviewing the order before placing it
const OrderReview = ({ onBack, onPlaceOrder, formData }) => {
    const { cart } = useCart();
    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
    const taxes = subtotal * TAX_RATE;
    const total = subtotal + taxes + SHIPPING_COST;

    return (
        <div>
            <div className="space-y-6 text-gray-300">
                <div>
                    <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 text-white">Shipping Information</h3>
                    <p>{formData.fullName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zip}</p>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 text-white">Payment Information</h3>
                    <p>Card ending in •••• {formData.cardNumber.slice(-4)}</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 text-white">Order Summary</h3>
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                            <span>{item.name} x {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                     <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
                        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>${SHIPPING_COST.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Taxes</span><span>${taxes.toFixed(2)}</span></div>
                        <div className="flex justify-between text-xl font-bold mt-2 text-white"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button onClick={onBack} className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300">
                    Back to Payment
                </button>
                <button onClick={onPlaceOrder} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300">
                    Place Order
                </button>
            </div>
        </div>
    );
};

// Main Checkout Page Component
export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const { cart, dispatch } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '', email: '', address: '', city: '', state: '', zip: '',
        cardNumber: '', expiryDate: '', cvc: ''
    });

    // Handle placing the order
    const handlePlaceOrder = () => {
        console.log('Order placed:', { formData, cart });
        // In a real app, you would send this to a server
        dispatch({ type: 'SET_CART', payload: [] }); // Clear cart
        setStep(4); // Move to confirmation step
    };

    // If cart is empty, redirect user
    if (cart.length === 0 && step < 4) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold">Your cart is empty.</h1>
                <p className="text-gray-400 mt-2">Add items to your cart to proceed to checkout.</p>
                <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                    Go to Cart
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-8">Checkout</h1>
                {step < 4 && (
                    <div className="flex justify-between items-center mb-12">
                        <CheckoutStep number={1} title="Shipping" active={step >= 1} />
                        <div className="flex-1 h-0.5 bg-gray-700 mx-4"></div>
                        <CheckoutStep number={2} title="Payment" active={step >= 2} />
                        <div className="flex-1 h-0.5 bg-gray-700 mx-4"></div>
                        <CheckoutStep number={3} title="Review" active={step >= 3} />
                    </div>
                )}

                <div className="bg-white/5 p-8 rounded-lg shadow-2xl">
                    {step === 1 && <ShippingForm onNext={() => setStep(2)} formData={formData} setFormData={setFormData} />}
                    {step === 2 && <PaymentForm onNext={() => setStep(3)} onBack={() => setStep(1)} formData={formData} setFormData={setFormData} />}
                    {step === 3 && <OrderReview onBack={() => setStep(2)} onPlaceOrder={handlePlaceOrder} formData={formData} />}
                    {step === 4 && (
                        <div className="text-center py-8">
                            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold">Thank you for your order!</h2>
                            <p className="text-gray-400 mt-2">Your order has been placed successfully. A confirmation email has been sent.</p>
                             <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                                Back to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


