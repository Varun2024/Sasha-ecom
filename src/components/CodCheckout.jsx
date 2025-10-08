
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase/firebaseConfig';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
// Note: The toastify CSS should be imported in your main app file (e.g., App.jsx or main.jsx)
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';

// Confirmation Modal Component (re-used for final confirmation)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Confirm Your Order</h2>
                <p className="text-gray-400 mb-6 text-center">
                    Please confirm to place your Cash on Delivery order. This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                    <button onClick={onClose} disabled={isLoading} className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isLoading} className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2">
                        {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
                        Confirm & Place
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

    // Get data passed from the previous page
    const [shippingDetails, setShippingDetails] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        if (location.state?.selectedAddress && location.state?.totalAmount) {
            setShippingDetails(location.state.selectedAddress);
            setTotalAmount(location.state.totalAmount);
        } else {
            // If no data is passed, redirect back to checkout to select an address
            toast.error("No address selected. Redirecting...");
            setTimeout(() => navigate('/checkout'), 2000);
        }
    }, [location.state, navigate]);
    
    const handlePlaceOrderClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirmOrder = async () => {
        if (!auth.currentUser) {
            toast.error("You must be logged in to place an order.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Processing your order...");

        try {
            // Step 1: Generate a unique order ID client-side to pass to the delivery API
            const clientOrderId = `sasha-cod-${Date.now()}`;

            // Step 2: Call backend to create the delivery shipment first
            toast.update(toastId, { render: "Creating delivery shipment..." });
            const deliveryResponse = await fetch('http://localhost:5000/api/create-shipment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order: clientOrderId, // Use our client-generated ID
                    destination_address: shippingDetails.address,
                    destination_phone: shippingDetails.phone,
                    payment_mode: "COD",
                    destination_name: shippingDetails.fullName,
                    destination_pincode: shippingDetails.zip,
                    destination_city: shippingDetails.city, // As per docs example
                    destination_state: shippingDetails.state, // As per docs example
                    products_desc: cart.map(item => item.name).join(', '),
                    hsn_code: "NA",
                    cod_amount: totalAmount,
                    total_amount: totalAmount,
                    quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
                    // Adding required fields from Delhivery docs
                    weight: 0.5, // Default weight in KG
                    shipment_width: 200, // Default width in CM
                    shipment_height: 200, // Default height in CM
                })
            });

            const deliveryResult = await deliveryResponse.json();
            if (!deliveryResult.success) {
                console.log(deliveryResult.error || "Failed to create shipment.");
                throw new Error("ye vala "+ deliveryResult.error || "Failed to create shipment.");
            }
            
            const waybill = deliveryResult.data?.packages?.[0]?.waybill;
            if (!waybill) {
                throw new Error("Tracking number (Waybill) not found in the API response.");
            }

            // Step 3: Construct the final order object with all details, including the waybill
            const orderDetails = {
                orderId: clientOrderId,
                waybill: waybill,
                items: cart,
                shippingAddress: shippingDetails,
                paymentMethod: "COD",
                totalAmount: totalAmount,
                orderStatus: "Processing", // Order is immediately processing
                orderDate: Date.now(),
            };

            // Step 4: Save the complete order object into the user's document
            toast.update(toastId, { render: "Saving order details..." });
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, {
                orders: arrayUnion(orderDetails)
            });
            
            // Step 5: Success - clear cart and navigate
            toast.update(toastId, { render: "Order placed successfully!", type: "success", isLoading: false, autoClose: 5000 });
            dispatch({ type: 'CLEAR_CART' });
            navigate(`/order-success/${clientOrderId}`);

        } catch (error) {
            console.error("Order placement failed:", error);
            toast.update(toastId, { render: `Error: ${error.message}`, type: "error", isLoading: false, autoClose: 3000 ,hideProgressBar: true});
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };
    
    if (!shippingDetails) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                 <ToastContainer theme="dark" position="bottom-right" />
                <Loader2 className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <>
            <ToastContainer theme="dark" position="bottom-right" />
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmOrder}
                isLoading={isLoading}
            />
            <div className="container mx-auto max-w-4xl px-4 py-16 text-white">
                <Link to="/checkout" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6">
                    <ArrowLeft size={20} /> Back to Address Selection
                </Link>
                <h1 className="text-4xl font-extrabold text-center mb-8">Confirm COD Order</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Details */}
                    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Shipping To:</h2>
                            <div className="text-gray-300">
                                <p className="font-bold">{shippingDetails.fullName}</p>
                                <p>{shippingDetails.address}, {shippingDetails.city}</p>
                                <p>{shippingDetails.state}, {shippingDetails.zip}</p>
                                <p>Phone: {shippingDetails.phone}</p>
                            </div>
                        </div>
                         <div>
                            <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Payment Method:</h2>
                            <p className="font-bold text-purple-400">Cash on Delivery (COD)</p>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
                        <h2 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">Order Summary</h2>
                        <div className="space-y-2">
                             {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-300">{item.name} x {item.quantity}</span>
                                    <span className="font-medium">₹{(item.sale * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-700 mt-4 pt-4 space-y-2">
                            <div className="flex justify-between text-lg font-bold text-purple-400">
                                <span>Total Amount to Pay:</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500 text-center pt-2">Includes all taxes and delivery charges.</p>
                        </div>
                        <button 
                            onClick={handlePlaceOrderClick} 
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300 mt-6 flex items-center justify-center gap-2"
                        >
                           <ShoppingBag size={20} /> Confirm & Place Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

