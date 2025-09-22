import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import DataProvider from './context/DataContext.jsx'
import CartProvider from './context/CartContext';

import WishlistProvider from './context/WishlistContext.jsx'
import { AuthProvider } from './context/AuthContext/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename='/'>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <DataProvider>
              <App />
            </DataProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

