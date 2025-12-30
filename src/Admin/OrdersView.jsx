/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { ChevronDown, Package, MapPin, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../firebase/firebaseConfig';
import { toast, ToastContainer } from 'react-toastify';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Establishing Secure Sync...</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-32 bg-white border border-gray-100 rounded-sm">
        <Package size={48} strokeWidth={1} className="mx-auto text-gray-200 mb-6" />
        <h3 className="text-[12px] tracking-[0.4em] uppercase font-light text-gray-400">Order Queue Empty</h3>
        <p className="text-[10px] tracking-widest text-gray-300 uppercase mt-2">The atelier is currently awaiting new transactions.</p>
    </div>
);

const getStatusStyles = (status) => {
    switch (status) {
        case "Delivered": case "Completed": return "text-green-600 bg-green-50";
        case "Processing": return "text-amber-600 bg-amber-50";
        case "Shipped": return "text-blue-600 bg-blue-50";
        case "Cancelled": return "text-red-500 bg-red-50";
        default: return "text-gray-400 bg-gray-50";
    }
};

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

const OrderRow = ({ order, onStatusUpdate, paymentMethod }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newStatus, setNewStatus] = useState(order.status);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e) => {
        e.stopPropagation();
        setIsSaving(true);
        await onStatusUpdate(order, newStatus);
        setIsSaving(false);
    };

    return (
        <Fragment>
            <tr className={`border-b border-gray-50 hover:bg-[#fafafa] transition-colors cursor-pointer ${isExpanded ? 'bg-[#fafafa]' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
                <td className="p-6">
                    <img 
                        src={order.items[0]?.imageUrl || order.items[0]?.imageUrls?.[0] || 'https://via.placeholder.com/150'} 
                        className="w-12 h-16 object-cover grayscale-[0.5]" 
                        alt="Product Preview"
                    />
                </td>
                <td className="p-6">
                    <span className="text-[11px] font-bold tracking-tighter text-gray-900 uppercase">#{order.id.substring(order.id.length - 8)}</span>
                </td>
                <td className="p-6">
                    <span className="text-[12px] font-medium text-gray-900 uppercase tracking-tight">{order.customer}</span>
                </td>
                <td className="p-6 hidden md:table-cell">
                    <span className="text-[11px] text-gray-400 font-light uppercase tracking-widest">{order.date}</span>
                </td>
                <td className="p-6">
                    <span className="text-[12px] font-bold text-gray-900 uppercase tracking-tight">₹{order.paymentMethod === "COD"? (order.total + 100).toFixed(2) : (order.total+50).toFixed(2)}</span>
                </td>
                <td className="p-6">
                    <span className={`px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase rounded-full ${getStatusStyles(order.status)}`}>
                        {order.status}
                    </span>
                </td>
                <td className="p-6 text-center">
                    <ChevronDown size={16} className={`text-gray-300 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-black' : ''}`} />
                </td>
            </tr>
            {isExpanded && (
                <tr className="bg-[#fcfcfc] border-b border-gray-100 animate-in slide-in-from-top-2 duration-300">
                    <td colSpan="7" className="p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Shipping Details */}
                            <div className="lg:col-span-4 space-y-6">
                                <h4 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900 border-b border-gray-200 pb-3">Delivery Portfolio</h4>
                                {order.address ? (
                                    <div className="text-[12px] text-gray-500 space-y-1 uppercase tracking-wider leading-relaxed">
                                        <p className="font-semibold text-gray-900 mb-2">{order.address.fullName}</p>
                                        <p>{order.address.address}</p>
                                        <p>{order.address.city}, {order.address.state} — {order.address.zip}</p>
                                        <p className="pt-4 text-black font-medium flex items-center gap-2 italic">M: {order.address.phone}</p>
                                    </div>
                                ) : <p className="text-[11px] text-gray-300 uppercase italic">No delivery profile attached.</p>}
                            </div>

                            {/* Line Items */}
                            <div className="lg:col-span-5 space-y-6">
                                <h4 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900 border-b border-gray-200 pb-3">Inventory Manifest</h4>
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <img src={item.imageUrl || item.imageUrls?.[0]} className="w-12 h-16 object-cover bg-gray-50" alt="" />
                                            <div className="flex-grow">
                                                <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">{item.name}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.selectedColor} / {item.selectedSize} / ₹{item.sale}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Logistics Control */}
                            <div className="lg:col-span-3 space-y-6">
                                <h4 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900 border-b border-gray-200 pb-3">Fulfillment Hub</h4>
                                <div className="space-y-4">
                                    <div className="bg-white p-4 border border-gray-100 rounded-sm">
                                        <p className="text-[9px] tracking-widest text-gray-400 uppercase font-bold mb-3">Status Control</p>
                                        <div className="flex flex-col gap-3">
                                            <select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full bg-gray-50 border-b border-gray-200 py-2 text-[11px] tracking-widest uppercase font-medium outline-none focus:border-black transition-all"
                                            >
                                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving || newStatus === order.status}
                                                className="w-full py-3 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 disabled:bg-gray-100 transition-all"
                                            >
                                                {isSaving ? 'Syncing...' : 'Update Records'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-2 text-[12px] tracking-widest text-gray-600 uppercase">
                                        <CreditCard size={15} strokeWidth={1.5} /> {order.paymentMethod || 'Prepaid'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </Fragment>
    );
};

const AllOrders = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchAllOrders = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const ordersWithUserInfo = [];
                const processedOrderIds = new Set();

                for (const userDoc of querySnapshot.docs) {
                    const userData = userDoc.data();
                    if (userData.orders && Array.isArray(userData.orders)) {
                        userData.orders.forEach((order) => {
                            const originalOrderId = order.orderId;
                            if (originalOrderId && !processedOrderIds.has(originalOrderId)) {
                                const total = order.items.reduce((sum, item) => sum + (parseFloat(item.sale) || 0), 0);
                                ordersWithUserInfo.push({
                                    ...order,
                                    id: originalOrderId,
                                    compositeId: `${userDoc.id}-${originalOrderId}`,
                                    userId: userDoc.id,
                                    customer: userData.firstName || userData.displayName || 'Guest',
                                    date: order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB') : 'Recently',
                                    total: total,
                                    status: order.orderStatus || 'Confirmed',
                                    address: order.shippingAddress || (userData.addresses?.[0]),
                                    items: order.items || [],
                                    rawDate: order.orderDate || 0
                                });
                                processedOrderIds.add(originalOrderId);
                            }
                        });
                    }
                }
                ordersWithUserInfo.sort((a, b) => b.rawDate - a.rawDate);
                setAllOrders(ordersWithUserInfo);
            } catch (err) {
                setError("DATABASE DISCONNECTED");
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, []);

    const handleStatusUpdate = async (orderToUpdate, newStatus) => {
        try {
            const userRef = doc(db, "users", orderToUpdate.userId);
            const userSnap = await getDocs(collection(db, "users"));
            let targetUserDoc = userSnap.docs.find(d => d.id === orderToUpdate.userId);

            if (targetUserDoc) {
                const ordersArray = targetUserDoc.data().orders || [];
                const orderIndex = ordersArray.findIndex(o => o.orderId === orderToUpdate.id);
                if (orderIndex > -1) {
                    ordersArray[orderIndex].orderStatus = newStatus;
                    await updateDoc(userRef, { orders: ordersArray });
                    setAllOrders(prev => prev.map(o => o.id === orderToUpdate.id ? { ...o, status: newStatus } : o));
                    toast.success("RECORDS SYNCHRONIZED", { theme: "light" });
                }
            }
        } catch (err) { toast.error("SYNC FAILED"); }
    };

    const filteredOrders = filter === 'All' ? allOrders : allOrders.filter(o => o.status === filter);

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20 animate-in fade-in duration-700">
            <ToastContainer position="bottom-right" theme='light' autoClose={2000} hideProgressBar />
            
            <header className="mb-12">
                <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-400 italic">Logistics Hub</h3>
                <h1 className="text-4xl font-light tracking-[0.1em] text-gray-900 uppercase mt-2">Manage <span className="font-semibold">Transactions</span></h1>
                <div className="h-[1px] w-12 bg-black mt-6"></div>
            </header>

            <div className="space-y-8">
                {/* Filter Bar */}
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Completed', 'Cancelled'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 border ${
                                filter === s ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? <LoadingSpinner /> : allOrders.length === 0 ? <EmptyState /> : (
                    <div className="bg-white border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] rounded-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#fafafa] border-b border-gray-50">
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Atelier Preview</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Reference</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Client</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hidden md:table-cell">Date</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Portfolio Value</th>
                                    <th className="p-6 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Status</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <OrderRow key={order.compositeId} order={order} onStatusUpdate={handleStatusUpdate} paymentMethod={order.paymentMethod} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllOrders;