import React, { useState } from 'react';

// You can install this icon library with: npm install lucide-react
import { ChevronDown, ShoppingCart, Star } from 'lucide-react';

// --- Mock Product Data ---
// In a real application, you would fetch this data from an API.
const products = [
  {
    id: 1,
    name: 'Classic White Tee',
    category: 'Apparel',
    price: 29.99,
    rating: 4.5,
    reviewCount: 120,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'Modern Leather Watch',
    category: 'Accessories',
    price: 149.99,
    rating: 4.8,
    reviewCount: 85,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    price: 350.00,
    rating: 4.7,
    reviewCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 199.50,
    rating: 4.9,
    reviewCount: 350,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'Stainless Steel Water Bottle',
    category: 'Kitchen',
    price: 24.99,
    rating: 4.6,
    reviewCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
  {
    id: 6,
    name: 'Organic Cotton Throw Blanket',
    category: 'Home Goods',
    price: 79.00,
    rating: 4.7,
    reviewCount: 60,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
  {
    id: 7,
    name: 'Smart Fitness Tracker',
    category: 'Electronics',
    price: 89.99,
    rating: 4.4,
    reviewCount: 150,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
  {
    id: 8,
    name: 'Gourmet Coffee Bean Sampler',
    category: 'Kitchen',
    price: 45.00,
    rating: 4.9,
    reviewCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
  },
];

// --- Product Card Component ---
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-64 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/f8f8f8/cccccc?text=Image+Not+Found'; }}
          onClick={() => window.location.href = `/product`}
        />
        <div className="absolute top-2 left-2 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
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
          <button className="flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-700 transition-colors duration-300">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Product Listing Page Component ---
export default function ProductListingPage() {
  const [sortOption, setSortOption] = useState('featured');

  // NOTE: In a real app, you'd apply sorting logic here based on 'sortOption'
  const sortedProducts = [...products]; // Placeholder for sorting

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Explore Our Collection
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Find the perfect items to fit your style. High-quality products, curated just for you.
          </p>
        </header>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 p-4 bg-white rounded-lg shadow-sm">
          <div className="text-gray-600 mb-4 md:mb-0">
            Showing <span className="font-semibold text-gray-800">{products.length}</span> products
          </div>
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Sort by: Price Low to High</option>
              <option value="price-desc">Sort by: Price High to Low</option>
              <option value="rating">Sort by: Customer Rating</option>
              <option value="newest">Sort by: Newest</option>
            </select>
            <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Product Grid */}
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>

        {/* Pagination (Optional) */}
        <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
                <a href="#" className="px-4 py-2 text-gray-500 bg-white rounded-lg hover:bg-gray-100">Previous</a>
                <a href="#" className="px-4 py-2 text-white bg-gray-900 rounded-lg">1</a>
                <a href="#" className="px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-100">2</a>
                <a href="#" className="px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-100">3</a>
                <span className="px-4 py-2 text-gray-500">...</span>
                <a href="#" className="px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-100">10</a>
                <a href="#" className="px-4 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-100">Next</a>
            </nav>
        </div>

      </div>
    </div>
  );
}
