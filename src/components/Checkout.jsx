/* eslint-disable no-unused-vars */
// import { useState, useMemo } from 'react';
// import { useCart } from '../context/CartContext';
// import { useNavigate } from 'react-router-dom';
// import { CreditCard, CheckCircle } from 'lucide-react';

// const TAX_RATE = 0.08;
// const SHIPPING_COST = 15.00;

// // A component to display the current step in the checkout process
// const CheckoutStep = ({ number, title, active }) => (
//     <div className="flex items-center gap-4">
//         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${active ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-400'}`}>
//             {number}
//         </div>
//         <h2 className={`text-lg font-semibold ${active ? 'text-white' : 'text-gray-400'}`}>{title}</h2>
//     </div>
// );

// // Form for collecting shipping information
// const ShippingForm = ({ onNext, formData, setFormData }) => {
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {

//         e.preventDefault();
//         onNext();
//     };

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
//                     <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
//                     <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
//                 </div>
//             </div>
//             <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
//                 <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
//                     <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
//                     <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-1">Zip Code</label>
//                     <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
//                 </div>
//             </div>
//             <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 mt-6">
//                 Continue to Payment
//             </button>
//         </form>
//     );
// };

// // Form for collecting payment information
// const PaymentForm = ({ onNext, onBack, formData, setFormData }) => {
//      const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onNext();
//     };
//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-1">Card Number</label>
//                 <div className="relative">
//                     <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
//                     <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="•••• •••• •••• ••••" required />
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-1">Expiration Date</label>
//                     <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="MM/YY" required />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-1">CVC</label>
//                     <input type="text" name="cvc" value={formData.cvc} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="•••" required />
//                 </div>
//             </div>
//             <div className="flex gap-4 mt-6">
//                 <button type="button" onClick={onBack} className="w-full bg-gray-300 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300">
//                     Back to Shipping
//                 </button>
//                 <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300">
//                     Review Order
//                 </button>
//             </div>
//         </form>
//     );
// };

// // Component for reviewing the order before placing it
// const OrderReview = ({ onBack, onPlaceOrder, formData }) => {
//     const { cart } = useCart();
//     const subtotal = useMemo(() => cart.reduce((total, item) => total + item.sale * item.quantity, 0), [cart]);
//     const total = subtotal  + SHIPPING_COST;

//     return (
//         <div>
//             <div className="space-y-6 ">
//                 <div>
//                     <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 ">Shipping Information</h3>
//                     <p>{formData.fullName}</p>
//                     <p>{formData.email}</p>
//                     <p>{formData.address}</p>
//                     <p>{formData.city}, {formData.state} {formData.zip}</p>
//                 </div>
//                  <div>
//                     <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 ">Payment Information</h3>
//                     <p>Card ending in •••• {formData.cardNumber.slice(-4)}</p>
//                 </div>
//                 <div>
//                     <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2 ">Order Summary</h3>
//                     {cart.map(item => (
//                         <div key={item.id} className="flex justify-between items-center py-2">
//                             <span>{item.name} x {item.quantity}</span>
//                             <span className="font-medium">₹{(item.sale * item.quantity).toFixed(2)}</span>
//                         </div>
//                     ))}
//                      <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
//                         <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
//                         <div className="flex justify-between"><span>Shipping</span><span>₹{SHIPPING_COST.toFixed(2)}</span></div>
//                         {/* <div className="flex justify-between"><span>Taxes</span><span>${taxes.toFixed(2)}</span></div> */}
//                         <div className="flex justify-between text-xl font-bold mt-2 "><span>Total</span><span>₹{total.toFixed(2)}</span></div>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex gap-4 mt-8">
//                 <button onClick={onBack} className="w-full bg-gray-300 text-white font-bold py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300">
//                     Back to Payment
//                 </button>
//                 <button onClick={onPlaceOrder} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300">
//                     Place Order
//                 </button>
//             </div>
//         </div>
//     );
// };

// // Main Checkout Page Component
// export default function CheckoutPage() {
//     const [step, setStep] = useState(1);
//     const { cart, dispatch } = useCart();
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         fullName: '', email: '', address: '', city: '', state: '', zip: '',
//         cardNumber: '', expiryDate: '', cvc: ''
//     });

//     // Handle placing the order
//     const handlePlaceOrder = () => {
//         console.log('Order placed:', { formData, cart });
//         // In a real app, you would send this to a server
//         dispatch({ type: 'SET_CART', payload: [] }); // Clear cart
//         setStep(4); // Move to confirmation step
//     };

//     // If cart is empty, redirect user
//     if (cart.length === 0 && step < 4) {
//         return (
//             <div className="container mx-auto px-4 py-16 text-center">
//                 <h1 className="text-3xl font-bold">Your cart is empty.</h1>
//                 <p className="text-gray-400 mt-2">Add items to your cart to proceed to checkout.</p>
//                 <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
//                     Go to Cart
//                 </button>
//             </div>
//         )
//     }

//     return (
//         <div className="container mx-auto px-4 py-16 mt-20">
//             <div className="max-w-3xl mx-auto">
//                 <h1 className="text-4xl font-extrabold text-center mb-8">Checkout</h1>
//                 {step < 4 && (
//                     <div className="flex justify-between items-center mb-12">
//                         <CheckoutStep number={1} title="Shipping" active={step >= 1} />
//                         <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
//                         <CheckoutStep number={2} title="Payment" active={step >= 2} />
//                         <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
//                         <CheckoutStep number={3} title="Review" active={step >= 3} />
//                     </div>
//                 )}

//                 <div className="bg-white/5 p-8 rounded-lg shadow-2xl">
//                     {step === 1 && <ShippingForm onNext={() => setStep(2)} formData={formData} setFormData={setFormData} />}
//                     {step === 2 && <PaymentForm onNext={() => setStep(3)} onBack={() => setStep(1)} formData={formData} setFormData={setFormData} />}
//                     {step === 3 && <OrderReview onBack={() => setStep(2)} onPlaceOrder={handlePlaceOrder} formData={formData} />}
//                     {step === 4 && (
//                         <div className="text-center py-8">
//                             <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
//                             <h2 className="text-3xl font-bold">Thank you for your order!</h2>
//                             <p className="text-gray-400 mt-2">Your order has been placed successfully. A confirmation email has been sent.</p>
//                              <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
//                                 Back to Cart
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }



import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, PlusCircle } from 'lucide-react'; // Added Loader2 for loading state
import { toast, ToastContainer } from 'react-toastify'; // Added for error feedback
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';


const SHIPPING_COST = 0.00; // Fixed shipping cost for simplicity

// A component to display the current step in the checkout process
const CheckoutStep = ({ number, title, active }) => (
    <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${active ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-400'}`}>
            {number}
        </div>
        <h2 className={`text-lg font-semibold ${active ? 'text-black' : 'text-gray-400'}`}>{title}</h2>
    </div>
);


// A component to display a single address for selection
const AddressCard = ({ address, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(address)}
        className={`p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-purple-500 ring-2 ring-purple-500 bg-purple-900/20' : 'border-gray-700 hover:border-purple-600'}`}
    >
        <p className="font-bold text-black">{address.fullName}</p>
        <p className="text-sm text-gray-600">{address.address}, {address.city}</p>
        <p className="text-sm text-gray-600">{address.state}, {address.zip}</p>
        <p className="text-sm text-gray-600">Phone: {address.phone}</p>
    </div>
);


// ShippingForm remains mostly the same, but its submit handler is now for saving
const ShippingForm = ({ onSave, onCancel, isProcessing, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        fullName: '', phone: '', address: '', city: '', state: '', zip: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* ... (all the input fields from your original code) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Zip Code</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} className="w-full bg-gray-300 border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:bg-purple-400"
                >
                    {isProcessing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Save Address'}
                </button>
            </div>
        </form>
    );
};


// Main Checkout Page Component
export default function CheckoutPage() {
    const [step, setStep] = useState(1); // Manages UI state (shipping form vs confirmation)
    const { cart } = useCart();
    const { currentUser, userLoggedIn } = useAuth(); // Get current user
    const navigate = useNavigate();
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    // Added 'phone' to the initial state
    const [formData, setFormData] = useState({
        fullName: '', email: '', phone: '', address: '', city: '', state: '', zip: '',
    });

    // Memoized calculation for total
    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.sale * item.quantity, 0), [cart]);
    const total = subtotal + SHIPPING_COST;

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!currentUser && !userLoggedIn) {
                toast.error("Please log in to continue.");
                // navigate('/login');
                return;
            };
            setIsLoadingAddresses(true);
            try {
                const userDocRef = doc(db, 'users', currentUser.user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists() && userDoc.data().addresses?.length > 0) {
                    const userAddresses = userDoc.data().addresses;
                    setAddresses(userAddresses);
                    setSelectedAddress(userAddresses[0]); // Default to first address
                    setShowAddressForm(false);
                } else {
                    setShowAddressForm(true); // No addresses found, show form
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
                toast.error("Could not load your addresses.");
            } finally {
                setIsLoadingAddresses(false);
            }
        };

        fetchAddresses();
    }, [userLoggedIn, currentUser, navigate]);

    // Handler for saving a new address
    const handleSaveAddress = async (newAddress) => {
        setIsProcessing(true);
        try {
            const userDocRef = doc(db, 'users', currentUser.user.uid);
            // Use arrayUnion to add the new address to the existing array
            await updateDoc(userDocRef, {
                addresses: arrayUnion(newAddress)
            });

            // Update local state to reflect the change immediately
            const updatedAddresses = [...addresses, newAddress];
            setAddresses(updatedAddresses);
            setSelectedAddress(newAddress);
            setShowAddressForm(false);
            toast.success("Address saved successfully!");
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error("Failed to save address.");
        } finally {
            setIsProcessing(false);
        }
    };
    // NEW: Function to handle payment initiation
    const handleShippingSubmit = async () => {
        if (!selectedAddress) {
            toast.error("Please select or add a shipping address.");
            setIsProcessingPayment(false);
            return;
        }
        setIsProcessingPayment(true);


        // Amount must be in paise for your API
        const amountInPaise = Math.round(total * 100) + 50;

        try {
            const response = await fetch('https://sasha-backend.onrender.com/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amountInPaise,
                    customerName: selectedAddress.fullName,
                    customerPhone: selectedAddress.phone,
                    customerEmail: selectedAddress.email || currentUser.user.email,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Redirect user to the PhonePe payment page
                localStorage.setItem('cartForOrder', JSON.stringify(cart));
                localStorage.setItem('shippingAddressForOrder', JSON.stringify(selectedAddress));
                window.location.href = data.redirectUrl;

            } else {
                // Handle API errors
                toast.error(data.error || 'Failed to initiate payment. Please try again.');
                window.location.reload(); // Reload to allow retry
                setIsProcessingPayment(false);
            }
        } catch (error) {
            // Handle network or unexpected errors
            console.error("Payment initiation failed:", error);
            toast.error('An unexpected error occurred. Please check your connection and try again.');
            setIsProcessingPayment(false);
        } finally {
            setIsProcessingPayment(false);
        }
    };
    const renderShippingStep = () => {
        if (isLoadingAddresses) {
            return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>;
        }

        if (showAddressForm) {
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">Add a New Shipping Address</h3>
                    <ShippingForm
                        onSave={handleSaveAddress}
                        isProcessing={isProcessing}
                        // Show cancel button only if they already have other addresses to go back to
                        onCancel={addresses.length > 0 ? () => setShowAddressForm(false) : null}
                    />
                </div>
            );
        }

        return (
            <div>
                <h3 className="text-xl font-semibold mb-4 text-black">Select a Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {addresses.map((addr, index) => (
                        <AddressCard
                            key={index}
                            address={addr}
                            isSelected={selectedAddress === addr}
                            onSelect={setSelectedAddress}
                        />
                    ))}
                    <button
                        onClick={() => setShowAddressForm(true)}
                        className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-purple-500 hover:text-gray-600 transition-colors"
                    >
                        <PlusCircle className="w-8 h-8 mb-2" />
                        <span>Add New Address</span>
                    </button>
                </div>
                <button
                    onClick={handleShippingSubmit}
                    disabled={isProcessing || !selectedAddress}
                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 mt-6 flex items-center justify-center disabled:bg-purple-400 disabled:cursor-not-allowed"
                >
                    {isProcessingPayment ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : `Continue to Pay ₹${total.toFixed(2)}`}
                </button>
            </div>
        );
    }

    // If cart is empty, redirect user (unless they are on the confirmation page)
    if (cart.length === 0 && step < 2) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold">Your cart is empty.</h1>
                <p className="text-gray-400 mt-2">Add items to your cart to proceed to checkout.</p>
                <button onClick={() => navigate('/cart')} className="mt-6 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                    Go to Cart
                </button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-16 mt-20">
            <ToastContainer theme="dark" position="bottom-right" />
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-8">Checkout</h1>
                {/* The visual stepper is kept for clarity but now only has two effective steps */}
                {step < 2 && (
                    <div className="flex justify-between items-center mb-12">
                        <CheckoutStep number={1} title="Shipping" active={step === 1} />
                        <div className="flex-1 h-0.5 bg-gray-700 mx-4"></div>
                        <CheckoutStep number={2} title="Payment" active={step > 1} />
                    </div>
                )}

            <section className='container mx-auto mb-12 p-6 bg-white/5 rounded-lg shadow-lg max-w-3xl'>
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="text-sm text-gray-400">{item.selectedSize} / {item.selectedColor}</span>
                        <span className="font-medium">₹{(item.sale * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </section>
                <div className="bg-white/5 p-8 rounded-lg shadow-2xl">

                    {step === 1 && (
                        renderShippingStep()
                    )}

                    {/* NOTE: Step 4 from your original code is now Step 2 here */}
                    {/* This would be shown on a different route '/payment-status' based on your backend redirect */}
                    {step === 2 && (
                        <div className="text-center py-8">
                            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold">Thank you for your order!</h2>
                            <p className="text-gray-400 mt-2">Your order has been placed successfully.</p>
                            <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}