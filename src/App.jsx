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

function App() {


  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductDetailsPage />} />
        <Route path="/all" element={<ProductListingPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;