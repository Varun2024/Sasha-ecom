import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, MoreVertical, Search, Menu, X, PlusCircle, Filter, MapPin } from 'lucide-react';

// --- MOCK DATA ---
// In a real application, this data would come from an API.

const summaryData = [
    { title: "Total Sales", value: "$12,450", change: "+12.5%", changeType: "increase" },
    { title: "New Orders", value: "345", change: "+5.2%", changeType: "increase" },
    { title: "New Customers", value: "82", change: "-1.8%", changeType: "decrease" },
    { title: "Products in Stock", value: "1,204", change: "", changeType: "" },
];

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

const productsData = [
    { id: 1, name: "Classic Crewneck T-Shirt", sku: "CL-TS-001", category: "T-Shirts", price: "$25.00", stock: 150, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=T-Shirt" },
    { id: 2, name: "Slim-Fit Denim Jeans", sku: "CL-JN-001", category: "Jeans", price: "$79.99", stock: 80, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Jeans" },
    { id: 3, name: "Wool Blend Peacoat", sku: "CL-CT-001", category: "Coats", price: "$199.50", stock: 30, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Coat" },
    { id: 4, name: "V-Neck Cashmere Sweater", sku: "CL-SW-001", category: "Sweaters", price: "$120.00", stock: 55, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Sweater" },
    { id: 5, name: "Leather Ankle Boots", sku: "SH-BT-001", category: "Shoes", price: "$150.00", stock: 40, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Boots" },
    { id: 6, name: "Silk Scarf", sku: "AC-SC-001", category: "Accessories", price: "$45.00", stock: 120, imageUrl: "https://placehold.co/80x80/f0f0f0/4A5568?text=Scarf" },
];


// --- HELPER FUNCTIONS ---

const getStatusColor = (status) => {
    switch (status) {
        case "Shipped": return "bg-blue-100 text-blue-800";
        case "Processing": return "bg-yellow-100 text-yellow-800";
        case "Delivered": return "bg-green-100 text-green-800";
        case "Pending": return "bg-orange-100 text-orange-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

// --- MAIN APP COMPONENT ---

export default function AdminPanel() {
    const [activeView, setActiveView] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // This function determines which view to render based on the state.
    const renderView = () => {
        switch (activeView) {
            case 'Dashboard': return <DashboardView />;
            case 'Orders': return <OrdersView />;
            case 'Products': return <ProductsView />;
            case 'Customers': return <PlaceholderView title="Customer List" />;
            case 'Location': return <LocationView />;
            case 'Settings': return <PlaceholderView title="Admin Settings" />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar activeView={activeView} setActiveView={setActiveView} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header setIsSidebarOpen={setIsSidebarOpen} activeView={activeView} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
}

// --- CORE COMPONENTS ---

const Sidebar = ({ activeView, setActiveView, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Orders', icon: ShoppingBag },
        { name: 'Products', icon: Package },
        { name: 'Customers', icon: Users },
        { name: 'Location', icon: MapPin },
        { name: 'Settings', icon: Settings },
    ];

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">CLOTHIFY</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-600 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>
                <nav className="mt-6">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setActiveView(item.name);
                                if (window.innerWidth < 768) {
                                    setIsSidebarOpen(false);
                                }
                            }}
                            className={`flex items-center px-6 py-3 text-base font-medium transition-colors duration-150 ${
                                activeView === item.name
                                    ? 'text-blue-600 bg-blue-50 border-r-4 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        >
                            <item.icon className="w-5 h-5 mr-4" />
                            {item.name}
                        </a>
                    ))}
                </nav>
            </aside>
        </>
    );
};

const Header = ({ setIsSidebarOpen, activeView }) => {
    return (
        <header className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
            <div className="flex items-center">
                <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600 hover:text-gray-900 mr-4">
                    <Menu size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{activeView}</h2>
                    {activeView === 'Dashboard' && <p className="text-sm text-gray-500">Welcome back, Admin!</p>}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <img
                        src="https://placehold.co/40x40/E2E8F0/4A5568?text=A"
                        alt="Admin Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="hidden lg:block">
                        <p className="font-semibold text-sm">Admin User</p>
                        <p className="text-xs text-gray-500">admin@clothify.com</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

// --- VIEW COMPONENTS ---

const DashboardView = () => {
    const recentOrders = allOrdersData.slice(0, 5);
    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {summaryData.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <p className="text-sm font-medium text-gray-500">{item.title}</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{item.value}</p>
                        {item.change && (
                            <p className={`mt-1 text-sm ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                {item.change} vs last month
                            </p>
                        )}
                    </div>
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
                            {recentOrders.map((order) => (
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
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

const ProductsView = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-xl font-semibold text-gray-800">Product Catalog</h3>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    <PlusCircle size={20} />
                    <span>Add New Product</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead >
                        <tr className="border-b bg-gray-50">
                            <th className="p-4 text-sm font-semibold text-gray-600">Product</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 hidden sm:table-cell">SKU</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Category</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Stock</th>
                            <th className="p-4 text-sm font-semibold text-gray-600"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsData.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-800 font-medium">
                                    <div className="flex items-center gap-4">
                                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover"/>
                                        <span>{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 hidden sm:table-cell">{product.sku}</td>
                                <td className="p-4 text-sm text-gray-600 hidden md:table-cell">{product.category}</td>
                                <td className="p-4 text-sm text-gray-800 font-medium">{product.price}</td>
                                <td className="p-4 text-sm text-gray-600">{product.stock}</td>
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

const LocationView = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col h-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Store Location</h3>
            <div className="flex-grow w-full h-full">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.3712311752365!2d81.66161749999999!3d21.256768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd6f7d73db33%3A0xfe7f24dec5da55ee!2sSASHA%20STORE%20(%20BEST%20CLOTH%20SHOP)!5e0!3m2!1sen!2sin!4v1754844443605!5m2!1sen!2sin" 
                    title="Store Location Map"
                    className="w-full h-full rounded-lg"
                    style={{ border: 0 }} 
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
};


const PlaceholderView = ({ title }) => {
    return (
        <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-sm">
            <div className="text-center">
                <Package size={64} className="mx-auto text-gray-300" />
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">{title}</h2>
                <p className="mt-2 text-gray-500">This section is under construction.</p>
            </div>
        </div>
    );
};
