import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from '../context/AuthContext';
// --- Helper Components ---

const LoadingSpinner = () => (
    <div className="text-center py-10">
        <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
    </div>
);

const EmptyState = () => (
    <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
        <p className="mt-1 text-sm text-gray-500">You haven't placed any orders. When you do, they'll show up here.</p>
    </div>
);

const OrderItem = ({ item }) => (
    <li className="px-4 py-4 sm:px-6 flex items-center space-x-4">
        <div className="flex-shrink-0 bg-gray-200 rounded-md w-16 h-16 flex items-center justify-center">
            {/* Placeholder for an item image */}
            <svg className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622 3.385m-5.043-.025a15.998 15.998 0 01-3.388 1.621m7.424 0a4.5 4.5 0 00-8.4-2.245 2.25 2.25 0 01-2.4-2.245 3 3 0 005.78-1.128 15.998 15.998 0 005.043 3.405z" />
            </svg>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.name || 'Unnamed Item'}</p>
            {item.size && <p className="text-sm text-gray-500 truncate">Size: {item.size}</p>}
        </div>
        <div className="text-right">
            <p className="text-sm font-medium text-gray-900">₹{item.mrp || '0.00'}</p>
            {item.quantity && <p className="text-sm text-gray-500">Qty: {item.quantity}</p>}
        </div>
    </li>
);

const OrderCard = ({ order, orderNumber }) => (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-y-2">
                <div>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">Order #{orderNumber}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Order details and items.</p>
                </div>
                <div>
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Completed</span>
                </div>
            </div>
        </div>
        <ul className="divide-y divide-gray-200">
            {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                <OrderItem key={index} item={item} />
            ))}
        </ul>
    </div>
);


// --- Main Component ---
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        // Don't fetch if db or userId are not available yet.
        if (!currentUser || !db) {
            setLoading(false);
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
                     if (Array.isArray(userOrders) && userOrders.length > 0) {
                        setOrders(userOrders);
                    } else {
                        setOrders([]);
                    }
                } else {
                    console.log("No such user document! The user may not have placed any orders yet.");
                    setOrders([]);
                }
            } catch (err) {
                console.error("Error getting user document:", err);
                setError("Failed to fetch orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [currentUser]); // Re-run effect if userId or db instance changes.

    const renderContent = () => {
        if (loading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <p className="text-red-500 text-center">{error}</p>;
        }
        if (orders.length === 0) {
            return <EmptyState />;
        }
        return (
            <div>
                {orders.slice().reverse().map((order, index) => (
                    <OrderCard key={index} order={order} orderNumber={orders.length - index} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
                    <p className="mt-2 text-sm text-gray-500">View your past orders and their details below.</p>
                </header>
                <main>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default MyOrders;

