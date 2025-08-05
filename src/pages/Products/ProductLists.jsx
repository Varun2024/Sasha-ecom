import React, { useContext, useState, useMemo } from 'react';

// You can install this icon library with: npm install lucide-react
import { ChevronDown, ShoppingCart, Star, X, Filter } from 'lucide-react';

import DataContext from '../../context/Context';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Toastify } from 'toastify';
// --- Mock Product Data (Unchanged) ---
const products = [
  // ... (same product data as in the prompt)
  {
    id: 1,
    name: 'Classic White Tee',
    category: 'TopWear',
    price: 29.99,
    rating: 4.5,
    reviewCount: 120,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    quantity: 1,
  },
  {
    id: 2,
    name: 'Modern Leather Watch',
    category: 'Accessories',
    price: 149.99,
    rating: 4.8,
    reviewCount: 85,
    imageUrl: 'https://images.unsplash.com/photo-1620625515032-6ed0a1739554?w=600&h=800&fit=crop',
    quantity: 1,
  },
  {
    id: 3,
    name: 'Slim Fit Jeans',
    category: 'BottomWear',
    price: 89.99,
    rating: 4.7,
    reviewCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1602293589914-9FF0554c671e?w=600&h=800&fit=crop',
    quantity: 1,
  },
  {
    id: 4,
    name: 'Quilted Bomber Jacket',
    category: 'OuterWear',
    price: 199.50,
    rating: 4.9,
    reviewCount: 350,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d919b5ca2373?w=600&h=800&fit=crop',
    quantity: 1,
  },
  {
    id: 5,
    name: 'Minimalist Chronograph',
    category: 'Accessories',
    price: 224.99,
    rating: 4.6,
    reviewCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=800&fit=crop',
    quantity: 1,
  },
  {
    id: 6,
    name: 'ComfortFit Trunks',
    category: 'InnerWear',
    price: 39.00,
    rating: 4.7,
    reviewCount: 60,
    imageUrl: 'https://images.unsplash.com/photo-1612213799326-c43a70921434?w=600&h=800&fit=crop',
    quantity: 1,
  },
  {
    id: 7,
    name: 'Performance Crew Socks',
    category: 'Accessories',
    price: 19.99,
    rating: 4.4,
    reviewCount: 150,
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=800&fit=crop',
    quantity: 1,
  },
  {
    id: 8,
    name: 'Linen Casual Shirt',
    category: 'TopWear',
    price: 75.00,
    rating: 4.9,
    reviewCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2f31b26e8aa?w=600&h=800&fit=crop',
  },
];

const allCategories = [...new Set(products.map(p => p.category))];



// --- Product Card Component (with bug fix) ---
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { setProductData } = useContext(DataContext);
  const { cart, dispatch } = useCart();
  const addCartItem = (item) => {
    dispatch({ type: 'ADD', payload: { ...item } });
  };

  const handleProductClick = () => {
    const productInfo = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      rating: product.rating,
      reviewCount: product.reviewCount,
      imageUrl: product.imageUrl,
    };
    setProductData(productInfo);
    localStorage.setItem('productData', JSON.stringify(productInfo));
    navigate(`/product`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl group">
      <div className="relative cursor-pointer" onClick={handleProductClick}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-80 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x800/f8f8f8/cccccc?text=Image+Not+Found'; }}
        />
        <div className="absolute top-2 left-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
        <div className="flex items-center mt-1">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : ''}`} />
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">({product.reviewCount} reviews)</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => { addCartItem(product); console.log(cart); ; }}
            className="flex items-center justify-center bg-gray-900 text-white px-3 py-2 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors duration-300">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Product Listing Page Component (Optimized) ---
export default function ProductListingPage() {
  const [sortOption, setSortOption] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // For mobile filter toggle

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Performance: Memoize the filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Sort products
    if (sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'newest') {
      // "newest" would typically rely on a timestamp, here we just reverse the original order
      filtered.reverse();
    }
    return filtered;
  }, [sortOption, selectedCategories]);


  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <header className="text-center mb-12 mt-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Explore Our Collection
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Find the perfect items to fit your style. High-quality products, curated just for you.
          </p>
        </header>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md text-gray-700 font-semibold"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? 'Hide' : 'Show'} Filters & Sort
          </button>
        </div>


        <div className="flex flex-col md:flex-row items-start gap-8 w-full">
          {/* Filters and Sorting Panel */}
          <aside className={`w-full md:w-1/4 lg:w-1/5 p-6 bg-white rounded-lg shadow-md md:sticky md:top-24
                        ${showFilters ? 'block' : 'hidden'} md:block`}>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <md:hidden
                onClick={() => setShowFilters(false)}
                className="md:hidden cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-600" />
              </md:hidden>
            </div>

            {/* Sort Dropdown */}
            <div className="mb-6">
              <label htmlFor="sort-options" className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <div className="relative">
                <select
                  id="sort-options"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">Newest</option>
                </select>
                <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <div className="space-y-2">
                {allCategories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">{category}</label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className='w-full md:w-3/4 lg:w-4/5'>
            <div className="mb-4 text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredAndSortedProducts.length}</span> of <span className="font-bold text-gray-900">{products.length}</span> products
            </div>
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">No Products Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
              </div>
            )}
          </main>
        </div>

        {/* Pagination (Unchanged, but now more responsive due to flex-wrap) */}
        <div className="flex flex-wrap justify-center mt-12">
          <nav className="flex items-center space-x-2">
            {/* ... pagination links ... */}
          </nav>
        </div>
      </div>
    </div>
  );
}