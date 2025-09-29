


/* eslint-disable no-unused-vars */
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react"; // ADDED: useState, useEffect
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore"; // ADDED: Firestore imports
import { db } from "../firebase/firebaseConfig"; // ADDED: Adjust this path to your Firebase config

const ShopByCategory = () => {
    return (
        <div className="rounded-4xl mb-8 md:max-w-full mx-4 md:mx-6 bg-[#e0ddd9]">
            <div className=" mt-10 flex flex-col justify-center items-center ">
                <div className="font-semibold uppercase text-neutral-500 mt-10 md:text-7xl text-3xl">
                    Shop By Category
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

    const x = useTransform(scrollYProgress, [0, 1], ["10%", "-45%"]);

    // ADDED: State for dynamic cards and loading
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    // ADDED: Fetch products and derive categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const productsSnapshot = await getDocs(collection(db, "products"));
                const products = productsSnapshot.docs.map(doc => doc.data());

                // Process products to get unique categories with a representative image
                const categoryMap = new Map();
                products.forEach(product => {
                    if (product.category && !categoryMap.has(product.category)) {
                        // Use the first image of the first product found for that category
                        const firstImage = (product.imageUrls && product.imageUrls.length > 0)
                            ? product.imageUrls[0]
                            : 'https://placehold.co/450x450/e0ddd9/cccccc?text=Image+Not+Found';

                        categoryMap.set(product.category, {
                            id: categoryMap.size + 1,
                            title: product.category,
                            img: firstImage,
                            // CHANGED: The href now points to the filtered product list page
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
        <section ref={targetRef} className="md:h-[300vh] h-[350vh]">
            <div className="sticky top-20 md:top-10 flex h-[30%] items-center overflow-hidden">
                {loading ? (
                    <div className="w-full text-center text-neutral-500">Loading Categories...</div>
                ) : (
                    <motion.div style={{ x }} className="flex gap-4">
                        {cards.map((card) => {
                            return <Card card={card} key={card.id} />;
                        })}
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
            // CHANGED: The onClick now uses the dynamic href from the card object
            onClick={() => window.location.href = card.href}
            className="group relative md:h-[450px] md:w-[450px] h-[300px] w-[350px] overflow-hidden bg-neutral-200 rounded-4xl cursor-pointer"
        >
            <div
                style={{
                    backgroundImage: `url(${card.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
            ></div>
            <div className="absolute inset-0 z-10 grid place-content-center bg-black/30">
                <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-3xl font-black uppercase text-white backdrop-blur-lg">
                    {card.title}
                </p>
            </div>
        </div>
    );
};

export default ShopByCategory;