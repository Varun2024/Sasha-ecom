// import React, { useState, useEffect } from 'react';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';
// import { useAuth } from '../context/AuthContext';
// // --- Helper Components ---

// const LoadingSpinner = () => (
//     <div className="text-center py-10">
//         <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//         </svg>
//         <p className="mt-4 text-gray-600">Loading your orders...</p>
//     </div>
// );

// const EmptyState = () => (
//     <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
//         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//         </svg>
//         <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
//         <p className="mt-1 text-sm text-gray-500">You haven't placed any orders. When you do, they'll show up here.</p>
//     </div>
// );

// const OrderItem = ({ item }) => (
//     <li className="px-4 py-4 sm:px-6 flex items-center space-x-4">
//         <div className="flex-shrink-0 bg-gray-200 rounded-md w-16 h-16 flex items-center justify-center">
//             <img src={item.imageUrls || item.imageUrls[0]} alt={item.name} className="w-full h-full object-cover rounded-md" />
//             <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622 3.385m-5.043-.025a15.998 15.998 0 01-3.388 1.621m7.424 0a4.5 4.5 0 00-8.4-2.245 2.25 2.25 0 01-2.4-2.245 3 3 0 005.78-1.128 15.998 15.998 0 005.043 3.405z" />
//             </svg>
//         </div>
//         <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-900 truncate">{item.name || 'Unnamed Item'}</p>
//             {item.size && <p className="text-sm text-gray-500 truncate">Size: {item.size}</p>}
//         </div>
//         <div className="text-right">
//             <p className="text-sm font-medium text-gray-900">₹{item.sale || '0.00'}</p>
//             <p className="text-sm text-gray-500">MRP: ₹{item.mrp || '0.00'}</p>
//             {item.quantity && <p className="text-sm text-gray-500">Qty: {item.quantity}</p>}
//         </div>

//     </li>
// );
// const getStatusColor = (status) => {
//     switch (status) {
//         case "Shipped": return "bg-blue-100 text-blue-800";
//         case "Processing": return "bg-yellow-100 text-yellow-800";
//         case "Delivered": return "bg-green-100 text-green-800";
//         case "Pending": return "bg-orange-100 text-orange-800";
//         case "Completed": return "bg-green-100 text-green-800"; // Added for default
//         default: return "bg-gray-100 text-gray-800";
//     }
// };
// const OrderCard = ({ order, orderNumber }) => (
//     <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl mb-6">
//         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//             <div className="flex flex-wrap items-center justify-between gap-y-2">
//                 <div>
//                     <h3 className="text-lg font-semibold leading-6 text-gray-900">Order #{orderNumber}</h3>
//                     <p className="mt-1 max-w-2xl text-sm text-gray-500">Order details and items.</p>
//                 </div>
//                 <div>
//                     <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset  ${getStatusColor(order.status)}`}>
//                         <div className={`w-2 h-2 rounded-full relative z-10 mr-1 bg-black animate-pulse transition-all duration-200`} /> {order.status}
//                     </span>
//                 </div>
//             </div>
//         </div>
//         <ul className="divide-y divide-gray-200">
//             {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
//                 <OrderItem key={index} item={item} />
//             ))}
//         </ul>
//     </div>
// );


// // --- Main Component ---
// const MyOrders = () => {
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const { currentUser } = useAuth();

//     useEffect(() => {
//         // Don't fetch if db or userId are not available yet.
//         if (!currentUser || !db) {
//             setLoading(false);
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
//                     if (Array.isArray(userOrders) && userOrders.length > 0) {
//                         setOrders(userOrders);
//                     } else {
//                         setOrders([]);
//                     }
//                 } else {
//                     console.log("No such user document! The user may not have placed any orders yet.");
//                     setOrders([]);
//                 }
//             } catch (err) {
//                 console.error("Error getting user document:", err);
//                 setError("Failed to fetch orders. Please try again later.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [currentUser]); // Re-run effect if userId or db instance changes.

//     const renderContent = () => {
//         if (loading) {
//             return <LoadingSpinner />;
//         }
//         if (error) {
//             return <p className="text-red-500 text-center">{error}</p>;
//         }
//         if (orders.length === 0) {
//             return <EmptyState />;
//         }
//         return (
//             <div>
//                 {orders.slice().reverse().map((order, index) => (
//                     <OrderCard key={index} order={order} orderNumber={orders.length - index} />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gray-50 min-h-screen">
//             <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
//                 <header className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
//                     <p className="mt-2 text-sm text-gray-500">View your past orders and their details below.</p>
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
// Updated import path to point correctly within src folder
import { db } from '../firebase/firebaseConfig';
// Updated import path to point correctly within src folder
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// --- Helper Components ---

const LoadingSpinner = () => (
    <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">No orders yet</h3>
        <p className="mt-2 text-gray-500 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start shopping to fill this page!</p>
        <Link to="/" className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Start Shopping
        </Link>
    </div>
);

const OrderItem = ({ item }) => {
    // Robust image handling: Prioritize 'imageUrl' as seen in your data structure
    const imageSrc = item.imageUrl || item.imageUrls?.[0] || item.image || item.img || 'https://via.placeholder.com/150?text=No+Image';

    return (
        <li className="p-4 sm:p-6 flex items-start sm:items-center space-x-4 hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 bg-gray-100 rounded-lg w-20 h-20 overflow-hidden border border-gray-200">
                <img src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
                <p className="text-base font-medium text-gray-900 line-clamp-2">{item.name || 'Unnamed Item'}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {(item.selectedSize || item.size) && (
                        <span className="flex items-center">
                            <span className="font-medium mr-1">Size:</span> {item.selectedSize || item.size}
                        </span>
                    )}
                    {(item.selectedColor || item.color) && (
                        <span className="flex items-center">
                            <span className="font-medium mr-1">Color:</span> {item.selectedColor || item.color}
                        </span>
                    )}
                </div>
            </div>
            <div className="text-right pl-4">
                <p className="text-base font-semibold text-gray-900">₹{(item.sale || item.price || 0)}</p>
                {item.mrp && item.mrp > item.sale && (
                    <p className="text-xs text-gray-400 line-through">₹{item.mrp}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
            </div>
        </li>
    );
};

const getStatusColor = (status) => {
    // Normalize status to lowercase for comparison
    const s = status?.toLowerCase() || 'pending';
    
    if (s.includes('shipped')) return "bg-blue-50 text-blue-700 border-blue-200";
    if (s.includes('processing')) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (s.includes('delivered') || s.includes('completed')) return "bg-green-50 text-green-700 border-green-200";
    if (s.includes('cancelled')) return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
};

const OrderCard = ({ order }) => {
    // Handle different status field names (orderStatus vs status)
    const status = order.orderStatus || order.status || 'Pending';
    
    // Format Date
    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        const date = dateInput.seconds ? new Date(dateInput.seconds * 1000) : new Date(dateInput);
        return date.toLocaleDateString("en-IN", {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl mb-8 overflow-hidden transition-shadow hover:shadow-md">
            {/* Order Header */}
            <div className="px-4 py-4 sm:px-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                            Order <span className="font-mono text-indigo-600">#{order.orderId || 'ID-MISSING'}</span>
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.orderDate)}
                    </p>
                </div>
                
                <div className="flex flex-col sm:items-end gap-2">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                        {status === 'Processing' && (
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                        )}
                        {status}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                        Total: <span className="text-gray-900 text-lg">₹{order.totalAmount?.toFixed(2)}</span>
                        <span className="text-xs text-gray-400 ml-1 font-normal">({order.paymentMethod})</span>
                    </div>
                </div>
            </div>

            {/* Tracking Info (if available) */}
            {order.waybill && (
                <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center text-sm text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Tracking ID (Waybill): <strong>{order.waybill}</strong></span>
                </div>
            )}

            {/* Order Items */}
            <ul className="divide-y divide-gray-100">
                {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                    <OrderItem key={index} item={item} />
                ))}
            </ul>
        </div>
    );
};

// --- Main Component ---
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser || !db) {
            // Optional: Redirect to login or just show loading until auth resolves
            if (currentUser === null) setLoading(false); 
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            const userDocRef = doc(db, "users", currentUser.user.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const userOrders = userData.orders || [];
                    
                    // Sort orders by date descending (newest first)
                    // Handling both Firestore Timestamp and numeric timestamps
                    const sortedOrders = userOrders.sort((a, b) => {
                        const dateA = a.orderDate?.seconds ? a.orderDate.seconds * 1000 : a.orderDate;
                        const dateB = b.orderDate?.seconds ? b.orderDate.seconds * 1000 : b.orderDate;
                        return dateB - dateA;
                    });

                    setOrders(sortedOrders);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                console.error("Error getting user document:", err);
                setError("Failed to load your orders. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]);

    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        
        if (!currentUser) return (
             <div className="text-center py-20">
                <h3 className="text-lg font-medium text-gray-900">Please Log In</h3>
                <p className="mt-1 text-sm text-gray-500">You need to be logged in to view your orders.</p>
                <Link to="/login" className="mt-4 inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    Go to Login
                </Link>
            </div>
        );

        if (error) return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                    Try Again
                </button>
            </div>
        );

        if (orders.length === 0) return <EmptyState />;

        return (
            <div className="space-y-6">
                {orders.map((order, index) => (
                    <OrderCard key={index} order={order} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10 mt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-10 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Orders</h1>
                    <p className="mt-2 text-base text-gray-500">
                        Check the status of recent orders, manage returns, and discover similar products.
                    </p>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default MyOrders;