import { MoreVertical } from "lucide-react";
import { useState } from "react";



const allOrdersData = [
    { id: "ORD001", customer: "John Doe", date: "2024-08-10", total: "$150.00", status: "Shipped" },
    { id: "ORD002", customer: "Jane Smith", date: "2024-08-10", total: "$75.50", status: "Processing" },
    { id: "ORD003", customer: "Mike Johnson", date: "2024-08-09", total: "$220.00", status: "Shipped" },
    { id: "ORD004", customer: "Emily Brown", date: "2024-08-09", total: "$45.99", status: "Delivered" },
    { id: "ORD005", customer: "Chris Lee", date: "2024-08-08", total: "$300.10", status: "Pending" },
    { id: "ORD006", customer: "Sarah Wilson", date: "2024-08-08", total: "$99.00", status: "Shipped" },
    { id: "ORD007", customer: "David Martinez", date: "2024-08-07", total: "$12.50", status: "Delivered" },
    { id: "ORD008", customer: "Laura Garcia", date: "2024-08-07", total: "$84.25", status: "Processing" },
];

const getStatusColor = (status) => {
    switch (status) {
        case "Shipped": return "bg-blue-100 text-blue-800";
        case "Processing": return "bg-yellow-100 text-yellow-800";
        case "Delivered": return "bg-green-100 text-green-800";
        case "Pending": return "bg-orange-100 text-orange-800";
        default: return "bg-gray-100 text-gray-800";
    }
};


const OrdersView = () => {
    const [filter, setFilter] = useState('All');
    const filteredOrders = filter === 'All' ? allOrdersData : allOrdersData.filter(o => o.status === filter);
    const statuses = ['All', 'Shipped', 'Processing', 'Pending', 'Delivered'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-xl font-semibold text-gray-800">All Orders</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {statuses.map(status => (
                        <button 
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                            <th className="p-4 text-sm font-semibold text-gray-600"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-800 font-medium">{order.id}</td>
                                <td className="p-4 text-sm text-gray-600">{order.customer}</td>
                                <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{order.date}</td>
                                <td className="p-4 text-sm text-gray-800 font-medium">{order.total}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    <button className="hover:text-gray-900"><MoreVertical size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersView;