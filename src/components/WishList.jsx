import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { useMemo } from 'react';

// --- WishlistItem Component ---
const WishlistItem = ({ item }) => {
    const { dispatch: wishlistDispatch } = useWishlist();
    const { cart, dispatch: cartDispatch } = useCart();

    const isInCart = useMemo(() => cart.some(cartItem => cartItem.id === item.id), [cart, item.id]);

    let displayImage = 'https://placehold.co/200x300/f8f8f8/cccccc?text=Image+Not+Found';
    if (item.imageUrls && item.imageUrls.length > 0) {
        displayImage = item.imageUrls[0];
    } else if (item.imageUrl) {
        displayImage = item.imageUrl;
    }

    const handleRemove = () => {
        wishlistDispatch({ type: 'REMOVE_ITEM', payload: item.id });
        toast.info(`${item.name.toUpperCase()} REMOVED`, { theme: 'light' });
    };

    const handleAddToCart = () => {
        if (isInCart) return;
        cartDispatch({ type: 'ADD', payload: { ...item, quantity: 1 } });
        wishlistDispatch({ type: 'REMOVE_ITEM', payload: item.id });
        toast.success("MOVED TO BAG", { theme: 'light' });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-8 py-8 border-b border-gray-100 group animate-in fade-in duration-500">
            {/* Image Section */}
            <Link to={`/product/${item.id}`} className="w-32 h-44 bg-[#fafafa] flex-shrink-0 overflow-hidden rounded-sm">
                <img 
                    src={displayImage} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 hover:scale-105" 
                />
            </Link>

            {/* Details Section */}
            <div className="flex-grow text-center sm:text-left space-y-2">
                <Link to={`/product/${item.id}`}>
                    <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 hover:text-gray-600 transition-colors">
                        {item.name}
                    </h3>
                </Link>
                <p className="text-[11px] tracking-[0.2em] text-gray-400 uppercase font-light italic">
                    {item.category || "Curation"}
                </p>
                <p className="text-sm font-medium text-gray-900 pt-2">₹{item.sale}</p>
            </div>

            {/* Actions Section */}
            <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`flex items-center justify-center gap-3 px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm ${
                        isInCart
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                    }`}
                >
                    <ShoppingBag className="w-4 h-4" /> {isInCart ? 'In Bag' : 'Add to Bag'}
                </button>
                <button 
                    onClick={handleRemove} 
                    className="flex items-center justify-center gap-2 text-[10px] tracking-widest uppercase text-gray-300 hover:text-red-500 transition-colors py-2"
                >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
            </div>
        </div>
    );
};

// --- WishlistPage Component ---
export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-white pt-12 pb-20">
            <ToastContainer theme='light' hideProgressBar={true} position="bottom-center" />
            
            <div className="container mx-auto px-4 lg:px-12">
                {/* Editorial Header */}
                <header className="text-center mb-16">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3 italic">Personal Curation</h2>
                    <h1 className="text-3xl md:text-5xl font-light tracking-[0.1em] text-gray-900 uppercase">
                        My <span className="font-semibold">Wishlist</span>
                    </h1>
                    <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
                </header>
                
                {wishlist.length > 0 ? (
                    <div className="max-w-4xl mx-auto border-t border-gray-50">
                        {wishlist.map(item => (
                            <WishlistItem key={item.id} item={item} />
                        ))}
                        
                        <div className="pt-12 text-center">
                             <Link 
                                to="/all" 
                                className="text-[11px] tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors font-medium border-b border-transparent hover:border-black pb-1"
                            >
                                Continue Discovery
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 px-6 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Heart className="mx-auto h-12 w-12 text-gray-100" strokeWidth={1} />
                        <h2 className="mt-8 text-xl font-light tracking-widest text-gray-900 uppercase leading-relaxed">
                            Your curation is currently empty
                        </h2>
                        <p className="text-gray-400 mt-4 text-[13px] font-light tracking-wide uppercase">
                            Save your favorite pieces here to review them later.
                        </p>
                        <Link
                            to="/all"
                            className="mt-12 inline-block bg-black text-white px-12 py-5 text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-gray-800 transition-all rounded-sm"
                        >
                            Explore Collections
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}