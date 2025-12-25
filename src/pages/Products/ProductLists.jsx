/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronDown, X, Filter, Heart, ArrowRight } from 'lucide-react';

// --- Minimalist Product Card ---
const ProductCard = ({ product, addWishlistItem, wishlist }) => {
  const navigate = useNavigate();
  const isWishlisted = useMemo(() =>
    wishlist.some(item => item.id === product.id),
    [wishlist, product.id]
  );

  let displayImage = 'https://placehold.co/600x800/f8f8f8/cccccc?text=No+Image';
  if (product.variants?.[0]?.imageUrls?.[0]) {
    displayImage = product.variants[0].imageUrls[0];
  } else if (product.imageUrls?.[0]) {
    displayImage = product.imageUrls[0];
  }

  return (
    <div className="group flex flex-col bg-white animate-in fade-in duration-700">
      <div className="relative overflow-hidden bg-[#fafafa] aspect-[3/4]">
        <div 
          className="cursor-pointer h-full w-full" 
          onClick={() => navigate(`/product/${product.id}`)}
        >
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
          />
        </div>
        
        {/* Subtle Heart Overlay */}
        <button
          onClick={() => addWishlistItem(product)}
          className="absolute top-4 right-4 p-2 transition-all duration-300"
        >
          <Heart 
            size={20} 
            strokeWidth={1.5}
            className={`${isWishlisted ? 'fill-black text-black' : 'text-gray-400 hover:text-black'}`} 
          />
        </button>

        {/* Quick View Link (Mobile Hidden) */}
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
           <button 
             onClick={() => navigate(`/product/${product.id}`)}
             className="w-full bg-white/90 backdrop-blur-sm text-black py-3 text-[10px] tracking-[0.2em] font-bold uppercase border border-gray-100 shadow-sm"
           >
             View Atelier Details
           </button>
        </div>
      </div>

      <div className="py-4 px-1 space-y-1">
        <p className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-semibold">{product.category}</p>
        <h3 className="text-sm font-medium tracking-wide text-gray-900 uppercase truncate">{product.name}</h3>
        <div className="flex items-center gap-3 pt-1">
          <span className="text-sm font-semibold text-gray-900">₹{product.sale}</span>
          {product.mrp && <span className="line-through text-gray-400 text-xs font-light">₹{product.mrp}</span>}
        </div>
      </div>
    </div>
  );
};

// --- Main Listing Page ---
export default function ProductListingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(5000);
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get('category');
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsData);
        if (productsData.length > 0) {
          const max = Math.ceil(Math.max(...productsData.map(p => Number(p.mrp) || 0)));
          setMaxPrice(max);
          setPriceRange(max);
        }
      } catch (error) { toast.error("Error connecting to collections."); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, []);

  const allCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]
      .filter(p => (Number(p.sale) || 0) <= priceRange)
      .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category));

    switch (sortOption) {
      case 'price-asc': filtered.sort((a, b) => (Number(a.sale) || 0) - (Number(b.sale) || 0)); break;
      case 'price-desc': filtered.sort((a, b) => (Number(b.sale) || 0) - (Number(a.sale) || 0)); break;
      case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }
    return filtered;
  }, [sortOption, selectedCategories, products, priceRange]);

  const addWishlistItem = (product) => {
    const isWishlisted = wishlist.some(item => item.id === product.id);
    if (isWishlisted) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
      toast.info("REMOVED FROM CURATION", { theme: 'light' });
    } else {
      wishlistDispatch({ type: 'ADD_ITEM', payload: product });
      toast.success("ADDED TO CURATION", { theme: 'light' });
    }
  };

  return (
    <div className="bg-white min-h-screen pt-12 pb-20 font-light">
      <ToastContainer position="bottom-center" autoClose={1500} hideProgressBar theme="light" />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-20">
        {/* Editorial Header */}
        <header className="text-center mb-16">
          <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3 italic">Discover</h2>
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.1em] text-gray-900 uppercase">The <span className="font-semibold">Collections</span></h1>
          <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          
          {/* Sidebar Filters */}
          <aside className={`lg:col-span-3 space-y-10 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="space-y-8 sticky top-32">
              
              {/* Sort Section */}
              <div className="space-y-4">
                <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900 border-b border-gray-100 pb-3">Refine By</h3>
                <select 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-transparent text-[12px] uppercase tracking-widest outline-none cursor-pointer py-2 border-b border-transparent focus:border-black transition-all"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Category Section */}
              <div className="space-y-4">
                <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900">Categories</h3>
                <div className="flex flex-col gap-3">
                  {allCategories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(cat)}
                        onChange={() => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                        className="w-3 h-3 accent-black border-gray-200"
                      />
                      <span className="text-[11px] uppercase tracking-widest text-gray-500 group-hover:text-black transition-colors">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4 pt-4">
                <h3 className="text-[11px] tracking-[0.3em] uppercase font-bold text-gray-900">Price Cap</h3>
                <input 
                  type="range" min="0" max={maxPrice} value={priceRange} 
                  onChange={(e) => setPriceRange(Number(e.target.value))} 
                  className="w-full accent-black h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                />
                <div className="flex justify-between text-[10px] tracking-widest text-gray-400 uppercase">
                  <span>₹0</span>
                  <span className="text-black font-medium">Up to ₹{priceRange}</span>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedCategories([]); setPriceRange(maxPrice); }}
                className="text-[9px] tracking-[0.3em] uppercase text-gray-400 hover:text-black underline underline-offset-4 transition-all"
              >
                Reset All
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-9">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-8 border-y border-gray-100 py-4 flex justify-between items-center">
              <button onClick={() => setShowFilters(!showFilters)} className="text-[11px] tracking-[0.2em] uppercase font-bold flex items-center gap-2">
                <Filter size={14} /> {showFilters ? 'Close Filters' : 'Filter & Sort'}
              </button>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">{filteredAndSortedProducts.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                {[...Array(6)].map((_, i) => (
                   <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-x-10 md:gap-y-16">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} addWishlistItem={addWishlistItem} wishlist={wishlist} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center space-y-4">
                <p className="text-[11px] tracking-[0.4em] uppercase text-gray-400">No pieces found in this range</p>
                <button onClick={() => setPriceRange(maxPrice)} className="text-xs uppercase underline underline-offset-8 font-medium">Clear All Filters</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}