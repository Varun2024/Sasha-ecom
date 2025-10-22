// /* eslint-disable no-unused-vars */


// import React, { useState, useEffect, Fragment } from 'react';
// import { collection, doc, getDocs, updateDoc, } from 'firebase/firestore';
// import { MoreVertical, ChevronDown } from 'lucide-react';
// import { db } from '../firebase/firebaseConfig';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // --- Helper Components & Functions ---

// const LoadingSpinner = () => (
//     <div className="text-center py-20">
//         <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//         </svg>
//         <p className="mt-4 text-gray-600 font-medium">Loading all orders...</p>
//     </div>
// );

// const EmptyState = () => (
//     <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
//         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
//         </svg>
//         <h3 className="mt-5 text-xl font-semibold text-gray-900">No orders found</h3>
//         <p className="mt-2 text-base text-gray-500">There are no orders across any users yet.</p>
//     </div>
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
// const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];




// const OrderRow = ({ order, onStatusUpdate }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     // State to manage the new status selection for the dropdown
//     const [newStatus, setNewStatus] = useState(order.status);
//     const [isSaving, setIsSaving] = useState(false);

//     const handleSave = async () => {
//         setIsSaving(true);
//         await onStatusUpdate(order, newStatus);
//         setIsSaving(false);
//     };

//     return (
//         <Fragment>
//             <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
//                 {/* This part of the row is mostly unchanged */}
//                 <td><img src={order.items[0]?.featuredImageUrl || order.items[0]?.imageUrls?.[0]} alt={order.id} className="w-16 h-16 object-cover rounded-md" /></td>
//                 <td className="p-4 text-sm text-gray-800 font-medium">{order.id.split('-')[1]}</td>
//                 <td className="p-4 text-sm text-gray-600">{order.customer}</td>
//                 <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
//                 <td className="p-4 text-sm text-gray-800 font-medium">₹{order.total.toFixed(2)}</td>
//                 <td className="p-4 text-sm">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
//                         {order.status}
//                     </span>
//                 </td>
//                 <td className="p-4 text-sm text-gray-600 text-center">
//                     <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
//                 </td>
//             </tr>
//             {isExpanded && (
//                 <tr className="bg-gray-50 border-b">
//                     <td colSpan="7" className="p-4">
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {/* Shipping Address */}
//                             <div>
//                                 <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
//                                 {order.address ? (
//                                     <div className="text-sm text-gray-600 space-y-1">
//                                         <p>{order.address.fullName}</p>
//                                         <p>{order.address.address}</p>
//                                         <p>{order.address.city}, {order.address.state},Pincode: {order.address.zip}</p>
//                                         <p>Phone: {order.address.phone}</p>
//                                         <p></p>
//                                     </div>
//                                 ) : <p className="text-sm text-gray-500">No address provided.</p>}
//                             </div>
//                             {/* Order Items */}
//                             <div className='md:col-span-2'>
//                                 <h4 className="font-semibold text-gray-800 mb-2">Order Items ({order.items.length})</h4>
//                                 <ul className="space-y-2 flex flex-row gap-4">
//                                     {order.items.map((item, index) => (
//                                         <li key={index} className="flex justify-between items-center gap-10 text-sm">
//                                             <div className="flex flex-col gap-1">
//                                                 <span className="text-gray-800">{item.name || 'Unnamed Item'}</span>
//                                                 <span className=" text-gray-800">Color : {item.selectedColor}</span>
//                                                 <span className=" text-gray-800">Size: {item.selectedSize}</span>
//                                                 <span className="font-medium text-gray-800">₹{item.sale || '0.00'}</span>
//                                             </div>
//                                             <span><img src={item.imageUrls && item.imageUrls[0]} alt={item.id} className="w-40 h-32 object-cover rounded-md" /></span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* ✅ ADDED: Status Update Section */}
//                         <div className="mt-4 pt-4 border-t flex items-center gap-4">
//                             <h4 className="font-semibold text-gray-800">Update Status:</h4>
//                             <div className="relative">
//                                 <select
//                                     value={newStatus}
//                                     onChange={(e) => setNewStatus(e.target.value)}
//                                     onClick={(e) => e.stopPropagation()} // Prevent row from collapsing when clicking dropdown
//                                     className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                 >
//                                     {statuses.map(status => (
//                                         <option key={status} value={status}>{status}</option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//                             </div>
//                             <button
//                                 onClick={(e) => {
//                                     e.stopPropagation(); // Prevent row collapse
//                                     handleSave();
//                                 }}
//                                 disabled={isSaving || newStatus === order.status}
//                                 className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
//                             >
//                                 {isSaving ? 'Saving...' : 'Save Status'}
//                             </button>
//                         </div>
//                     </td>
//                 </tr>
//             )}
//         </Fragment>
//     );
// };


// // --- Main Component ---
// const AllOrders = () => {
//     const [allOrders, setAllOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filter, setFilter] = useState('All');

//     useEffect(() => {
//         if (!db) {
//             setLoading(false);
//             setError("Firestore database instance is not available.");
//             return;
//         }

//         const fetchAllOrders = async () => {
//             setLoading(true);
//             try {
//                 const usersCollectionRef = collection(db, "users");
//                 const querySnapshot = await getDocs(usersCollectionRef);

//                 const ordersWithUserInfo = [];

//                 querySnapshot.forEach((userDoc) => {
//                     const userData = userDoc.data();
//                     // console.log("User Data:", userData); // Debugging line
//                     if (userData.orders && Array.isArray(userData.orders)) {
//                         userData.orders.forEach((order, index) => {
//                             const total = order.items.reduce((sum, item) => sum + (parseFloat(item.sale) || 0), 0);
//                             const shippingAddress = userData.addresses && userData.addresses.length > 0 ? userData.addresses[0] : null;

//                             ordersWithUserInfo.push({
//                                 ...order,
//                                 id: `${userDoc.id}-ORD${String(index + 1).padStart(3, '0')}`,
//                                 customer: userData.firstName || 'N/A',
//                                 date: userData.createdAt?.toDate().toLocaleDateString() || 'N/A',
//                                 total: total,
//                                 status: order.status || 'Completed',
//                                 address: shippingAddress,
//                                 items: order.items || [],
//                                 firestoreDate: userData.createdAt?.toDate() || new Date(0)
//                             });
//                         });
//                     }
//                 });

//                 ordersWithUserInfo.sort((a, b) => b.firestoreDate - a.firestoreDate);
//                 setAllOrders(ordersWithUserInfo);

//             } catch (err) {
//                 console.error("Error fetching all orders:", err);
//                 setError("Failed to fetch orders from the database.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAllOrders();
//     }, []);

//     // const statuses = ['All', 'Shipped', 'Processing', 'Pending', 'Delivered', 'Completed'];
//     const filteredOrders = filter === 'All' ? allOrders : allOrders.filter(o => o.status === filter);

//     // ✅ ADDED: Function to handle the status update in Firestore
//     const handleStatusUpdate = async (orderToUpdate, newStatus) => {
//         try {
//             const userRef = doc(db, "users", orderToUpdate.userId);
//             const userSnap = await getDocs(collection(db, "users"));

//             // Find the user document
//             let targetUserDoc;
//             for (const doc of userSnap.docs) {
//                 if (doc.id === orderToUpdate.userId) {
//                     targetUserDoc = doc;
//                     break;
//                 }
//             }

//             if (targetUserDoc) {
//                 const userData = targetUserDoc.data();
//                 const ordersArray = userData.orders || [];

//                 // Find and update the specific order in the array
//                 const orderIndex = ordersArray.findIndex(o => o.id === orderToUpdate.originalOrderId);
//                 if (orderIndex > -1) {
//                     ordersArray[orderIndex].status = newStatus;

//                     // Update the entire orders array in the user document
//                     await updateDoc(userRef, { orders: ordersArray });

//                     // Update local state to reflect the change immediately
//                     setAllOrders(prevOrders =>
//                         prevOrders.map(o =>
//                             o.compositeId === orderToUpdate.compositeId ? { ...o, status: newStatus } : o
//                         )
//                     );
//                     toast.success(`Order status updated to "${newStatus}"`);
//                 }
//             } else {
//                 throw new Error("User not found for this order.");
//             }
//         } catch (error) {
//             console.error("Error updating status:", error);
//             toast.error("Failed to update status.");
//         }
//     };


//     const renderContent = () => {
//         if (loading) return <LoadingSpinner />;
//         if (error) return <p className="text-red-500 text-center">{error}</p>;
//         if (allOrders.length === 0) return <EmptyState />;

//         return (
//             <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
//                 {/* ... filter buttons JSX is unchanged ... */}
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left">
//                         <thead>
//                             <tr className="border-b bg-gray-50">
//                                 <th className='p-4'>Image</th>
//                                 <th className="p-4">Order ID</th>
//                                 <th className="p-4">Customer</th>
//                                 <th className="p-4">Date</th>
//                                 <th className="p-4">Total</th>
//                                 <th className="p-4">Status</th>
//                                 <th className="p-4 text-center">Details</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredOrders.length > 0 ? (
//                                 filteredOrders.map((order) =>
//                                     <OrderRow
//                                         key={order.compositeId}
//                                         order={order}
//                                         onStatusUpdate={handleStatusUpdate} // Pass handler down
//                                     />)
//                             ) : (
//                                 <tr><td colSpan="7" className="text-center py-10">No orders for "{filter}".</td></tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="bg-gray-100 min-h-screen">
//             <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={true} theme='dark' />
//             <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//                 <header className="mb-8">
//                     <h1 className="text-4xl font-bold">Customer Orders</h1>
//                     <p className="mt-2 text-lg text-gray-600">View and manage all orders.</p>
//                 </header>
//                 <main>{renderContent()}</main>
//             </div>
//         </div>
//     );
// };

// export default AllOrders;

/* eslint-disable no-unused-vars */


import React, { useState, useEffect, Fragment } from 'react';
// ✅ CHANGED: Imported getDoc in addition to getDocs
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { MoreVertical, ChevronDown } from 'lucide-react';
import { db } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Helper Components (No Changes Here) ---

const LoadingSpinner = () => (
    <div className="text-center py-20">
        <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600 font-medium">Loading all orders...</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="mt-5 text-xl font-semibold text-gray-900">No orders found</h3>
        <p className="mt-2 text-base text-gray-500">There are no orders across any users yet.</p>
    </div>
);

const getStatusColor = (status) => {
    switch (status) {
        case "Shipped": return "bg-blue-100 text-blue-800";
        case "Processing": return "bg-yellow-100 text-yellow-800";
        case "Delivered": return "bg-green-100 text-green-800";
        case "Pending": return "bg-orange-100 text-orange-800";
        case "Completed": return "bg-green-100 text-green-800";
        case "Cancelled": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
};
const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];


const OrderRow = ({ order, onStatusUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newStatus, setNewStatus] = useState(order.status);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onStatusUpdate(order, newStatus);
        setIsSaving(false);
    };

    return (
        <Fragment>
            <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <td><img src={order.items[0]?.featuredImageUrl || order.items[0]?.imageUrls?.[0]} alt={order.id} className="w-16 h-16 object-cover rounded-md" /></td>
                {/* ✅ CHANGED: Display the actual order ID, truncated for neatness */}
                <td className="p-4 text-sm text-gray-800 font-medium" title={order.id}>
                    {order.id.substring(0, 8)}...
                </td>
                <td className="p-4 text-sm text-gray-600">{order.customer}</td>
                <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
                <td className="p-4 text-sm text-gray-800 font-medium">₹{order.total.toFixed(2)}</td>
                <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                </td>
                <td className="p-4 text-sm text-gray-600 text-center">
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-gray-50 border-b">
                    <td colSpan="7" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Shipping Address */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                                {order.address ? (
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>{order.address.fullName}</p>
                                        <p>{order.address.address}</p>
                                        <p>{order.address.city}, {order.address.state},Pincode: {order.address.zip}</p>
                                        <p>Phone: {order.address.phone}</p>
                                        <p></p>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No address provided.</p>}
                            </div>
                            {/* Order Items */}
                            <div className='md:col-span-2'>
                                <h4 className="font-semibold text-gray-800 mb-2">Order Items ({order.items.length})</h4>
                                <ul className="space-y-2 flex flex-row gap-4">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center gap-10 text-sm">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-gray-800">{item.name || 'Unnamed Item'}</span>
                                                <span className=" text-gray-800">Color : {item.selectedColor}</span>
                                                <span className=" text-gray-800">Size: {item.selectedSize}</span>
                                                <span className="font-medium text-gray-800">₹{item.sale || '0.00'}</span>
                                            </div>
                                            <span><img src={item.imageUrls && item.imageUrls[0]} alt={item.id} className="w-40 h-32 object-cover rounded-md" /></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Status Update Section */}
                        <div className="mt-4 pt-4 border-t flex items-center gap-4">
                            <h4 className="font-semibold text-gray-800">Update Status:</h4>
                            <div className="relative">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {statuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                }}
                                disabled={isSaving || newStatus === order.status}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Save Status'}
                            </button>
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    );
};

// --- Main Component ---
const AllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        if (!db) {
            setLoading(false);
            setError("Firestore database instance is not available.");
            return;
        }

        const fetchAllOrders = async () => {
            setLoading(true);
            try {
                const usersCollectionRef = collection(db, "users");
                const querySnapshot = await getDocs(usersCollectionRef);

                const ordersWithUserInfo = [];
                // ➕ ADDED: A Set to track processed order IDs to prevent duplicates
                const processedOrderIds = new Set();

                // Using for...of loop to handle async operations inside correctly
                for (const userDoc of querySnapshot.docs) {
                    const userData = userDoc.data();
                    if (userData.orders && Array.isArray(userData.orders)) {
                        userData.orders.forEach((order) => {
                            // ✅ CHANGED: Use the actual order.id as the unique identifier
                            const originalOrderId = order.orderId;

                            // If we haven't processed this order ID yet, add it
                            if (originalOrderId && !processedOrderIds.has(originalOrderId)) {
                                const total = order.items.reduce((sum, item) => sum + (parseFloat(item.sale) || 0), 0);
                                const shippingAddress = userData.addresses && userData.addresses.length > 0 ? userData.addresses[0] : null;

                                ordersWithUserInfo.push({
                                    ...order,
                                    // ✅ CHANGED: id is now the original transaction ID
                                    id: originalOrderId,
                                    // ➕ ADDED: A unique ID for React's key prop
                                    compositeId: `${userDoc.id}-${originalOrderId}`,
                                    // ➕ ADDED: The user's ID to make updates easier
                                    userId: userDoc.id,
                                    customer: userData.firstName || 'N/A',
                                    date: order.date?.toDate().toLocaleDateString() || 'N/A',
                                    total: total,
                                    status: order.status || 'Completed',
                                    address: shippingAddress,
                                    items: order.items || [],
                                    firestoreDate: order.date?.toDate() || new Date(0)
                                });
                                // ➕ ADDED: Mark this ID as processed
                                processedOrderIds.add(originalOrderId);
                            }
                        });
                    }
                }

                ordersWithUserInfo.sort((a, b) => b.firestoreDate - a.firestoreDate);
                setAllOrders(ordersWithUserInfo);

            } catch (err) {
                console.error("Error fetching all orders:", err);
                setError("Failed to fetch orders from the database.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, []);

    const filteredOrders = filter === 'All' ? allOrders : allOrders.filter(o => o.status === filter);

    // ✅ REVISED: Status update logic is now more robust
    // const handleStatusUpdate = async (orderToUpdate, newStatus) => {
    //     try {
    //         // Directly reference the user document using the saved userId
    //         const userRef = doc(db, "users", orderToUpdate.userId);
    //         const userSnap = await getDoc(userRef);

    //         if (userSnap.exists()) {
    //             const userData = userSnap.data();
    //             const ordersArray = userData.orders || [];

    //             // Find the specific order in the array by its original ID
    //             const orderIndex = ordersArray.findIndex(o => o.id === orderToUpdate.id);

    //             if (orderIndex > -1) {
    //                 ordersArray[orderIndex].status = newStatus;

    //                 // Update the entire orders array in the user document
    //                 await updateDoc(userRef, { orders: ordersArray });

    //                 // Update local state to reflect the change immediately
    //                 setAllOrders(prevOrders =>
    //                     prevOrders.map(o =>
    //                         o.compositeId === orderToUpdate.compositeId ? { ...o, status: newStatus } : o
    //                     )
    //                 );
    //                 toast.success(`Order status updated to "${newStatus}"`);
    //             } else {
    //                 throw new Error("Order not found in user's order list.");
    //             }
    //         } else {
    //             throw new Error("User not found for this order.");
    //         }
    //     } catch (error) {
    //         console.error("Error updating status:", error);
    //         toast.error("Failed to update status.");
    //     }
    // };

        const handleStatusUpdate = async (orderToUpdate, newStatus) => {
        try {
            const userRef = doc(db, "users", orderToUpdate.userId);
            const userSnap = await getDocs(collection(db, "users"));

            // Find the user document
            let targetUserDoc;
            for (const doc of userSnap.docs) {
                if (doc.id === orderToUpdate.userId) {
                    targetUserDoc = doc;
                    break;
                }
            }

            if (targetUserDoc) {
                const userData = targetUserDoc.data();
                const ordersArray = userData.orders || [];

                // Find and update the specific order in the array
                const orderIndex = ordersArray.findIndex(o => o.id === orderToUpdate.originalOrderId);
                if (orderIndex > -1) {
                    ordersArray[orderIndex].status = newStatus;

                    // Update the entire orders array in the user document
                    await updateDoc(userRef, { orders: ordersArray });

                    // Update local state to reflect the change immediately
                    setAllOrders(prevOrders =>
                        prevOrders.map(o =>
                            o.compositeId === orderToUpdate.compositeId ? { ...o, status: newStatus } : o
                        )
                    );
                    toast.success(`Order status updated to "${newStatus}"`);
                }
            } else {
                throw new Error("User not found for this order.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status.");
        }
    };

    // --- Render logic (no major changes) ---
    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        if (error) return <p className="text-red-500 text-center">{error}</p>;
        if (allOrders.length === 0) return <EmptyState />;

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                 <div className="flex items-center gap-2 flex-wrap">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${filter === status
                                ? 'bg-indigo-600 text-white shadow'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className='p-4'>Image</th>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) =>
                                    <OrderRow
                                        // ✅ CHANGED: Use the new unique compositeId for the key
                                        key={order.compositeId}
                                        order={order}
                                        onStatusUpdate={handleStatusUpdate}
                                    />)
                            ) : (
                                <tr><td colSpan="7" className="text-center py-10">No orders for "{filter}".</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={true} theme='dark' />
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold">Customer Orders</h1>
                    <p className="mt-2 text-lg text-gray-600">View and manage all orders.</p>
                </header>
                <main>{renderContent()}</main>
            </div>
        </div>
    );
};

export default AllOrders;