

// import React, { useState, useEffect } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// // Updated import path to point correctly within src folder
// import { db } from '../firebase/firebaseConfig';
// // Updated import path to point correctly within src folder
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';

// // --- Helper Components ---

// const LoadingSpinner = () => (
//     <div className="text-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//         <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
//     </div>
// );

// const EmptyState = () => (
//     <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
//         <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//             </svg>
//         </div>
//         <h3 className="text-xl font-semibold text-gray-900">No orders yet</h3>
//         <p className="mt-2 text-gray-500 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start shopping to fill this page!</p>
//         <Link to="/" className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
//             Start Shopping
//         </Link>
//     </div>
// );

// const OrderItem = ({ item }) => {
//     // Robust image handling: Prioritize 'imageUrl' as seen in your data structure
//     const imageSrc = item.imageUrl || item.imageUrls?.[0] || item.image || item.img || 'https://via.placeholder.com/150?text=No+Image';

//     return (
//         <li className="p-4 sm:p-6 flex items-start sm:items-center space-x-4 hover:bg-gray-50 transition-colors">
//             <div className="flex-shrink-0 bg-gray-100 rounded-lg w-20 h-20 overflow-hidden border border-gray-200">
//                 <img src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
//             </div>
//             <div className="flex-1 min-w-0 space-y-1">
//                 <p className="text-base font-medium text-gray-900 line-clamp-2">{item.name || 'Unnamed Item'}</p>
//                 <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
//                     {(item.selectedSize || item.size) && (
//                         <span className="flex items-center">
//                             <span className="font-medium mr-1">Size:</span> {item.selectedSize || item.size}
//                         </span>
//                     )}
//                     {(item.selectedColor || item.color) && (
//                         <span className="flex items-center">
//                             <span className="font-medium mr-1">Color:</span> {item.selectedColor || item.color}
//                         </span>
//                     )}
//                 </div>
//             </div>
//             <div className="text-right pl-4">
//                 <p className="text-base font-semibold text-gray-900">₹{(item.sale || item.price || 0)}</p>
//                 {item.mrp && item.mrp > item.sale && (
//                     <p className="text-xs text-gray-400 line-through">₹{item.mrp}</p>
//                 )}
//                 <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
//             </div>
//         </li>
//     );
// };

// const getStatusColor = (status) => {
//     // Normalize status to lowercase for comparison
//     const s = status?.toLowerCase() || 'pending';

//     if (s.includes('shipped')) return "bg-blue-50 text-blue-700 border-blue-200";
//     if (s.includes('processing')) return "bg-yellow-50 text-yellow-700 border-yellow-200";
//     if (s.includes('delivered') || s.includes('completed')) return "bg-green-50 text-green-700 border-green-200";
//     if (s.includes('cancelled')) return "bg-red-50 text-red-700 border-red-200";
//     return "bg-gray-50 text-gray-700 border-gray-200";
// };

// const OrderCard = ({ order }) => {
//     // Handle different status field names (orderStatus vs status)
//     const status = order.orderStatus || order.status || 'Pending';

//     // Format Date
//     const formatDate = (dateInput) => {
//         if (!dateInput) return '';
//         const date = dateInput.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
//         return date.toLocaleDateString("en-IN", {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     return (
//         <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl mb-8 overflow-hidden transition-shadow hover:shadow-md">
//             {/* Order Header */}
//             <div className="px-4 py-4 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                 <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                         <h3 className="text-lg font-bold text-gray-900">
//                             Order <span className="font-mono text-indigo-600">#{order.orderId || 'ID-MISSING'}</span>
//                         </h3>
//                     </div>
//                     <p className="text-sm text-gray-500">
//                         Placed on {formatDate(order.orderDate)}
//                     </p>
//                 </div>

//                 <div className="flex flex-col sm:items-end gap-2">
//                     <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
//                         {status === 'Processing' && (
//                             <span className="relative flex h-2 w-2 mr-2">
//                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
//                                 <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
//                             </span>
//                         )}
//                         {status}
//                     </div>
//                     <div className="text-sm text-gray-600 font-medium">
//                         Total: <span className="text-gray-900 text-lg">₹{order.totalAmount?.toFixed(2)}</span>
//                         <span className="text-xs text-gray-400 ml-1 font-normal">({order.paymentMethod})</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Tracking Info (if available) */}
//             {order.waybill && (
//                 <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center text-sm text-blue-700">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     <span>Tracking ID (Waybill): <strong>{order.waybill}</strong></span>
//                 </div>
//             )}

//             {/* Order Items */}
//             <ul className="divide-y divide-gray-100">
//                 {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
//                     <OrderItem key={index} item={item} />
//                 ))}
//             </ul>
//         </div>
//     );
// };

// // --- Main Component ---
// const MyOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { currentUser } = useAuth();

//     useEffect(() => {
//         if (!currentUser || !db) {
//             // Optional: Redirect to login or just show loading until auth resolves
//             if (currentUser === null) setLoading(false); 
//             return;
//         }

//         const fetchOrders = async () => {
//             setLoading(true);
//             const userDocRef = doc(db, "users", currentUser.user.uid);
//             try {
//                 const docSnap = await getDoc(userDocRef);
//                 if (docSnap.exists()) {
//                     const userData = docSnap.data();
//                     const userOrders = userData.orders || [];

//                     // Sort orders by date descending (newest first)
//                     // Handling both Firestore Timestamp and numeric timestamps
//                     const sortedOrders = userOrders.sort((a, b) => {
//                         const dateA = a.orderDate?.seconds ? a.orderDate.seconds * 1000 : a.orderDate;
//                         const dateB = b.orderDate?.seconds ? b.orderDate.seconds * 1000 : b.orderDate;
//                         return dateB - dateA;
//                     });

//                     setOrders(sortedOrders);
//                 } else {
//                     setOrders([]);
//                 }
//             } catch (err) {
//                 console.error("Error getting user document:", err);
//                 setError("Failed to load your orders. Please check your connection.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [currentUser]);

//     const renderContent = () => {
//         if (loading) return <LoadingSpinner />;

//         if (!currentUser) return (
//              <div className="text-center py-20">
//                 <h3 className="text-lg font-medium text-gray-900">Please Log In</h3>
//                 <p className="mt-1 text-sm text-gray-500">You need to be logged in to view your orders.</p>
//                 <Link to="/login" className="mt-4 inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
//                     Go to Login
//                 </Link>
//             </div>
//         );

//         if (error) return (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
//                 <p className="text-red-800">{error}</p>
//                 <button onClick={() => window.location.reload()} className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
//                     Try Again
//                 </button>
//             </div>
//         );

//         if (orders.length === 0) return <EmptyState />;

//         return (
//             <div className="space-y-6">
//                 {orders.map((order, index) => (
//                     <OrderCard key={index} order={order} />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen py-10 mt-20">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <header className="mb-10 border-b border-gray-200 pb-6">
//                     <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Orders</h1>
//                     <p className="mt-2 text-base text-gray-500">
//                         Check the status of recent orders, manage returns, and discover similar products.
//                     </p>
//                 </header>
//                 <main>
//                     {renderContent()}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default MyOrders;


import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin, CreditCard, ArrowRight } from 'lucide-react';

// --- Helper Components ---

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold italic">Synchronizing Archive...</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-20 bg-white border border-gray-100 rounded-sm animate-in fade-in duration-700">
        <Package size={40} strokeWidth={1} className="mx-auto text-gray-200 mb-6" />
        <h3 className="text-[12px] tracking-[0.4em] uppercase font-bold text-gray-900">Archive Empty</h3>
        <p className="text-[11px] tracking-widest text-gray-400 uppercase mt-2 max-w-xs mx-auto leading-relaxed">
            Your collection history is currently empty.
        </p>
        <Link to="/all" className="mt-10 inline-flex items-center gap-3 text-[10px] tracking-[0.3em] font-bold uppercase text-black border-b border-black pb-1 hover:opacity-50 transition-opacity">
            Discover Pieces <ArrowRight size={12} />
        </Link>
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
                <div className="mt-4 sm:hidden">
                    <p className="text-sm font-semibold text-gray-900 tracking-tight">₹{item.sale || item.price || 0}</p>
                    <Link to={`/product/${item.productId}`} className="text-[9px] tracking-widest text-gray-900 underline uppercase hover:text-black transition-colors block mt-2">
                        View Detail
                    </Link>
                </div>
            </div>
            <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900 tracking-tight">₹{item.sale || item.price || 0}</p>
                <Link to={`/product/${item.productId}`} className="text-[9px] tracking-widest text-gray-900 underline uppercase hover:text-black transition-colors block mt-2">
                    View Detail
                </Link>
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

const OrderCard = ({ order }) => {
    const status = order.orderStatus || order.status || 'Pending';

    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        const date = dateInput.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
        return date.toLocaleDateString("en-IN", {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase();
    };

    return (
        <div className="bg-white border border-gray-100 rounded-sm mb-12 overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            {/* Header */}
            <div className="px-6 py-6 bg-[#fafafa] border-b border-gray-50 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-[9px] tracking-[0.3em] font-bold text-gray-400 uppercase">Order Reference</p>
                    <h3 className="text-sm font-bold tracking-tighter text-gray-900 uppercase">
                        #{order.orderId?.substring(order.orderId.length - 12) || 'REF-PENDING'}
                    </h3>
                </div>

                <div className="grid grid-cols-2 md:flex md:items-center gap-8 md:gap-12">
                    <div className="space-y-1">
                        <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase">Date</p>
                        <p className="text-[11px] font-medium text-gray-900 tracking-tight">{formatDate(order.orderDate)}</p>
                    </div>
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
                </div>
            </div>

            {/* Tracking (Minimalist Alert) */}
            {order.waybill && (
                <div className="px-6 py-3 bg-white border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] tracking-widest text-gray-400 uppercase">
                        <MapPin size={12} strokeWidth={1.5} />
                        <span>Tracking: <span className="text-black font-bold">{order.waybill}</span></span>
                    </div>
                    <button className="text-[9px] font-bold uppercase tracking-widest text-blue-500 hover:underline">Track Manifest</button>
                </div>
            )}

            {/* Items */}
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

    useEffect(() => {
        if (!currentUser || !db) {
            if (currentUser === null) setLoading(false);
            return;
        }

        const fetchOrders = async () => {
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

        fetchOrders();
    }, [currentUser]);

    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        if (!currentUser) return (
            <div className="text-center py-32 border border-dashed border-gray-200">
                <h3 className="text-[12px] tracking-[0.4em] uppercase font-bold text-gray-900">Identity Required</h3>
                <p className="mt-4 text-[11px] tracking-widest text-gray-400 uppercase">Login to view your atelier history.</p>
                <Link to="/login" className="mt-10 inline-block px-10 py-4 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-all">
                    Login
                </Link>
            </div>
        );
        if (error) return <div className="p-6 text-center text-[11px] tracking-widest uppercase text-red-400">{error}</div>;
        if (orders.length === 0) return <EmptyState />;

        return (
            <div className="space-y-4">
                {orders.map((order, index) => (
                    <OrderCard key={index} order={order} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen pt-32 pb-20 font-light">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <header className="mb-16 text-center">
                    <h2 className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-bold mb-3 italic">Account History</h2>
                    <h1 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-gray-900 uppercase">Your <span className="font-semibold">Archive</span></h1>
                    <div className="h-[1px] w-12 bg-black mx-auto mt-8"></div>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default MyOrders;