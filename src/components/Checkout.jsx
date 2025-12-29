import { useState, useMemo, useEffect, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, Plus } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import DataContext from '../context/Context';

const SHIPPING_COST = 100.00;

// Minimalist Stepper
const CheckoutStep = ({ number, title, active }) => (
    <div className="flex items-center gap-3">
        <span className={`text-[11px] font-medium px-2 py-0.5 border ${active ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-400'}`}>
            {number}
        </span>
        <h2 className={`text-[12px] uppercase tracking-[0.2em] font-medium ${active ? 'text-black' : 'text-gray-400'}`}>
            {title}
        </h2>
    </div>
);

const AddressCard = ({ address, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(address)}
        className={`p-5 border transition-all relative ${isSelected ? 'border-black bg-[#fafafa]' : 'border-gray-100 hover:border-gray-300'}`}
    >
        {isSelected && <div className="absolute top-0 right-0 p-2"><CheckCircle size={14} className="text-black" /></div>}
        <p className="text-[13px] font-semibold uppercase tracking-wider mb-1 text-gray-900">{address.fullName}</p>
        <p className="text-[13px] text-gray-500 font-light leading-relaxed">{address.address}</p>
        <p className="text-[13px] text-gray-500 font-light uppercase tracking-tight">{address.city}, {address.state} - {address.zip}</p>
        <p className="text-[12px] text-gray-400 mt-2 font-light">M: {address.phone}</p>
    </div>
);

const ShippingForm = ({ onSave, onCancel, isProcessing }) => {
    const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: '', state: '', zip: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-5 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input name="fullName" placeholder="FULL NAME" onChange={handleChange} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors font-light uppercase tracking-wider" required />
                <input name="phone" placeholder="PHONE NUMBER" onChange={handleChange} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors font-light uppercase tracking-wider" required />
            </div>
            <input name="address" placeholder="DETAILED ADDRESS (LANDMARK, STREET, HOUSE NO)" onChange={handleChange} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors font-light uppercase tracking-wider" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <input name="city" placeholder="CITY" onChange={handleChange} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors font-light uppercase tracking-wider" required />
                <input name="state" placeholder="STATE" onChange={handleChange} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors font-light uppercase tracking-wider" required />
                <input name="zip" placeholder="PIN CODE" onChange={handleChange} className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-black transition-colors font-light uppercase tracking-wider" required />
            </div>
            <div className="flex flex-col gap-3 pt-4">
                <button type="submit" disabled={isProcessing} className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gray-800 transition-all flex items-center justify-center">
                    {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Save & Deliver Here'}
                </button>
                {onCancel && <button type="button" onClick={onCancel} className="text-[11px] uppercase tracking-widest text-gray-400 hover:text-black">Go Back</button>}
            </div>
        </form>
    );
};

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const { cart } = useCart();
    const { currentUser, userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const { mode, setMode } = useContext(DataContext);

    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.sale * item.quantity, 0), [cart]);
    const total = subtotal + SHIPPING_COST;

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!currentUser) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', currentUser.user.uid));
                if (userDoc.exists() && userDoc.data().addresses?.length > 0) {
                    setAddresses(userDoc.data().addresses);
                    setSelectedAddress(userDoc.data().addresses[0]);
                } else {
                    setShowAddressForm(true);
                }
            } catch (err) { console.error(err); }
            finally { setIsLoadingAddresses(false); }
        };
        fetchAddresses();
    }, [currentUser]);

    const handleSaveAddress = async (newAddress) => {
        setIsProcessing(true);
        try {
            await updateDoc(doc(db, 'users', currentUser.user.uid), { addresses: arrayUnion(newAddress) });
            setAddresses([...addresses, newAddress]);
            setSelectedAddress(newAddress);
            setShowAddressForm(false);
            toast.success("Address Updated");
        } catch (err) { toast.error("Failed to save"); }
        finally { setIsProcessing(false); }
    };

    const handleShippingSubmit = async () => {
        setIsProcessingPayment(true);
        const amountInPaise = Math.round(total * 100);
        try {
            const response = await fetch('https://sasha-backend.onrender.com/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amountInPaise,
                    customerName: selectedAddress.fullName,
                    customerPhone: selectedAddress.phone,
                    customerEmail: currentUser.user.email,
                }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('cartForOrder', JSON.stringify(cart));
                localStorage.setItem('shippingAddressForOrder', JSON.stringify(selectedAddress));
                window.location.href = data.redirectUrl;
            } else { toast.error("Payment initiation failed"); }
        } catch (err) { toast.error("Unexpected error"); }
        finally { setIsProcessingPayment(false); }
    };

    if (cart.length === 0 && step < 2) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-[#fafafa]">
                <h1 className="text-xl font-light uppercase tracking-widest mb-4">Your bag is empty</h1>
                <button onClick={() => navigate('/')} className="px-8 py-3 border border-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">Shop Collections</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-32 pb-20">
            <ToastContainer theme="light" position="bottom-center" />
            <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column: Checkout Actions */}
                <div className="lg:col-span-7 bg-white p-6 md:p-10 shadow-sm border border-gray-50">
                    <div className="flex justify-between items-center mb-12">
                        <CheckoutStep number={1} title="Shipping" active={step === 1} />
                        <div className="w-12 h-[1px] bg-gray-200"></div>
                        <CheckoutStep number={2} title="Payment" active={step === 2} />
                    </div>

                    {isLoadingAddresses ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-200" size={40} /></div>
                    ) : showAddressForm ? (
                        <ShippingForm onSave={handleSaveAddress} isProcessing={isProcessing} onCancel={addresses.length > 0 ? () => setShowAddressForm(false) : null} />
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-[12px] uppercase tracking-[0.2em] font-semibold text-gray-900">Select Delivery Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.map((addr, i) => (
                                    <AddressCard key={i} address={addr} isSelected={selectedAddress === addr} onSelect={setSelectedAddress} />
                                ))}
                                <button onClick={() => setShowAddressForm(true)} className="border-2 border-dashed border-gray-100 p-5 flex flex-col items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all">
                                    <Plus size={20} className="mb-2" />
                                    <span className="text-[11px] uppercase tracking-widest">New Address</span>
                                </button>
                            </div>

                            <div className="pt-8 space-y-4">
                                <button
                                    onClick={handleShippingSubmit}
                                    disabled={!selectedAddress || isProcessingPayment}
                                    className="w-full bg-black text-white py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-300"
                                >
                                    {isProcessingPayment ? <Loader2 className="animate-spin inline mr-2" size={14} /> : `Pay ₹${total.toFixed(2)} Now`}
                                </button>
                                <button
                                    onClick={() => { setMode("COD"); navigate('/cod-checkout', { state: { selectedAddress, totalAmount: total + 50 } }); }}
                                    className="w-full border border-gray-200 py-4 text-xs tracking-[0.2em] uppercase font-semibold text-gray-600 hover:border-black hover:text-black transition-all"
                                >
                                    Cash on Delivery (₹{total + 100})
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-50 sticky top-32">
                        <h3 className="text-[12px] uppercase tracking-[0.2em] font-semibold mb-6 pb-4 border-b border-gray-50">Your Order</h3>
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6 scrollbar-hide">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-20 bg-gray-50 flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-[12px] uppercase font-medium text-gray-900 leading-tight">{item.name}</h4>
                                        <p className="text-[11px] text-gray-400 uppercase mt-1">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                        <p className="text-[12px] font-medium mt-1">₹{(item.sale * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <div className="flex justify-between text-[13px] text-gray-500 font-light">
                                <span className="uppercase tracking-widest">Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[13px] text-gray-500 font-light">
                                <span className="uppercase tracking-widest">Shipping</span>
                                <span>₹{SHIPPING_COST.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[14px] font-semibold text-gray-900 pt-2">
                                <span className="uppercase tracking-[0.2em]">Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}