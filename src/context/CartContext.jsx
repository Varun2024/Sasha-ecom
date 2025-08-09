/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useReducer } from "react";


// context creation
const cartContext = createContext()

const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            localStorage.setItem("cart", JSON.stringify([...state, action.payload]))
            return [...state, action.payload]

        case "INC":
            return state.map(item => item.id === action.payload ? { ...item, qty: item.qty + 1 } : item)
        case "DEC":

            return state.map(item =>
                item.id === action.payload
                    ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 }
                    : item
            );

        case "REMOVE":
            localStorage.setItem("cart", JSON.stringify(state.filter((item) => item.id !== action.payload)))
            localStorage.setItem("cartCount", JSON.stringify(state.length - 1))
            return state.filter((item) => item.id !== action.payload)
        default:
            throw new Error(`Unknown action-type: ${action.type}`)
    }

}

const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [])

    return (
        // value passing throught cartcontext via contextProvider
        <cartContext.Provider value={{ cart, dispatch }}>
            {children}
        </cartContext.Provider>
    )
}

export default CartProvider;

// custom hook for ease of use - good practice
export const useCart = () => {
    // context consumption
    const context = useContext(cartContext)
    if (!context) {
        throw new Error("useCart must be within a cartprovider")
    }
    return context
}