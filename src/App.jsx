import Header from './components/Header';
import Footer from './components/Footer';
import { Route, Routes, Router } from 'react-router-dom';
import Home from './pages/Home/Home';
import ProductDetailsPage from './components/ProductDetails';
import ProductListingPage from './pages/Products/ProductLists';
import ReactLenis from 'lenis/react';
import CartPage from './components/Cart';
import CheckoutPage from './components/Checkout';
import WishlistPage from './components/WishList';
import StoreLocation from './pages/StoreLocation/Location';

function App() {


  return (
    <>
    <ReactLenis root/>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductDetailsPage />} />
        <Route path="/all" element={<ProductListingPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/store-locator" element={<StoreLocation />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;