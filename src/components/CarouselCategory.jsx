/* eslint-disable no-unused-vars */
import { motion, useTransform, useScroll } from "framer-motion";
import { nav } from "motion/react-client";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

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

    return (
        <section ref={targetRef} className=" md:h-[300vh] h-[350vh]  ">
            <div className="sticky top-20 md:top-10 flex h-[30%] items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-4">
                    {cards.map((card) => {
                        return <Card card={card} key={card.id} />;
                    })}
                </motion.div>
            </div>
        </section>
    );
};

const Card = ({ card }) => {
    const navigate = useNavigate();
    return (
        <div
            key={card.id}
            className="group relative md:h-[450px] md:w-[450px] h-[300px] w-[350px]  overflow-hidden bg-neutral-200 rounded-4xl"
            onClick={() => navigate(card.href)}
        >
            <div
                style={{
                    backgroundImage: `url(${card.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
            ></div>
            <div className="absolute inset-0 z-10 grid place-content-center">
                <p className="bg-gradient-to-br from-white/20 to-white/0 p-8 text-3xl font-black uppercase text-white backdrop-blur-lg">
                    {card.title}
                </p>
            </div>
        </div>
    );
};

export default ShopByCategory ;

const cards = [
    {
        img: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Men Puffer',
        title: "Top Wear",
        id: 1,
        href: '/top'
    },
    {
        img: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Women Puffer',
        title: "Bottom Wear",
        id: 2,
        href: '/bottom'
    },
    {
        img: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Puffer Bag',
        title: "Inner Wear",
        id: 3,
        href: '/inner'
    },
    {
        img: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Puffer Bag',
        title: "Accessories",
        id: 4,
        href: '/accessories'
    },
    // {
    //     img: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Puffer Bag',
    //     title: "Title 1",
    //     id: 5,
    // },
    // {
    //     img: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Puffer Bag',
    //     title: "Title 1",
    //     id: 6,
    // },
 
];

