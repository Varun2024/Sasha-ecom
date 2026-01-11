import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Helper Component: Elegant Loading Skeleton
const ProductCardSkeleton = () => (
    <div className="bg-white border border-gray-100 animate-pulse">
        <div className="aspect-[3/4] bg-gray-100"></div>
        <div className="p-4 space-y-3 text-center">
            <div className="h-3 bg-gray-100 mx-auto w-3/4"></div>
            <div className="h-3 bg-gray-100 mx-auto w-1/2"></div>
        </div>
    </div>
);

// Helper Component: Minimalist Product Card
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    
    let displayImage = 'https://placehold.co/600x800/f8f8f8/cccccc?text=No+Image';
    if (product.variants && product.variants.length > 0 && product.variants[0].imageUrls && product.variants[0] &&  product.variants[0].imageUrls.length > 0) {
        displayImage = product.variants[0].imageUrls[0] ;
    } else if (product.imageUrls && product.imageUrls.length > 0) {
        displayImage = product.imageUrls[0];
    }

    return (
        <div className="group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="aspect-[3/4] overflow-hidden bg-[#fafafa] relative border border-gray-50">
                <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                {product.sale < product.mrp && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1">
                        <p className="text-[9px] tracking-widest font-bold uppercase text-gray-900 italic">Limited</p>
                    </div>
                )}
            </div>
            <div className="py-4 text-center space-y-1">
                <h3 className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase font-semibold text-gray-900 truncate px-2">
                    {product.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                    <p className="text-xs md:text-sm font-medium text-gray-900 uppercase">₹{product.sale}</p>
                    {product.mrp > product.sale && (
                        <p className="text-[10px] text-gray-400 line-through font-light italic">₹{product.mrp}</p>
                    )}
                </div>
            </div>
        </div>
    );
}



const MoreLikeProducts = ({ currentCategory, currentProductId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Querying products
                const querySnapshot = await getDocs(query(collection(db, "products"), orderBy("id", "desc")));
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Filter by category and exclude the product the user is currently viewing
                const filteredProducts = productsData.filter(product => 
                    product.category === currentCategory && product.id !== currentProductId
                );
                
                setProducts(filteredProducts);
            } catch (err) {
                setError("Collections currently unavailable.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentCategory, currentProductId]);

    return (
        <section className="bg-white py-16 border-t border-gray-100">
            {/* Editorial Header */}
            <div className="container mx-auto px-4 mb-12">
                <div className="text-center">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-2 italic">Recommendations</h2>
                    <h3 className="text-xl md:text-2xl font-light tracking-widest uppercase text-gray-900">
                        More in {currentCategory}
                    </h3>
                    <div className="h-[1px] w-10 bg-black mx-auto mt-4"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-5xl">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : error ? (
                    <p className="w-full text-center text-[11px] tracking-widest text-red-400 uppercase">{error}</p>
                ) : products.length === 0 ? (
                    <p className="w-full text-center text-[10px] tracking-[0.2em] text-gray-400 uppercase italic">No similar pieces found.</p>
                ) : (
                    /* The Grid: 2 columns on mobile, 4 columns on medium screens and up */
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MoreLikeProducts;