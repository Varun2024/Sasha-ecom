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
import AdminPanel from './Admin/AdminPanel';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import FuzzyText from '../public/404';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsOfUse from './pages/T&C';
import PrivacyPolicy from './pages/Privacy';
import RefundPolicy from './pages/RefundPolicy';
import PaymentStatus from './pages/PaymentStatus';
import MyOrders from './pages/UsersOrders';
import CodCheckoutPage from './components/CodCheckout';


function App() {
  return (
    <>
      <ReactLenis root />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/adminsasha" element={<AdminPanel />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/all" element={<ProductListingPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/store-locator" element={<StoreLocation />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/t&c" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/payment-status/" element={<PaymentStatus />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/cod-checkout" element={<CodCheckoutPage />} />
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