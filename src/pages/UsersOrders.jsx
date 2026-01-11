


// import React, { useState, useEffect } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
// import { Package, ChevronRight, Clock, MapPin, CreditCard, ArrowRight } from 'lucide-react';

// // --- Helper Components ---

// const LoadingSpinner = () => (
//     <div className="flex flex-col items-center justify-center py-32 space-y-4">
//         <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
//         <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold italic">Synchronizing Archive...</p>
//     </div>
// );

// const EmptyState = () => (
//     <div className="text-center py-20 bg-white border border-gray-100 rounded-sm animate-in fade-in duration-700">
//         <Package size={40} strokeWidth={1} className="mx-auto text-gray-200 mb-6" />
//         <h3 className="text-[12px] tracking-[0.4em] uppercase font-bold text-gray-900">Archive Empty</h3>
//         <p className="text-[11px] tracking-widest text-gray-400 uppercase mt-2 max-w-xs mx-auto leading-relaxed">
//             Your collection history is currently empty.
//         </p>
//         <Link to="/all" className="mt-10 inline-flex items-center gap-3 text-[10px] tracking-[0.3em] font-bold uppercase text-black border-b border-black pb-1 hover:opacity-50 transition-opacity">
//             Discover Pieces <ArrowRight size={12} />
//         </Link>
//     </div>
// );

// const OrderItem = ({ item }) => {
//     const imageSrc = item.imageUrl || item.imageUrls?.[0] || 'https://via.placeholder.com/150?text=Atelier';

//     return (
//         <li className="p-6 flex items-start sm:items-center space-x-6 group border-b border-gray-50 last:border-0">
//             <div className="flex-shrink-0 bg-[#fafafa] overflow-hidden rounded-sm w-20 h-28">
//                 <img src={imageSrc} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
//             </div>
//             <div className="flex-1 min-w-0">
//                 <p className="text-[11px] tracking-[0.1em] font-bold text-gray-900 uppercase">{item.name || 'Unnamed Piece'}</p>
//                 <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-widest text-gray-500 uppercase">
//                     {(item.selectedSize || item.size) && <span>Size: {item.selectedSize || item.size}</span>}
//                     {(item.selectedColor || item.color) && <span>Color: {item.selectedColor || item.color}</span>}
//                     <span className="text-gray-400">Qty: {item.quantity}</span>
//                 </div>
//                 <div className="mt-4 sm:hidden">
//                     <p className="text-sm font-semibold text-gray-900 tracking-tight">₹{item.sale || item.price || 0}</p>
//                     <Link to={`/product/${item.productId}`} className="text-[9px] tracking-widest text-gray-900 underline uppercase hover:text-black transition-colors block mt-2">
//                         View Detail
//                     </Link>
//                 </div>
//             </div>
//             <div className="hidden sm:block text-right">
//                 <p className="text-sm font-bold text-gray-900 tracking-tight">₹{item.sale || item.price || 0}</p>
//                 <Link to={`/product/${item.productId}`} className="text-[9px] tracking-widest text-gray-900 underline uppercase hover:text-black transition-colors block mt-2">
//                     View Detail
//                 </Link>
//             </div>
//         </li>
//     );
// };

// const getStatusStyles = (status) => {
//     const s = status?.toLowerCase() || 'pending';
//     if (s.includes('delivered') || s.includes('completed')) return "text-green-600";
//     if (s.includes('processing')) return "text-amber-500";
//     if (s.includes('shipped')) return "text-blue-500";
//     if (s.includes('cancelled')) return "text-red-400";
//     return "text-orange-400";
// };

// const OrderCard = ({ order }) => {
//     const status = order.orderStatus || order.status || 'Pending';

//     const formatDate = (dateInput) => {
//         if (!dateInput) return '';
//         const date = dateInput.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
//         return date.toLocaleDateString("en-IN", {
//             day: 'numeric', month: 'long', year: 'numeric'
//         }).toUpperCase();
//     };

//     return (
//         <div className="bg-white border border-gray-100 rounded-sm mb-12 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
//             {/* Header */}
//             <div className="px-6 py-6 bg-[#fafafa] border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6">
//                 <div className="space-y-2">
//                     <p className="text-[9px] tracking-[0.3em] font-bold text-gray-400 uppercase">Order Reference</p>
//                     <h3 className="text-sm font-bold tracking-tighter text-gray-900 uppercase">
//                         #{order.orderId?.substring(order.orderId.length - 12) || 'REF-PENDING'}
//                     </h3>
//                 </div>

//                 <div className="grid grid-cols-2 md:flex md:items-center gap-8 md:gap-12">
//                     <div className="space-y-1">
//                         <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">Date</p>
//                         <p className="text-[11px] font-medium text-gray-900 tracking-tight">{formatDate(order.orderDate)}</p>
//                     </div>
//                     <div className="space-y-1">
//                         <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">Status</p>
//                         <p className={`text-[11px] font-bold tracking-widest uppercase ${getStatusStyles(status)}`}>
//                             {status}
//                         </p>
//                     </div>
//                     <div className="space-y-1">
//                         <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">Valuation</p>
//                         <p className="text-[11px] font-bold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Tracking (Minimalist Alert) */}
//             {order.waybill && (
//                 <div className="px-6 py-3 bg-white border-b border-gray-50 flex items-center justify-between">
//                     <div className="flex items-center gap-3 text-[10px] tracking-widest text-gray-400 uppercase">
//                         <MapPin size={12} strokeWidth={1.5} />
//                         <span>Tracking: <span className="text-black font-bold">{order.waybill}</span></span>
//                     </div>
//                     <button className="text-[9px] font-bold uppercase tracking-widest text-blue-500 hover:underline">Track Manifest</button>
//                 </div>
//             )}

//             {/* Items */}
//             <ul className="divide-y divide-gray-50">
//                 {order.items?.map((item, index) => (
//                     <OrderItem key={index} item={item} />
//                 ))}
//             </ul>
//         </div>
//     );
// };

// const MyOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { currentUser } = useAuth();

//     useEffect(() => {
//         if (!currentUser || !db) {
//             if (currentUser === null) setLoading(false);
//             return;
//         }

//         const fetchOrders = async () => {
//             setLoading(true);
//             const userDocRef = doc(db, "users", currentUser.uid || currentUser.user.uid);
//             try {
//                 const docSnap = await getDoc(userDocRef);
//                 if (docSnap.exists()) {
//                     const userData = docSnap.data();
//                     const userOrders = userData.orders || [];
//                     const sortedOrders = userOrders.sort((a, b) => {
//                         const dateA = a.orderDate?.seconds ? a.orderDate.seconds * 1000 : a.orderDate;
//                         const dateB = b.orderDate?.seconds ? b.orderDate.seconds * 1000 : b.orderDate;
//                         return dateB - dateA;
//                     });
//                     setOrders(sortedOrders);
//                 }
//             } catch (err) {
//                 setError("FAILED TO RETRIEVE ORDER ARCHIVE.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [currentUser]);

//     const renderContent = () => {
//         if (loading) return <LoadingSpinner />;
//         if (!currentUser) return (
//             <div className="text-center py-32 border border-dashed border-gray-200">
//                 <h3 className="text-[12px] tracking-[0.4em] uppercase font-bold text-gray-900">Identity Required</h3>
//                 <p className="mt-4 text-[11px] tracking-widest text-gray-400 uppercase">Login to view your atelier history.</p>
//                 <Link to="/login" className="mt-10 inline-block px-10 py-4 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-all">
//                     Login
//                 </Link>
//             </div>
//         );
//         if (error) return <div className="p-6 text-center text-[11px] tracking-widest uppercase text-red-400">{error}</div>;
//         if (orders.length === 0) return <EmptyState />;

//         return (
//             <div className="space-y-4">
//                 {orders.map((order, index) => (
//                     <OrderCard key={index} order={order} />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="bg-white min-h-screen pt-32 pb-20 font-light">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6">
//                 <header className="mb-16 text-center">
//                     <h2 className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-bold mb-3 italic">Account History</h2>
//                     <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-gray-900 uppercase">Your <span className="font-semibold">Archive</span></h1>
//                     <div className="h-[1px] w-12 bg-black mx-auto mt-8"></div>
//                 </header>
//                 <main>
//                     {renderContent()}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default MyOrders;


/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, MapPin, ArrowRight, XCircle, Loader2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

// --- Helper Components ---

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold italic">Synchronizing Archive...</p>
    </div>
);

const OrderItem = ({ item }) => {
    const imageSrc = item.imageUrl || item.imageUrls?.[0] || 'https://via.placeholder.com/150?text=Atelier';
    return (
        <li className="p-6 flex items-start sm:items-center space-x-6 group border-b border-gray-50 last:border-0">
            <div className="flex-shrink-0 bg-[#fafafa] overflow-hidden rounded-sm w-20 h-28">
                <img src={imageSrc} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.1em] font-bold text-gray-900 uppercase">{item.name || 'Unnamed Piece'}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] tracking-widest text-gray-500 uppercase">
                    {(item.selectedSize || item.size) && <span>Size: {item.selectedSize || item.size}</span>}
                    {(item.selectedColor || item.color) && <span>Color: {item.selectedColor || item.color}</span>}
                    <span className="text-gray-400">Qty: {item.quantity}</span>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-gray-900 tracking-tight">₹{item.sale || item.price || 0}</p>
            </div>
        </li>
    );
};

const getStatusStyles = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s.includes('delivered') || s.includes('completed')) return "text-green-600";
    if (s.includes('processing')) return "text-amber-500";
    if (s.includes('shipped')) return "text-blue-500";
    if (s.includes('cancelled')) return "text-red-400";
    return "text-orange-400";
};

// --- Updated OrderCard with Cancel Action ---
const OrderCard = ({ order, onCancel }) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const status = order.orderStatus || order.status || 'Pending';
    
    // Only allow cancellation if status is 'Pending' or 'Processing'
    const canCancel = ['pending', 'processing'].includes(status.toLowerCase());

    const handleCancelClick = async () => {
        if (window.confirm("ARE YOU SURE YOU WANT TO CANCEL THIS ORDER?")) {
            setIsCancelling(true);
            await onCancel(order.orderId);
            setIsCancelling(false);

        }
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        const date = dateInput.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
        return date.toLocaleDateString("en-IN", {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase();
    };

    return (
        <div className="bg-white border border-gray-100 rounded-sm mb-12 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            <div className="px-6 py-6 bg-[#fafafa] border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-[9px] tracking-[0.3em] font-bold text-gray-400 uppercase">Order Reference</p>
                    <h3 className="text-sm font-bold tracking-tighter text-gray-900 uppercase">
                        #{order.orderId?.substring(order.orderId.length - 12) || 'REF-PENDING'}
                    </h3>
                </div>

                <div className="grid grid-cols-2 md:flex md:items-center gap-8 md:gap-12">
                    <div className="space-y-1">
                        <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">Status</p>
                        <p className={`text-[11px] font-bold tracking-widest uppercase ${getStatusStyles(status)}`}>
                            {status}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">Valuation</p>
                        <p className="text-[11px] font-bold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                    </div>
                    
                    {/* --- Cancellation Button --- */}
                    {canCancel && (
                        <button 
                            onClick={handleCancelClick}
                            disabled={isCancelling}
                            className="flex items-center gap-2 text-[10px] tracking-widest font-bold uppercase text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                            {isCancelling ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={14} />}
                            Cancel Order
                        </button>
                    )}
                    
                </div>
            </div>

            <ul className="divide-y divide-gray-50">
                {order.items?.map((item, index) => (
                    <OrderItem key={index} item={item} />
                ))}
            </ul>
        </div>
    );
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const fetchOrders = async () => {
        if (!currentUser) return;
        setLoading(true);
        const userDocRef = doc(db, "users", currentUser.uid || currentUser.user.uid);
        try {
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const userOrders = userData.orders || [];
                const sortedOrders = userOrders.sort((a, b) => {
                    const dateA = a.orderDate?.seconds ? a.orderDate.seconds * 1000 : a.orderDate;
                    const dateB = b.orderDate?.seconds ? b.orderDate.seconds * 1000 : b.orderDate;
                    return dateB - dateA;
                });
                setOrders(sortedOrders);
            }
        } catch (err) {
            setError("FAILED TO RETRIEVE ORDER ARCHIVE.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [currentUser]);

    // ✅ New: Handle Cancellation logic
    const handleCancelOrder = async (orderId) => {
        try {
            const userDocRef = doc(db, "users", currentUser.uid || currentUser.user.uid);
            const docSnap = await getDoc(userDocRef);
            
            if (docSnap.exists()) {
                const currentOrders = docSnap.data().orders || [];
                // Update the specific order status within the array
                const updatedOrders = currentOrders.map(o => {
                    if (o.orderId === orderId) {
                        return { ...o, orderStatus: 'Cancelled', status: 'Cancelled' };
                    }
                    return o;
                });

                await updateDoc(userDocRef, { orders: updatedOrders });
                
                // Update local state
                setOrders(prev => prev.map(o => 
                    o.orderId === orderId ? { ...o, orderStatus: 'Cancelled', status: 'Cancelled' } : o
                ));
                
                toast.success("ORDER CANCELLED SUCCESSFULLY");
            }
        } catch (err) {
            console.error(err);
            toast.error("COULD NOT CANCEL ORDER");
        }
    };

    // (renderContent logic remains similar, just pass handleCancelOrder to OrderCard)
    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        if (!currentUser) return <div className="text-center py-20">Please Login</div>;
        if (orders.length === 0) return <p className="text-center py-20">No orders found.</p>;

        return (
            <div className="space-y-4">
                {orders.map((order, index) => (
                    <OrderCard key={index} order={order} onCancel={handleCancelOrder} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-20 font-light">
            <ToastContainer position="bottom-center" theme="dark" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <header className="mb-16 text-center">
                    <h2 className="text-[10px] tracking-[0.5em] uppercase font-bold text-gray-400 mb-3 italic">Account History</h2>
                    <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-gray-900 uppercase">Your <span className="font-semibold">Archive</span></h1>
                    <div className="h-[1px] w-12 bg-black mx-auto mt-8"></div>
                </header>
                    <div className=" flex items-center gap-2 text-[10px] tracking-widest font-bold uppercase text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 ">Note : You can only cancel orders that are Pending or Processing.</div>
                <main>{renderContent()}</main>
            </div>
        </div>
    );
};

export default MyOrders;