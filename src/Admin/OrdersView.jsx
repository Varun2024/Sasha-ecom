// import { MoreVertical } from "lucide-react";
// import { useState } from "react";



// const allOrdersData = [
//     { id: "ORD001", customer: "John Doe", date: "2024-08-10", total: "$150.00", status: "Shipped" },
//     { id: "ORD002", customer: "Jane Smith", date: "2024-08-10", total: "$75.50", status: "Processing" },
//     { id: "ORD003", customer: "Mike Johnson", date: "2024-08-09", total: "$220.00", status: "Shipped" },
//     { id: "ORD004", customer: "Emily Brown", date: "2024-08-09", total: "$45.99", status: "Delivered" },
//     { id: "ORD005", customer: "Chris Lee", date: "2024-08-08", total: "$300.10", status: "Pending" },
//     { id: "ORD006", customer: "Sarah Wilson", date: "2024-08-08", total: "$99.00", status: "Shipped" },
//     { id: "ORD007", customer: "David Martinez", date: "2024-08-07", total: "$12.50", status: "Delivered" },
//     { id: "ORD008", customer: "Laura Garcia", date: "2024-08-07", total: "$84.25", status: "Processing" },
// ];

// const getStatusColor = (status) => {
//     switch (status) {
//         case "Shipped": return "bg-blue-100 text-blue-800";
//         case "Processing": return "bg-yellow-100 text-yellow-800";
//         case "Delivered": return "bg-green-100 text-green-800";
//         case "Pending": return "bg-orange-100 text-orange-800";
//         default: return "bg-gray-100 text-gray-800";
//     }
// };


// const OrdersView = () => {
//     const [filter, setFilter] = useState('All');
//     const filteredOrders = filter === 'All' ? allOrdersData : allOrdersData.filter(o => o.status === filter);
//     const statuses = ['All', 'Shipped', 'Processing', 'Pending', 'Delivered'];

//     return (
//         <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <h3 className="text-xl font-semibold text-gray-800">All Orders</h3>
//                 <div className="flex items-center gap-2 overflow-x-auto pb-2">
//                     {statuses.map(status => (
//                         <button 
//                             key={status}
//                             onClick={() => setFilter(status)}
//                             className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
//                         >
//                             {status}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left">
//                     <thead>
//                         <tr className="border-b bg-gray-50">
//                             <th className="p-4 text-sm font-semibold text-gray-600">Order ID</th>
//                             <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
//                             <th className="p-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Date</th>
//                             <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
//                             <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
//                             <th className="p-4 text-sm font-semibold text-gray-600"></th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredOrders.map((order) => (
//                             <tr key={order.id} className="border-b hover:bg-gray-50">
//                                 <td className="p-4 text-sm text-gray-800 font-medium">{order.id}</td>
//                                 <td className="p-4 text-sm text-gray-600">{order.customer}</td>
//                                 <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
//                                 <td className="p-4 text-sm text-gray-800 font-medium">{order.total}</td>
//                                 <td className="p-4 text-sm">
//                                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
//                                         {order.status}
//                                     </span>
//                                 </td>
//                                 <td className="p-4 text-sm text-gray-600">
//                                     <button className="hover:text-gray-900"><MoreVertical size={20} /></button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default OrdersView;


import React, { useState, useEffect, Fragment } from 'react';
import { collection, getDocs,  } from 'firebase/firestore';
import { MoreVertical, ChevronDown } from 'lucide-react';
import { db } from '../firebase/firebaseConfig';
// --- Helper Components & Functions ---

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
        case "Completed": return "bg-green-100 text-green-800"; // Added for default
        default: return "bg-gray-100 text-gray-800";
    }
};

const OrderRow = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <Fragment>
            <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <td className="p-4 text-sm text-gray-800 font-medium">{order.id.split('-')[1]}</td>
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
                <tr className="bg-gray-50">
                    <td colSpan="6" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
                                {order.address ? (
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>{order.address.fullName}</p>
                                        <p>{order.address.addressLine}</p>
                                        <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                                        <p>Phone: {order.address.phone}</p>
                                    </div>
                                ) : <p className="text-sm text-gray-500">No address provided.</p>}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Order Items ({order.items.length})</h4>
                                <ul className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">{item.name || 'Unnamed Item'}</span>
                                            <span className="font-medium text-gray-800">₹{item.mrp || '0.00'}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                
                querySnapshot.forEach((userDoc) => {
                    const userData = userDoc.data();
                    if (userData.orders && Array.isArray(userData.orders)) {
                        userData.orders.forEach((order, index) => {
                             const total = order.items.reduce((sum, item) => sum + (parseFloat(item.mrp) || 0), 0);
                             const shippingAddress = userData.addresses && userData.addresses.length > 0 ? userData.addresses[0] : null;

                            ordersWithUserInfo.push({
                                ...order,
                                id: `${userDoc.id}-ORD${String(index + 1).padStart(3, '0')}`,
                                customer: userData.firstName || 'N/A',
                                date: userData.createdAt?.toDate().toLocaleDateString() || 'N/A',
                                total: total,
                                status: order.status || 'Completed',
                                address: shippingAddress,
                                items: order.items || [],
                                firestoreDate: userData.createdAt?.toDate() || new Date(0)
                            });
                        });
                    }
                });
                
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
    }, [db]);
    
    const statuses = ['All', 'Shipped', 'Processing', 'Pending', 'Delivered', 'Completed'];
    const filteredOrders = filter === 'All' ? allOrders : allOrders.filter(o => o.status === filter);


    const renderContent = () => {
        if (loading) return <LoadingSpinner />;
        if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
        if (allOrders.length === 0) return <EmptyState />;

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">All Orders ({allOrders.length})</h3>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {statuses.map(status => (
                            <button 
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${filter === status ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-4 text-sm font-semibold text-gray-600">Order ID</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => <OrderRow key={order.id} order={order} />)
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">No orders match the filter "{filter}".</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                 <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Customer Orders Dashboard</h1>
                    <p className="mt-2 text-lg text-gray-600">A comprehensive list of all orders placed by users.</p>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AllOrders;

