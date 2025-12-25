import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase/firebaseConfig';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import { Loader2, ShoppingBag, ArrowLeft, Check } from 'lucide-react';

// Refined Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white text-gray-900 rounded-sm shadow-2xl p-8 max-w-sm w-full border border-gray-100">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border border-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={20} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-sm font-semibold tracking-[0.2em] uppercase">Confirm Order</h2>
                    <p className="text-[12px] text-gray-500 font-light leading-relaxed">
                        Are you sure you want to place this Cash on Delivery order? This action will finalize your purchase.
                    </p>
                </div>
                <div className="flex flex-col gap-3 mt-8">
                    <button 
                        onClick={onConfirm} 
                        disabled={isLoading} 
                        className="w-full py-4 bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm & Place Order'}
                    </button>
                    <button 
                        onClick={onClose} 
                        disabled={isLoading} 
                        className="w-full py-3 text-[10px] text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function CodCheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, dispatch } = useCart();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shippingDetails, setShippingDetails] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (location.state?.selectedAddress && location.state?.totalAmount) {
            setShippingDetails(location.state.selectedAddress);
            setTotalAmount(location.state.totalAmount);
        } else {
            toast.error("REDIRECTING TO CHECKOUT...");
            setTimeout(() => navigate('/checkout'), 2000);
        }
    }, [location.state, navigate]);
    
    const handleConfirmOrder = async () => {
        if (!auth.currentUser) {
            toast.error("PLEASE LOG IN TO CONTINUE.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("SYNCING WITH ATELIER...");

        try {
            const clientOrderId = `SASHA-COD-${Date.now()}`;
            const orderDetails = {
                orderId: clientOrderId,
                items: cart,
                shippingAddress: shippingDetails,
                paymentMethod: "COD",
                totalAmount: totalAmount,
                orderStatus: "Processing",
                orderDate: Date.now(),
            };

            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, {
                orders: arrayUnion(orderDetails)
            });
            
            toast.update(toastId, { 
                render: "ORDER PLACED SUCCESSFULLY", 
                type: "success", 
                isLoading: false, 
                autoClose: 2000 
            });
            
            dispatch({ type: 'CLEAR' });
            setTimeout(() => navigate(`/orders`), 1500);

        } catch (error) {
            toast.update(toastId, { 
                render: `ERROR: ${error.message}`, 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };
    
    if (!shippingDetails) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <Loader2 className="animate-spin h-6 w-6 text-gray-200" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-8 pb-20 font-light">
            <ToastContainer theme="light" position="bottom-center" />
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
                isLoading={isLoading}
            />

            <div className="container mx-auto max-w-5xl px-4">
                <Link to="/checkout" className="inline-flex items-center gap-2 text-[11px] tracking-widest text-gray-400 uppercase hover:text-black mb-10 transition-colors">
                    <ArrowLeft size={14} /> Back to Selection
                </Link>

                <div className="text-center mb-16">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3 italic">Final Step</h2>
                    <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-gray-900 uppercase">Review <span className="font-semibold">Order</span></h1>
                    <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Side: Summary */}
                    <div className="lg:col-span-7 bg-white p-8 md:p-12 border border-gray-100 shadow-sm rounded-sm space-y-10">
                        <section className="space-y-4">
                            <h2 className="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-900 border-b border-gray-50 pb-3">Shipping Details</h2>
                            <div className="text-[13px] text-gray-500 space-y-1 uppercase tracking-wider leading-relaxed">
                                <p className="font-semibold text-gray-900">{shippingDetails.fullName}</p>
                                <p>{shippingDetails.address}</p>
                                <p>{shippingDetails.city}, {shippingDetails.state} — {shippingDetails.zip}</p>
                                <p className="mt-4 text-[11px] text-gray-400 font-normal">M: {shippingDetails.phone}</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-900 border-b border-gray-50 pb-3">Payment Method</h2>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-[12px] font-medium tracking-[0.1em] text-gray-900 uppercase">Cash on Delivery (COD)</p>
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Totals */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
                            <h2 className="text-[11px] tracking-[0.3em] font-bold uppercase text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-[12px]">
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium uppercase tracking-tight">{item.name}</span>
                                            <span className="text-gray-400 text-[10px] uppercase">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="text-gray-900 font-light">₹{(item.sale * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-50 pt-6 space-y-3 text-[13px]">
                                <div className="flex justify-between text-gray-400 font-light italic">
                                    <span>COD Collection Fee</span>
                                    <span>₹100.00</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 tracking-[0.1em]">
                                    <span className="uppercase">To be paid:</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setIsModalOpen(true)} 
                                className="w-full bg-black text-white text-[11px] font-bold tracking-[0.2em] uppercase py-5 mt-10 hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={14} /> Finalize Order
                            </button>
                            <p className="text-[9px] text-gray-400 text-center mt-6 uppercase tracking-widest leading-relaxed">
                                Prices inclusive of all taxes and door-step delivery charges.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}