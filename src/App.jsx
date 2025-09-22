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
import AdminPanel from './admin/AdminPanel';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import FuzzyText from '../public/404';


function App() {
  return (
    <>
      <ReactLenis root />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/all" element={<ProductListingPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/store-locator" element={<StoreLocation />} />
        <Route path="*" element={
          <div 
          className='w-full h-[50vh] flex items-center justify-center'>
            <FuzzyText
            baseIntensity={0.3}
            hoverIntensity={0.5}
            enableHover={true}
          >
            404 - Not Found
          </FuzzyText>
          </div>
        } />
      </Routes>
      <Footer />
    </>
  );
}

export default App;