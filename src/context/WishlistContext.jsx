// --- context/WishlistContext.jsx (New File) ---
import {   useReducer, useEffect, useContext, createContext } from 'react';
const wishlistContext = createContext();

const wishlistReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            if (!state.some(item => item.id === action.payload.id)) {
                return [...state, action.payload];
            }
            return state;
        case 'REMOVE_ITEM':
            return state.filter(item => item.id !== action.payload);
        case 'SET_WISHLIST':
            return action.payload;
        default:
            return state;
    }
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, dispatch] = useReducer(wishlistReducer, [], () => {
        const localData = localStorage.getItem('wishlist');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    return (
        <wishlistContext.Provider value={{ wishlist, dispatch }}>
            {children}
        </wishlistContext.Provider>
    );
};
export default WishlistProvider;

export const useWishlist = () => {
    const context = useContext(wishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}

