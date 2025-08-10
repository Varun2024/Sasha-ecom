import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';

const WishlistItem = ({ item }) => {
    const { dispatch: wishlistDispatch } = useWishlist();
    const { cart , dispatch: cartDispatch } = useCart();

    const handleRemove = () => {
        wishlistDispatch({ type: 'REMOVE_ITEM', payload: item.id });
    };

    const handleAddToCart = () => {
        localStorage.setItem("cartCount", JSON.stringify(cart.length + 1));
        cartDispatch({ type: 'ADD', payload: { ...item, quantity: 1 } });
        // wishlistDispatch({ type: 'REMOVE_ITEM', payload: item.id }); // Optionally remove from wishlist on add to cart
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-700/20">
            <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-md" />
            <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
                <p className="text-lg font-bold text-purple-600">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/60 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
                <button onClick={handleRemove} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/60 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                    <Trash2 className="w-5 h-5" /> Remove
                </button>
            </div>
        </div>
    );
};

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="container pt-20 mx-auto px-4 py-16 bg-gray-200">
            <header className="text-center mb-8">
                <h1 className={`text-4xl font-extrabold ${wishlist.length > 0 ? 'text-gray-800 ' : 'text-gray-300'} tracking-tight`}>My Wishlist</h1>
            </header>
            {wishlist.length > 0 ? (
                <div className="max-w-4xl mx-auto bg-gray-100/30 p-6 rounded-lg shadow-md">
                    {wishlist.map(item => (
                        <WishlistItem key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16  rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-300">Your wishlist is empty.</h2>
                    <p className="text-gray-400 mt-2">Add items you love to your wishlist to see them here.</p>
                    <Link to="/all" className="inline-block mt-6 rounded-2xl border-2 border-dashed border-black/40 bg-white px-8 py-2 font-semibold uppercase text-black/40 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
                        Discover Products
                    </Link>
                </div>
            )}
        </div>
    );
}