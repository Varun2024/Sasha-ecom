
// export default ProductMarquee;

import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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


    let displayImage = 'https://placehold.co/600x800/f8f8f8/cccccc?text=No+Image';
    if (product.variants?.[0]?.imageUrls?.[0]) {
        displayImage = product.variants[0].imageUrls[0];
    } else if (product.imageUrl) {
        displayImage = product.imageUrl;
    }

    return (
        <div className="flex-shrink-0 md:w-64 w-18 mx-6 group cursor-pointer" onClick={() => window.open(`/product/${product.id}`)}>
            <div className="aspect-[3/4] overflow-hidden bg-[#fafafa] relative border border-gray-50">
                <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
            </div>
            <div className="py-5 px-1 text-center space-y-1">
                <h3 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-gray-900 truncate">
                    {product.name}
                </h3>
                <p className="text-[13px] font-medium text-gray-900 uppercase">₹{product.sale}</p>
            </div>
        </div>
    );
}

const DualProductMarquee = ({ currentCategory }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products ordered by ID asc, then we reverse it manually
                const querySnapshot = await getDocs(query(collection(db, "products"), orderBy("id", "asc")));
                let productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                if (currentCategory) {
                    productsData = productsData.filter(p => p.category === currentCategory);
                }

                // Reverse to get the newest first
                setProducts(productsData.reverse());
            } catch (err) {
                setError("Collections currently unavailable.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentCategory]);

    // To create two rows, we split the array
    const rowOne = products.filter((_, idx) => idx % 2 === 0);
    const rowTwo = products.filter((_, idx) => idx % 2 !== 0);

    // Duplicate arrays for seamless looping
    const marqueeRow1 = [...rowOne, ...rowOne, ...rowOne, ...rowOne];
    const marqueeRow2 = [...rowTwo, ...rowTwo, ...rowTwo, ...rowTwo];

    return (
        <section className="bg-white py-24 overflow-hidden border-y border-gray-50">
            {/* Editorial Header */}
            <div className="container mx-auto px-4 mb-16">
                    <div className="text-center">
                        <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3">Curations</h2>
                        <h3 className="text-2xl md:text-3xl font-light tracking-widest uppercase text-gray-900">Discover More {currentCategory ? currentCategory : ''}</h3>
                        <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
                    </div>

            </div>

            {/* Dual Marquee Wrapper */}
            <div className="relative w-full overflow-hidden group space-y-8">
                {/* Edge Fades */}
                <div className="absolute top-0 bottom-0 left-0 md:w-32 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 right-0 md:w-32 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {loading ? (
                    <div className="flex animate-marquee py-4">
                        {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <>
                        {/* Row 1: Normal Direction */}
                        <div className="flex animate-marquee-mobile md:animate-marquee hover:[animation-play-state:paused] py-2">
                            {marqueeRow1.map((product, index) => (
                                <ProductCard key={`${product.id}-r1-${index}`} product={product} />
                            ))}
                        </div>

                        {/* Row 2: Reverse Direction (Optional: adds visual complexity) */}
                        <div className="flex animate-marquee-reverse-mobile md:animate-marquee-reverse hover:[animation-play-state:paused] py-2">
                            {marqueeRow2.map((product, index) => (
                                <ProductCard key={`${product.id}-r2-${index}`} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default DualProductMarquee;