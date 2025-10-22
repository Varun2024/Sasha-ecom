

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // 1. IMPORT useSearchParams
// --- Firebase and Data ---
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// --- Contexts ---
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

// --- UI Libraries ---
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronDown, ShoppingCart, Star, X, Filter, Heart } from 'lucide-react';

// --- Product Card Skeleton (Unchanged) ---
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-80 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
      <div className="flex items-center mt-2">
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-10 w-2/5 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// --- Product Card Component (Upgraded) ---
const ProductCard = ({ product, addCartItem, addWishlistItem, wishlist }) => {


  const isWishlisted = useMemo(() =>
    wishlist.some(item => item.id === product.id),
    [wishlist, product.id]
  );

  const handleProductClick = () => {
    window.location.href = `/product/${product.id}`; // Force full page reload
  };

  // CHANGED: Logic to handle both imageUrls array and single imageUrl string for backward compatibility.
  let displayImage = 'https://placehold.co/600x800/f8f8f8/cccccc?text=Image+Not+Found'; // Default fallback
  if (product.imageUrls && product.imageUrls.length > 0) {
    // Use the first image from the new array structure
    displayImage = product.imageUrls[0];
  } else if (product.imageUrl) {
    // Fallback to the old single imageUrl field if the array doesn't exist
    displayImage = product.imageUrl;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl group flex flex-col">
      <div className="relative">
        <div className="cursor-pointer" onClick={handleProductClick}>
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </div>
        <div className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{product.category}</div>
        <button
          onClick={() => addWishlistItem(product)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-600 hover:scale-110 transition-all duration-200"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'hover:text-red-500'}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="md:text-lg  font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center text-yellow-500">{[...Array(5)].map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : ''}`} />))}
            </div>
            <span className="text-gray-500 text-xs md:text-sm ml-2">({product.reviewCount || 0} reviews)</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-1">
            <span className="md:text-2xl text-2xs font-bold text-gray-900">₹{product.sale}</span>
            {product.mrp && <span className="line-through text-gray-500 text-xs md:text-sm">₹{product.mrp}</span>}
          </div>
          <button
            onClick={() => addCartItem(product)}
            className="flex items-center justify-center bg-gray-900 text-white px-2 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm hover:bg-gray-700 transition-colors duration-300"
          >
            <ShoppingCart className="w-4 h-4 md:mr-2" /> <span className='text-xs md:text-sm'> Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Product Listing Page Component (Unchanged from your version) ---
export default function ProductListingPage() {
  // ... all the state and logic from your provided code remains the same ...
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  // const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(5000);
  const { dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState(
    initialCategory ? [initialCategory] : []
  );

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
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const allCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]
      .filter(p => (Number(p.sale) || 0) <= priceRange)
      .filter(p => selectedCategories.length === 0 || selectedCategories.includes(p.category));

    // This logic will now automatically apply the filter from the URL on the first render
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    switch (sortOption) {
      case 'price-asc': filtered.sort((a, b) => (Number(a.sale) || 0) - (Number(b.sale) || 0)); break;
      case 'price-desc': filtered.sort((a, b) => (Number(b.sale) || 0) - (Number(a.sale) || 0)); break;
      case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'newest': filtered.reverse(); break;
      default: break;
    }
    return filtered;
  }, [sortOption, selectedCategories, products, priceRange]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange(maxPrice);
    setSortOption('featured');
  };

  const addCartItem = (product) => {
    if (!product.selectedSize || !product.selectedColor) {
      toast.error("Please select a size and color before adding to cart.");
      return;
    }

    cartDispatch({ type: 'ADD', payload: { ...product, quantity: 1 } });
    toast.success(`${product.name} added to cart!`);
  };

  const addWishlistItem = (product) => {
    const isWishlisted = wishlist.some(item => item.id === product.id);
    if (isWishlisted) {
      wishlistDispatch({ type: 'REMOVE_ITEM', payload: product.id });
      toast.error(`${product.name} removed from wishlist.`);
    } else {
      wishlistDispatch({ type: 'ADD_ITEM', payload: product });
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar={true} theme='dark' />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12 mt-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Explore Our Collection
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Find the perfect items to fit your style.
          </p>
        </header>
        <div className="md:hidden mb-4">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md text-gray-700 font-semibold">
            <Filter className="w-5 h-5" />{showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>
        <div className="flex flex-col md:flex-row items-start gap-8 w-full">
          <aside className={`w-full md:w-1/4 lg:w-1/5 p-6 bg-white rounded-lg shadow-md md:sticky md:top-24 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="md:hidden cursor-pointer"><X className="w-6 h-6 text-gray-600" /></button>
            </div>
            <div className="mb-6">
              <label htmlFor="sort-options" className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <div className="relative">
                <select id="sort-options" value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
              <div className="space-y-2">
                <input type="range" min="0" max={maxPrice} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹0</span>
                  <span>Up to ₹{priceRange}</span>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <div className="space-y-2">
                {allCategories.map(category => (
                  <div key={category} className="flex items-center">
                    <input id={`category-${category}`} type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">{category.toUpperCase()}</label>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleClearFilters} className="w-full text-sm text-center text-gray-500 hover:text-gray-800 font-medium">
              Clear All Filters
            </button>
          </aside>
          <main className='w-full md:w-3/4 lg:w-4/5'>
            {selectedCategories.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Active:</span>
                {selectedCategories.map(cat => (
                  <div key={cat} className="flex items-center gap-1.5 bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {cat} <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryChange(cat)} />
                  </div>
                ))}
              </div>
            )}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : (
              <>
                
                {filteredAndSortedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} addCartItem={addCartItem} addWishlistItem={addWishlistItem} wishlist={wishlist} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}