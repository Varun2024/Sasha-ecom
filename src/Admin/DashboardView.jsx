import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { TrendingUp, ShoppingBag, Users, Clock, ArrowUpRight, ArrowDownRight, icons } from 'lucide-react';

// --- Minimalist Helper Components ---
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Synchronizing Data...</p>
    </div>
);

const getStatusStyles = (status) => {
    switch (status) {
        case "Delivered":
        case "Completed":
            return "text-green-600 bg-green-50";
        case "Processing":
            return "text-amber-600 bg-amber-50";
        case "Shipped":
            return "text-blue-600 bg-blue-50";
        default:
            return "text-gray-500 bg-gray-50";
    }
};

const SummaryCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-8 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-sm group hover:border-black transition-all duration-500">
        <div className="flex justify-between items-start">
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">{title}</p>
            <Icon size={16} className="text-gray-300 group-hover:text-black transition-colors" strokeWidth={1.5} />
        </div>
        <p className="mt-4 text-2xl font-light tracking-tight text-gray-900 uppercase italic">
            {value}
        </p>
        <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center text-[9px] font-bold text-green-600 uppercase tracking-widest">
                {Icon}<ArrowUpRight size={10} className="mr-1" /> 12%
            </span>
            <span className="text-[9px] text-gray-300 uppercase tracking-widest font-medium">Growth Index</span>
        </div>
    </div>
);

// --- Main Component ---
const DashboardView = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const allOrders = [];
                const processedOrderIds = new Set();
                const totalCustomers = querySnapshot.size;

                querySnapshot.docs.forEach(userDoc => {
                    const userData = userDoc.data();
                    if (userData.orders && Array.isArray(userData.orders)) {
                        userData.orders.forEach((order) => {
                            const transactionId = order.orderId;
                            if (transactionId && !processedOrderIds.has(transactionId)) {
                                const total = order.items.reduce((sum, item) => sum + (parseFloat(item.sale) || 0), 0);
                                allOrders.push({
                                    ...order,
                                    id: transactionId,
                                    customer: userData.firstName || userData.displayName || 'Guest',
                                    date: order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB') : 'Recently',
                                    total: total,
                                    status: order.orderStatus || 'Confirmed',
                                    rawDate: order.orderDate || 0
                                });
                                processedOrderIds.add(transactionId);
                            }
                        });
                    }
                });

                allOrders.sort((a, b) => b.rawDate - a.rawDate);

                const totalRevenue = allOrders.reduce((sum, order) => sum + (order.paymentMethod === "COD" ? order.total + 100 : order.total + 50), 0);

                setSummaryData([
                    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp },
                    { title: 'Total Orders', value: allOrders.length, icon: ShoppingBag },
                    { title: 'Registered Users', value: totalCustomers, icon: Users },
                    { title: 'Active Queues', value: allOrders.filter(o => o.status === 'Processing').length, icon: Clock },
                ]);
                setRecentOrders(allOrders.slice(0, 8));
            } catch (err) {
                setError("FAILED TO RETRIEVE METRICS");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center py-20 text-[11px] tracking-widest text-red-400 uppercase">{error}</p>;

    return (
        <div className="animate-in fade-in duration-700">
            {/* KPI GRID */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {summaryData.map((item, index) => (
                    <SummaryCard key={index} {...item} />
                ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-[#fafafa]">
                    <div>
                        <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-900">Recent Transactions</h3>
                        <p className="text-[9px] tracking-widest text-gray-400 uppercase mt-1">Live Atelier Feed</p>
                    </div>
                    <button className="text-[10px] tracking-widest uppercase font-bold text-gray-400 hover:text-black transition-colors border-b border-gray-200">
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-gray-50">
                                <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Order Ref</th>
                                <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Client</th>
                                <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hidden md:table-cell">Date</th>
                                <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Value</th>
                                <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 text-right">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-[#fafafa] transition-colors">
                                    <td className="p-6">
                                        <span className="text-[12px] font-medium tracking-tighter text-gray-900 uppercase">
                                            #{order.id.substring(order.id.length - 8)}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[12px] font-medium text-gray-900 uppercase tracking-tight">{order.customer}</span>
                                    </td>
                                    <td className="p-6 hidden md:table-cell">
                                        <span className="text-[11px] text-gray-400 font-light uppercase tracking-widest">{order.date}</span>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-[12px] font-bold text-gray-900">₹{order.paymentMethod === "COD"? (order.total + 100).toLocaleString('en-IN') : (order.total+50).toLocaleString('en-IN')}</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <span className={`px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase rounded-full ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;