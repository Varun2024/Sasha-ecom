

/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useMemo, useRef } from 'react';

// --- Firebase ---
import { db } from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore';

// --- UI & Animation ---
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, User, X, LoaderCircle } from 'lucide-react';
import ProfileContainer from './ProfileContainer';

const navLinks = [
    { name: 'Products', path: '/all' },
    { name: 'Store Locator', path: '/store-locator' },
];

const SearchResults = ({ results, loading, query, onResultClick }) => {
    if (loading) {
        return (
            <div className="absolute top-full mt-2 w-full bg-white shadow-xl p-8 text-center border border-gray-100 z-[100]">
                <LoaderCircle className="w-5 h-5 animate-spin mx-auto text-gray-900" />
            </div>
        );
    }

    if (query && results.length === 0) {
        return (
            <div className="absolute top-full mt-2 w-full bg-white shadow-xl p-6 text-center text-[11px] tracking-widest text-gray-400 uppercase border border-gray-100 z-[100]">
                No results for "{query}"
            </div>
        );
    }

    if (results.length === 0) return null;

    return (
        <div className="absolute top-full left-0 mt-2 w-full md:w-[400px] max-h-[70vh] overflow-y-auto bg-white shadow-2xl border border-gray-50 z-[100] rounded-sm">
            <div className="p-3 border-b border-gray-50 text-[10px] tracking-[0.2em] text-gray-400 uppercase font-medium">Search Results</div>
            <ul>
                {results.map(product => (
                    <li key={product.id} onClick={() => onResultClick(product.id)} className="flex items-center gap-4 p-4 hover:bg-[#fafafa] cursor-pointer transition-colors border-b border-gray-50 last:border-b-0">
                        <div className="w-12 h-16 bg-gray-100 flex-shrink-0">
                            <img src={product.imageUrls && product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-[12px] uppercase tracking-wide font-medium text-gray-900">{product.name}</p>
                            <p className="text-[11px] text-gray-400">₹{product.sale}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Header = () => {
    const navigate = useNavigate();
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { currentUser } = useAuth();
    const searchRef = useRef(null);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        const fetchProductsForSearch = async () => {
            setIsSearchLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllProducts(productsData);
            } catch (err) { console.error(err); }
            setIsSearchLoading(false);
        };
        fetchProductsForSearch();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }
        const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchQuery, allProducts]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const totalCartItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
    const wishlistCount = wishlist.length;

    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
    const handleResultClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isMenuOpen]);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-[80] bg-white/95 backdrop-blur-md border-b border-gray-50 h-16 md:h-20 flex justify-between items-center px-4 md:px-12">
                {/* Logo Section */}
                <div onClick={() => navigate('/')} className="cursor-pointer transition-opacity hover:opacity-80">
                    <img src="/logo5-no.png" className="w-24 md:w-32 object-contain" alt="Sasha Logo" />
                </div>

                {/* Desktop Center: Navigation */}
                <nav className="hidden lg:flex items-center gap-12">
                    <ul className="flex items-center gap-10 text-[11px] tracking-[0.2em] uppercase font-semibold text-gray-500">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <div 
                                    onClick={() => navigate(link.path)} 
                                    className="hover:text-black transition-colors cursor-pointer relative group pb-1"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Desktop Search Bar */}
                    <div className="relative ml-4" ref={searchRef}>
                        <div className={`flex items-center border-b ${isSearchFocused ? 'border-black' : 'border-gray-100'} transition-all duration-300`}>
                            <Search className="text-gray-400" size={16} strokeWidth={1.5} />
                            <input
                                type="text"
                                className="bg-transparent pl-3 pr-2 py-1 text-[12px] w-48 lg:w-56 focus:outline-none placeholder:text-gray-300 uppercase tracking-wider font-light"
                                placeholder="SEARCH"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                            />
                        </div>
                        {isSearchFocused && <SearchResults results={searchResults} loading={isSearchLoading} query={searchQuery} onResultClick={handleResultClick} />}
                    </div>
                </nav>

                {/* Right: Actions */}
                <div className="hidden lg:flex items-center gap-8 text-gray-900">
                    <div className="relative group cursor-pointer flex items-center gap-1" onClick={toggleProfile}>
                        <User size={18} strokeWidth={1.5} />
                        <span className="text-[10px] tracking-widest font-medium uppercase text-gray-400 group-hover:text-black transition-colors">
                            {currentUser?.user.displayName ? currentUser.user.displayName.split(' ')[0] : 'Account'}
                        </span>
                    </div>

                    <div className="relative cursor-pointer" onClick={() => navigate('/wishlist')}>
                        <Heart size={18} strokeWidth={1.5} className="hover:text-red-500 transition-colors" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 text-[9px] font-bold text-gray-900">{wishlistCount}</span>
                        )}
                    </div>

                    <div className="relative cursor-pointer group" onClick={() => navigate('/cart')}>
                        <ShoppingBag size={18} strokeWidth={1.5} className="group-hover:text-black" />
                        {totalCartItems > 0 && (
                            <span className="absolute -top-2 -right-2 text-[9px] font-bold text-white bg-black w-4 h-4 rounded-full flex items-center justify-center">{totalCartItems}</span>
                        )}
                    </div>
                </div>

                {/* Mobile Icons + Menu Toggle */}
                <div className="lg:hidden flex items-center gap-5">
                    <div className="relative" onClick={() => navigate('/cart')}>
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {totalCartItems > 0 && <span className="absolute -top-2 -right-2 text-[9px] bg-black text-white w-4 h-4 rounded-full flex items-center justify-center">{totalCartItems}</span>}
                    </div>
                    <button onClick={() => setIsMenuOpen(true)} className="p-1">
                        <Menu size={22} strokeWidth={1.5} />
                    </button>
                </div>
            </header>

            <ProfileContainer isOpen={isProfileOpen} onClose={toggleProfile} />

            {/* Mobile Sidebar Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 right-0 z-[100] h-full w-full max-w-[320px] bg-white shadow-2xl overflow-y-auto"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-center p-6 border-b border-gray-50">
                                    <span className="text-[11px] tracking-[0.3em] font-bold uppercase">Menu</span>
                                    <button onClick={() => setIsMenuOpen(false)}><X size={20} strokeWidth={1.5} /></button>
                                </div>
                                
                                <div className="p-6">
                                    {/* Mobile Search */}
                                    <div className="relative mb-8" ref={searchRef}>
                                        <div className="flex items-center border-b border-gray-200 pb-2">
                                            <Search size={16} className="text-gray-400" />
                                            <input 
                                                type="text" 
                                                className="w-full pl-3 text-[13px] outline-none uppercase tracking-widest placeholder:text-gray-300" 
                                                placeholder="SEARCH" 
                                                value={searchQuery} 
                                                onChange={(e) => setSearchQuery(e.target.value)} 
                                                onFocus={() => setIsSearchFocused(true)} 
                                            />
                                        </div>
                                        {isSearchFocused && <SearchResults results={searchResults} loading={isSearchLoading} query={searchQuery} onResultClick={handleResultClick} />}
                                    </div>

                                    <nav>
                                        <ul className="space-y-6">
                                            {navLinks.map((link) => (
                                                <li key={link.name} onClick={() => { navigate(link.path); setIsMenuOpen(false); }}>
                                                    <div className="text-[13px] tracking-[0.2em] font-medium uppercase text-gray-900 cursor-pointer">{link.name}</div>
                                                </li>
                                            ))}
                                            <li onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }}>
                                                <div className="text-[13px] tracking-[0.2em] font-medium uppercase text-gray-900 cursor-pointer flex justify-between">
                                                    Wishlist <span>({wishlistCount})</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>

                                <div className="mt-auto p-6 bg-[#fafafa]">
                                    <button 
                                        onClick={() => { toggleProfile(); setIsMenuOpen(false); }}
                                        className="w-full bg-black text-white text-[11px] tracking-[0.2em] uppercase py-4 font-bold"
                                    >
                                        {currentUser ? 'My Account' : 'Login / Register'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            {/* Spacer to push content below fixed header */}
            <div className="h-16 md:h-20" />
        </>
    );
};

export default Header;