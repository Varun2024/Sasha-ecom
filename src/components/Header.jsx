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

// --- New Search Results Component ---
const SearchResults = ({ results, loading, query, onResultClick }) => {
    if (loading) {
        return (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg p-4 text-center">
                <LoaderCircle className="w-6 h-6 animate-spin mx-auto text-gray-500" />
            </div>
        );
    }

    if (query && results.length === 0) {
        return (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg p-4 text-center text-gray-500">
                No results found for "{query}"
            </div>
        );
    }

    if (results.length === 0) return null;

    return (
        <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border">
            <ul>
                {results.map(product => (
                    <li key={product.id} onClick={() => onResultClick(product.id)} className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0">
                        <img src={product.imageUrl} alt={product.name} className="w-12 h-16 object-cover rounded-md" />
                        <div className="flex-grow">
                            <p className="font-semibold text-gray-800">{product.name}</p>
                            <p className="text-sm text-purple-600 font-bold">₹{product.price}</p>
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
    const searchRef = useRef(null); // Ref for the search container

    // --- Component State ---
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- Search State ---
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Fetch all products once on component mount for client-side search
    useEffect(() => {
        const fetchProductsForSearch = async () => {
            setIsSearchLoading(true);
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllProducts(productsData);
            setIsSearchLoading(false);
        };
        fetchProductsForSearch();
    }, []);

    // Effect to perform search when query changes
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

    // Effect to handle clicks outside the search component to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // --- Memoized Calculations ---
    const totalCartItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
    const wishlistCount = wishlist.length;

    // --- Handlers ---
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
    const handleResultClick = (productId) => {
        window.location.href = `/product/${productId}`;
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    // Effect to lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isMenuOpen]);

    return (
        <>
            <header className="fixed top-0 z-40 w-full text-black bg-white/80 backdrop-blur-lg shadow-md flex justify-between items-center py-2 px-4 md:px-8">
                <div onClick={() => navigate('/')} className="cursor-pointer">
                    <img src="/logo-nbg.png" className="md:w-42 w-28 " alt="" />
                    {/* <div className="w-32 h-16 bg-[url('/public/logo1.png')] bg-cover bg-center" /> */}
                </div>

                {/* Desktop Navigation & Search */}
                <nav className="hidden lg:flex items-center gap-8">
                    <ul className="flex items-center gap-6 uppercase text-sm font-medium text-gray-700">
                        {navLinks.map((link) => (
                            <li key={link.name}><div onClick={() => navigate(link.path)} className="bg-gradient-to-r from-black to-gray-800 bg-no-repeat [background-position:0%_100%] [background-size:0%_2px] transition-all duration-300 hover:[background-size:100%_2px] hover:text-black cursor-pointer pb-1">{link.name}</div></li>
                        ))}
                    </ul>
                    <div className="relative" ref={searchRef}>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        {isSearchFocused && <SearchResults results={searchResults} loading={isSearchLoading} query={searchQuery} onResultClick={handleResultClick} />}
                    </div>
                </nav>

                {/* Desktop User Actions */}
                <div className="hidden lg:flex items-center gap-6 text-gray-700">
                    <div className="relative flex flex-col items-center gap-1 cursor-pointer" onClick={toggleProfile}>
                        <User size={20} /><span className="text-xs font-medium">{currentUser?.displayName || 'Profile'}</span>
                    </div>
                    <div className="relative flex flex-col items-center gap-1 cursor-pointer" onClick={() => navigate('/wishlist')}>
                        <Heart size={20} /><span className="text-xs font-medium">Wishlist</span>
                        {wishlistCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{wishlistCount}</div>
                        )}
                    </div>
                    <div className="relative flex flex-col items-center gap-1 cursor-pointer" onClick={() => navigate('/cart')}>
                        <ShoppingBag size={20} /><span className="text-xs font-medium">Cart</span>
                        {totalCartItems > 0 && (
                            <div className="absolute -top-2 -right-3 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{totalCartItems}</div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-4">
                    
                    <div className="relative" ref={searchRef}>
                        <input type="text" className="w-[70%] border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        {isSearchFocused && <SearchResults results={searchResults} loading={isSearchLoading} query={searchQuery} onResultClick={handleResultClick} />}
                    </div>
                    <button onClick={() => setIsMenuOpen(true)} className="p-2">
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            <ProfileContainer isOpen={isProfileOpen} onClose={toggleProfile} />

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl lg:hidden"
                    >
                        <div className="flex flex-col h-full p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold">Menu</h2>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2"><X size={24} /></button>
                            </div>
                            <nav className="flex-grow">
                                <ul className="flex flex-col space-y-6 text-lg">
                                    {navLinks.map((link) => (
                                        <li key={link.name}>
                                            <div onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className="cursor-pointer">{link.name}</div>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="space-y-6 border-t pt-6">
                                {/* Mobile Search */}

                                <div className="space-y-4 text-md">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => { toggleProfile(); setIsMenuOpen(false); }}><User size={22} /><span>{currentUser?.displayName || 'Profile'}</span></div>
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }}><Heart size={22} /><span>Wishlist ({wishlistCount})</span></div>
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}><ShoppingBag size={22} /><span>Cart ({totalCartItems})</span></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
