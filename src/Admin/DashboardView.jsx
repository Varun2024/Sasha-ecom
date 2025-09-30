import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
// --- Helper Components & Functions ---

const LoadingSpinner = () => (
    <div className="text-center py-20">
        <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
    </div>
);

const getStatusColor = (status) => {
    switch (status) {
        case "Shipped": return "bg-blue-100 text-blue-800";
        case "Processing": return "bg-yellow-100 text-yellow-800";
        case "Delivered": return "bg-green-100 text-green-800";
        case "Pending": return "bg-orange-100 text-orange-800";
        case "Completed": return "bg-green-100 text-green-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

const SummaryCard = ({ title, value, change, changeType }) => (
     <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 ">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        {change && (
            <p className={`mt-1 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {change} vs last month
            </p>
        )}
    </div>
);

// --- Main Component ---
const DashboardView = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            setError("Firestore database instance is not available.");
            return;
        }

        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const usersCollectionRef = collection(db, "users");
                const querySnapshot = await getDocs(usersCollectionRef);
                
                const allOrders = [];
                const totalCustomers = querySnapshot.size;

                querySnapshot.forEach((userDoc) => {
                    const userData = userDoc.data();
                    if (userData.orders && Array.isArray(userData.orders)) {
                        userData.orders.forEach((order, index) => {
                             const total = order.items.reduce((sum, item) => sum + (parseFloat(item.sale) || 0), 0);
                            allOrders.push({
                                ...order,
                                id: `${userDoc.id}-ORD${String(index + 1).padStart(3, '0')}`,
                                customer: userData.firstName || 'N/A',
                                date: userData.createdAt?.toDate().toLocaleDateString() || 'N/A',
                                total: total,
                                status: order.status || 'Completed',
                                firestoreDate: userData.createdAt?.toDate() || new Date(0)
                            });
                        });
                    }
                });

                allOrders.sort((a, b) => b.firestoreDate - a.firestoreDate);
                
                // Calculate summary metrics
                const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
                const totalOrdersCount = allOrders.length;
                const pendingOrders = allOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

                const calculatedSummary = [
                    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                    { title: 'Total Orders', value: totalOrdersCount },
                    { title: 'Total Customers', value: totalCustomers },
                    { title: 'Pending Orders', value: pendingOrders },
                ];
                
                setSummaryData(calculatedSummary);
                setRecentOrders(allOrders.slice(0, 5));

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to fetch dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

    return (
        <div className="space-y-8 relative top-10 h-screen px-6 md:px-10 lg:px-20 pb-10">
            {/* Summary Cards */}
            <div className=" grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {summaryData.map((item, index) => (
                    <SummaryCard key={index} {...item} />
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="p-4 text-sm font-semibold text-gray-600">Order ID</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Customer</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Total</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-800 font-medium">{order.id.split('-')[1]}</td>
                                    <td className="p-4 text-sm text-gray-600">{order.customer}</td>
                                    <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
                                    <td className="p-4 text-sm text-gray-800 font-medium">₹{order.total.toFixed(2)}</td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">No recent orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
