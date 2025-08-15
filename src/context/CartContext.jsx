/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";

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

// --- Cart Reducer with Improved Logic ---
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

    return (
        <CartContext.Provider value={{ cart, dispatch }}>
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