import Header from './components/Header';
import Hero from './components/Hero';
import NewInSection from './components/NewInSection';
import SaleSection from './components/SaleSection';
import InstagramSection from './components/InstagramSection';
import Footer from './components/Footer';
import { Route, Routes, Router } from 'react-router-dom';
import Home from './pages/Home/Home';
import ProductCard from './components/ProductCard';
import ProductDetailsPage from './components/ProductDetails';
import ProductListingPage from './pages/Products/ProductLists';
import ReactLenis from 'lenis/react';
import CartPage from './components/Cart';
import CartProvider from './context/CartContext';

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
      </Routes>
      <Footer />
    </>
  );
}

export default App;