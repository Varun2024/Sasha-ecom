import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
// Helper Component: Loading skeleton for product cards
const ProductCardSkeleton = () => (
    <div className="flex-shrink-0 w-64 mx-4 bg-gray-200 rounded-xl animate-pulse">
        <div className="h-40 bg-gray-300 rounded-t-xl"></div>
        <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    </div>
);

// Helper Component: Actual Product Card
const ProductCard = ({ product }) => {
    const discountPercentage = Math.round(((product.mrp - product.sale) / product.mrp) * 100) || 0;
    return (
        <div className="flex-shrink-0 w-80 h-80 mx-4 bg-white rounded-xl shadow-md overflow-hidden group">
            <div className="h-40 overflow-hidden">
                <img
                    onClick={() => window.location.href = `/product/${product.id}`}
                    src={product.imageUrls && product.imageUrls[0] || 'https://placehold.co/600x400/F1F5F9/334155?text=Product'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/F1F5F9/334155?text=Product'; }}
                />
            </div>
            <div className="p-4" >
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name || 'Product Name'}</h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-lg text-gray-800">₹{product.sale?.toLocaleString('en-IN') || '0.00'}</p>
                    <p className='text-sm line-through text-gray-500'>₹{product.mrp}</p>
                    <p className='text-sm text-green-600'>{discountPercentage}% Off</p>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---
const ProductMarquee = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (!db) {
            setLoading(false);
            setError("Firestore database instance is not available.");
            return;
        }

        const fetchProducts = async () => {
            try {
                const productsCollectionRef = collection(db, "products");
                const querySnapshot = await getDocs(productsCollectionRef);
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    // To create a seamless loop, we duplicate the products array.
    const marqueeProducts = products.length > 0 ? [...products, ...products] : [];

    const renderMarqueeContent = () => {
        if (loading) {
            // Display 8 skeletons while loading
            return (
                <div className="flex">
                    {Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)}
                </div>
            );
        }
        if (error) {
            return <p className="text-red-500 text-center py-10">{error}</p>;
        }
        if (products.length === 0) {
            return <p className="text-gray-500 text-center py-10">No products to display.</p>;
        }
        // The `animate-marquee` class will apply the scrolling animation
        return (
            <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
                {marqueeProducts.map((product, index) => (
                    <ProductCard key={`${product.id}-${index}`} product={product} />
                ))}

            </div>

        );
    };

    return (
        <section className="mx-4 rounded-3xl my-10 bg-gray-200 py-12 sm:py-16 h-screen justify-center flex flex-col">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl md:text-8xl font-bold text-center text-gray-800 mb-8">
                    Discover Our Products
                </h2>
            </div>
            <div className="relative w-full overflow-hidden group">
                {/* Fades on the edges for a clean look */}
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

                {renderMarqueeContent()}
            </div>
        </section>
    );
};

export default ProductMarquee;
