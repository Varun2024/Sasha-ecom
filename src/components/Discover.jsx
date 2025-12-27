import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Helper Component: Elegant Loading Skeleton
const ProductCardSkeleton = () => (
    <div className="flex-shrink-0 w-64 mx-6 bg-white border border-gray-100 animate-pulse">
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
    if (product.imageUrls && product.imageUrls.length > 0) {
        displayImage = product.imageUrls[0];
    } else if (product.imageUrl) {
        displayImage = product.imageUrl;
    }

    return (
        <div className="flex-shrink-0 w-64 mx-6 group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="aspect-[3/4] overflow-hidden bg-[#fafafa] relative border border-gray-50">
                <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                {/* Subtle Overlay Badge */}
                {product.sale < product.mrp && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1">
                        <p className="text-[10px] tracking-widest font-bold uppercase text-gray-900 italic">Limited</p>
                    </div>
                )}
            </div>
            <div className="py-5 px-1 text-center space-y-1">
                <h3 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-gray-900 truncate">
                    {product.name}
                </h3>
                <div className="flex items-center justify-center gap-3">
                    <p className="text-[13px] font-medium text-gray-900 uppercase">₹{product.sale}</p>
                    {product.mrp > product.sale && (
                        <p className="text-[11px] text-gray-400 line-through font-light italic">₹{product.mrp}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const ProductMarquee = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
            } catch (err) {
                setError("Collections currently unavailable.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const marqueeProducts = products.length > 0 ? [...products, ...products, ...products] : [];

    return (
        <section className="bg-white py-24 overflow-hidden border-y border-gray-50">
            {/* Editorial Header */}
            <div className="container mx-auto px-4 mb-16">
                <div className="text-center">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3 italic">Curations</h2>
                    <h3 className="text-2xl md:text-3xl font-light tracking-widest uppercase text-gray-900">Discover More</h3>
                    <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
                </div>
            </div>

            {/* Marquee Wrapper */}
            <div className="relative w-full overflow-hidden group">
                {/* Edge Fades */}
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <div className="flex animate-marquee hover:[animation-play-state:paused] py-4">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                    ) : error ? (
                        <p className="w-full text-center text-[11px] tracking-widest text-red-400 uppercase">{error}</p>
                    ) : (
                        marqueeProducts.map((product, index) => (
                            <ProductCard key={`${product.id}-${index}`} product={product} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductMarquee;