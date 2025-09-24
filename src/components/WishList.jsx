import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { toast } from 'react-toastify'; // Make sure ToastContainer is in your App.js
import { useMemo } from 'react';

// --- WishlistItem Component ---
const WishlistItem = ({ item }) => {
    const { dispatch: wishlistDispatch } = useWishlist();
    const { cart, dispatch: cartDispatch } = useCart();

    // Check if the item is already in the cart to update the UI
    const isInCart = useMemo(() => cart.some(cartItem => cartItem.id === item.id), [cart, item.id]);

    const handleRemove = () => {
        wishlistDispatch({ type: 'REMOVE_ITEM', payload: item.id });
        toast.error(`${item.name} removed from wishlist.`);
    };

    const handleAddToCart = () => {
        if (isInCart) {
            toast.info(`₹{item.name} is already in your cart.`);
            return;
        }
        // Add to cart
        cartDispatch({ type: 'ADD', payload: { ...item, quantity: 1 } });
        // Automatically remove from wishlist
        wishlistDispatch({ type: 'REMOVE_ITEM', payload: item.id });
        toast.success(`₹{item.name} moved to cart!`);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
            <Link to={`/product/${item.id}`}>
                <img src={item.imageUrl} alt={item.name} className="w-28 h-36 object-cover rounded-md" />
            </Link>
            <div className="flex-grow text-center sm:text-left">
                <Link to={`/product/${item.id}`} className="hover:underline">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                </Link>
                <p className="text-lg font-semibold text-purple-600">₹{item.sale}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 font-semibold rounded-lg transition-colors text-white ${
                        isInCart
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                >
                    <ShoppingCart className="w-5 h-5" /> {isInCart ? 'In Cart' : 'Move to Cart'}
                </button>
                <button onClick={handleRemove} className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 font-semibold rounded-lg text-red-600 bg-red-100 hover:bg-red-200 transition-colors">
                    <Trash2 className="w-5 h-5" /> Remove
                </button>
            </div>
        </div>
    );
};


// --- WishlistPage Component ---
export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="container min-h-screen pt-20 mx-auto px-4 py-16 bg-slate-50">
            <header className="text-center mb-10">
                <div className="flex justify-center items-center gap-3">
                    <Heart className="w-10 h-10 text-red-500" />
                    <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">My Wishlist</h1>
                </div>
                <p className="mt-2 text-gray-500">
                    Your curated list of favorite items.
                </p>
            </header>
            
            {wishlist.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-4">
                    {wishlist.map(item => (
                        <WishlistItem key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-sm">
                    <Heart className="mx-auto h-16 w-16 text-red-200" />
                    <h2 className="mt-6 text-2xl font-bold text-gray-800">Your wishlist is currently empty.</h2>
                    <p className="text-gray-500 mt-2">
                        Click the heart icon on any product to save it here for later.
                    </p>
                    <Link
                        to="/all"
                        className="inline-block mt-8 rounded-lg border-2 border-black bg-white px-8 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                    >
                        Discover Products
                    </Link>
                </div>
            )}
        </div>
    );
}