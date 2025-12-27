import React, { useState } from 'react';
import { 
    LayoutDashboard, ShoppingBag, Package, Users, Settings, 
    MoreVertical, Search, Menu, X, PlusCircle, Filter, MapPin, 
    ChevronRight, ExternalLink 
} from 'lucide-react';
import ProductsView from './ProductView';
import CustomersView from './CustomerList';
import OrdersView from './OrdersView';
import CollectionsView from './Collection';
import DashboardView from './DashboardView';

export default function AdminPanel() {
    const [activeView, setActiveView] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderView = () => {
        switch (activeView) {
            case 'Dashboard': return <DashboardView />;
            case 'Orders': return <OrdersView />;
            case 'Collections': return <CollectionsView />;
            case 'Products': return <ProductsView />;
            case 'Customers': return <CustomersView />;
            case 'Location': return <LocationView />;
            case 'Settings': return <PlaceholderView title="Atelier Settings" />;
            default: return <DashboardView />;
        }
    };

    return (
        <div className="flex bg-white font-sans text-gray-900">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[40] md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar 
                activeView={activeView} 
                setActiveView={setActiveView} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* <Header setIsOpen={setIsSidebarOpen} activeView={activeView} /> */}
                
                <main className="flex-1 overflow-y-auto bg-[#fafafa] p-4 md:p-10">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
                        {renderView()}
                    </div>
                </main>
            </div>
        </div>
    );
}

const Sidebar = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Orders', icon: ShoppingBag },
        { name: 'Products', icon: Package },
        { name: 'Collections', icon: PlusCircle },
        { name: 'Customers', icon: Users },
        { name: 'Location', icon: MapPin },
        { name: 'Settings', icon: Settings },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-[50] w-64 bg-white border-r border-gray-100 transform 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        `}>
            <div className="h-20 flex items-center px-8 border-b border-gray-50">
                <h1 className="text-xl font-bold tracking-[0.3em] uppercase">Sasha</h1>
                <button onClick={() => setIsOpen(false)} className="ml-auto md:hidden">
                    <X size={20} strokeWidth={1.5} />
                </button>
            </div>

            <nav className="mt-8 px-4 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => {
                            setActiveView(item.name);
                            if (window.innerWidth < 768) setIsOpen(false);
                        }}
                        className={`
                            w-full flex items-center px-4 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-200
                            ${activeView === item.name 
                                ? 'bg-black text-white shadow-lg' 
                                : 'text-gray-400 hover:text-black hover:bg-gray-50'}
                        `}
                    >
                        <item.icon size={16} strokeWidth={activeView === item.name ? 2 : 1.5} className="mr-4" />
                        {item.name}
                    </button>
                ))}
            </nav>

            <div className="absolute bottom-0 w-full p-6 border-t border-gray-50">
                <a href="/" target="_blank" className="flex items-center justify-between text-[10px] tracking-widest uppercase text-gray-400 hover:text-black transition-colors">
                    View Storefront <ExternalLink size={12} />
                </a>
            </div>
        </aside>
    );
};

const Header = ({ setIsOpen, activeView }) => {
    return (
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-[30]">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsOpen(true)} className="md:hidden p-2 -ml-2">
                    <Menu size={20} strokeWidth={1.5} />
                </button>
                <div>
                    <h2 className="text-xs tracking-[0.4em] uppercase font-bold text-gray-900">{activeView}</h2>
                    <p className="text-[10px] tracking-widest text-gray-400 uppercase mt-0.5">Management Portal</p>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="relative hidden lg:block">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                    <input
                        type="text"
                        placeholder="SEARCH ATELIER..."
                        className="pl-6 pr-4 py-2 text-[10px] tracking-widest uppercase focus:outline-none border-b border-transparent focus:border-black transition-all bg-transparent w-48"
                    />
                </div>
                
                <div className="flex items-center gap-3 pl-8 border-l border-gray-100">
                    <div className="text-right">
                        <p className="text-[10px] font-bold tracking-widest uppercase">Admin</p>
                        <p className="text-[9px] text-gray-400 tracking-tighter italic">sashastore.in</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center text-white text-[10px] font-bold">
                        S
                    </div>
                </div>
            </div>
        </header>
    );
};

const LocationView = () => {
    return (
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm h-[calc(100vh-200px)]">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900">Store Presence</h3>
                <span className="text-[9px] tracking-widest uppercase text-gray-400">Live Satellite View</span>
            </div>
            <div className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.3712311752365!2d81.66161749999999!3d21.256768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd6f7d73db33%3A0xfe7f24dec5da55ee!2sSASHA%20STORE%20(%20BEST%20CLOTH%20SHOP)!5e0!3m2!1sen!2sin!4v1754844443605!5m2!1sen!2sin" 
                    title="Store Location Map"
                    className="w-full h-full"
                    style={{ border: 0 }} 
                    allowFullScreen
                    loading="lazy" 
                />
            </div>
        </div>
    );
};

const PlaceholderView = ({ title }) => {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-white border border-gray-100 border-dashed rounded-sm">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border border-gray-100 flex items-center justify-center mx-auto">
                    <Package size={24} strokeWidth={1} className="text-gray-300" />
                </div>
                <h2 className="text-[12px] tracking-[0.4em] uppercase font-light text-gray-400">{title}</h2>
                <p className="text-[10px] tracking-widest text-gray-300 uppercase">This module is being curated</p>
            </div>
        </div>
    );
};