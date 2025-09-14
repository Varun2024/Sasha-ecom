/* eslint-disable react-refresh/only-export-components */
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useReducer } from "react";
import { auth, db } from "../firebase/firebaseConfig";

// --- Context Creation ---
const CartContext = createContext();

// --- Load Initial State from LocalStorage ---
const getInitialState = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Could not parse cart from localStorage", error);
        return [];
    }
};

// --- Cart Reducer ---
const cartReducer = (state, action) => {
    let newState;

    switch (action.type) {
        // "ADD" now handles both adding new items and incrementing existing ones
        case "ADD": {
            const itemInCart = state.find(item => item.id === action.payload.id);
            if (itemInCart) {
                newState = state.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + action.payload.quantity }
                        : item
                );
            } else {
                newState = [...state, action.payload];
            }
            break;
        }

        case "REMOVE": {
            newState = state.filter((item) => item.id !== action.payload);
            break;
        }

        // New action to handle specific quantity changes from the cart page
        case "UPDATE_QUANTITY": {
            newState = state.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            break;
        }

        // New action to clear the entire cart
        case "CLEAR": {
            newState = [];
            break;
        }
        case "SET_CART":
            newState = action.payload;
            break;

        default:
            throw new Error(`Unknown action-type: ${action.type}`);
    }

    // Persist the new state to localStorage after any change
    localStorage.setItem("cart", JSON.stringify(newState));
    return newState;
};

// --- Cart Provider Component ---
const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, getInitialState());
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                return onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        dispatch({
                            type: "SET_CART",
                            payload: snapshot.data().cart || [],
                        });
                    }
                });
            } else {
                dispatch({ type: "SET_CART", payload: [] });
            }
        });
        return unsubscribe;
    }, []);

    // 🔹 Update Firestore when cart changes
    const updateCartInFirestore = async (newCart) => {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { cart: newCart });
    };

    // 🔹 Wrapper around dispatch to also persist
    const enhancedDispatch = (action) => {
        const newState = cartReducer(cart, action);

        if (
            ["ADD", "REMOVE", "UPDATE_QUANTITY", "CLEAR"].includes(action.type)
        ) {
            updateCartInFirestore(newState);
        }

        dispatch(action);
    };
    return (
        <CartContext.Provider value={{ cart, dispatch: enhancedDispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;

// --- Custom Hook for ease of use ---
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};