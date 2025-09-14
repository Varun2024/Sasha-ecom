// --- context/WishlistContext.jsx (New File) ---
import { useReducer, useEffect, useContext, createContext } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
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
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                return onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        dispatch({ type: 'SET_WISHLIST', payload: snapshot.data().wishlist || [] });
                    }
                });
            } else {
                dispatch({ type: 'SET_WISHLIST', payload: [] });
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);



    // 🔹 Helper: Update Firestore on add/remove
    const updateWishlistInFirestore = async (newWishlist) => {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { wishlist: newWishlist });
    };

    // 🔹 Dispatch wrapper to also persist
    const enhancedDispatch = (action) => {
        const newState = wishlistReducer(wishlist, action);

        if (action.type === 'ADD_ITEM' || action.type === 'REMOVE_ITEM') {
            updateWishlistInFirestore(newState);
        }

        dispatch(action);
    };
    return (
        <wishlistContext.Provider value={{ wishlist, dispatch: enhancedDispatch }}>
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

