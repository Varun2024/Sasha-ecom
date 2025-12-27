/* eslint-disable no-unused-vars */
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';
import DataContext from '../context/Context';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const NewInSection = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { setProductData } = useContext(DataContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Optimized query fetching only the required 4 items
                const q = query(collection(db, 'products'), orderBy('id', 'desc'), limit(4));  
                const res = await getDocs(q);
                const productsData = res.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching new arrivals:", error);
            }
        }
        fetchProducts();
    }, []);

    const handleClick = (product) => {
        setProductData(product);
        window.open(`/product/${product.id}`);
        localStorage.setItem("productData", JSON.stringify(product));
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
                    
                    {/* LEFT SIDE: FEATURED EDITORIAL TILE (5 columns) */}
                    <div
                        className="lg:col-span-5 relative min-h-[500px] md:min-h-[650px] overflow-hidden group cursor-pointer rounded-sm shadow-sm flex flex-col justify-end p-10"
                        onClick={() => navigate('/all')}
                    >
                        {/* Background Image with subtle scale on hover */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://res.cloudinary.com/doftlqnmi/image/upload/v1758871267/express-uploads/eubjhp0xjxqbz2breakq.png')" }}
                        ></div>
                        
                        {/* Elegant Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        {/* Text Content */}
                        <div className="relative z-10 space-y-4">
                            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-300 font-bold">New Arrival</span>
                            <h2 className="text-white font-light text-5xl md:text-6xl tracking-widest uppercase leading-tight italic">
                                New in <br /> <span className="font-semibold not-italic">House</span>
                            </h2>
                            <div className="pt-6">
                                <button className="inline-block text-[11px] tracking-[0.3em] uppercase text-white border-b border-white pb-2 hover:opacity-70 transition-opacity">
                                    Discover Collection
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: PRODUCT GRID (7 columns) */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                            {products.map((product, index) => (
                                <div
                                    key={product.id || index}
                                    onClick={() => handleClick(product)}
                                    className="cursor-pointer group"
                                >
                                    <ProductCard {...product} />
                                    {/* Sub-label for consistency with editorial look */}
                                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                         <p className="text-[9px] tracking-widest uppercase text-gray-400 font-semibold">View Details</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default NewInSection;