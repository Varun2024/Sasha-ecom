/* eslint-disable no-unused-vars */
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ShopByCategory = () => {
    return (
        <div className="bg-white py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-12 mb-10">
                <div className="flex flex-col">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3 italic">
                        Collections
                    </h2>
                    <h3 className="text-2xl md:text-4xl font-light tracking-widest uppercase text-gray-900">
                        Shop By <span className="font-semibold">Category</span>
                    </h3>
                    <div className="h-[1px] w-12 bg-black mt-6"></div>
                </div>
            </div>
            <HorizontalScrollCarousel />
        </div>
    );
};

const HorizontalScrollCarousel = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Adjusted transform for a smoother "magazine slide" feel
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-60%"]);

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const productsSnapshot = await getDocs(collection(db, "products"));
                const products = productsSnapshot.docs.map(doc => doc.data());

                const categoryMap = new Map();
                products.forEach(product => {
                    if (product.category && !categoryMap.has(product.category)) {
                        const firstImage = (product.imageUrls && product.imageUrls.length > 0)
                            ? product.imageUrls[0]
                            : 'https://placehold.co/600x800/fafafa/cccccc?text=Atelier';

                        categoryMap.set(product.category, {
                            id: categoryMap.size + 1,
                            title: product.category,
                            img: firstImage,
                            href: `/all?category=${encodeURIComponent(product.category)}`
                        });
                    }
                });
                
                setCards(Array.from(categoryMap.values()));
            } catch (error) {
                console.error("Error fetching categories: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-white">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                {loading ? (
                    <div className="w-full text-center text-[10px] tracking-widest uppercase text-gray-400 animate-pulse">
                        Loading Atelier Categories...
                    </div>
                ) : (
                    <motion.div style={{ x }} className="flex gap-6 pl-4 md:pl-12">
                        {cards.map((card) => (
                            <Card card={card} key={card.id} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

const Card = ({ card }) => {
    const navigate = useNavigate();
    return (
        <div
            key={card.id}
            onClick={() => navigate(card.href)}
            className="group relative md:h-[550px] md:w-[400px] h-[400px] w-[300px] overflow-hidden bg-[#fafafa] rounded-sm cursor-pointer border border-gray-50"
        >
            {/* Image Layer */}
            <div
                style={{
                    backgroundImage: `url(${card.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105"
            ></div>
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Title Layer - Positioned at bottom like a magazine label */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-10">
                <p className="text-white text-[10px] tracking-[0.4em] uppercase font-bold mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    Explore
                </p>
                <h4 className="text-white text-2xl md:text-3xl font-light tracking-widest uppercase">
                    {card.title}
                </h4>
                <div className="w-0 group-hover:w-12 h-[1px] bg-white mt-4 transition-all duration-700"></div>
            </div>
        </div>
    );
};

export default ShopByCategory;