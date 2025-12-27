/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { ArrowRight } from 'lucide-react';

const AUTO_DELAY = 8000;
const DRAG_BUFFER = 50;
const SPRING_OPTIONS = {
    type: "spring",
    mass: 3,
    stiffness: 400,
    damping: 50,
};

export const Hero = () => {
    const [slides, setSlides] = useState([]);
    const [description, setDescription] = useState("");
    const [imgIndex, setImgIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const dragX = useMotionValue(0);

    useEffect(() => {
        const fetchLatestCollection = async () => {
            try {
                const q = query(
                    collection(db, "collections"),
                    orderBy("createdAt", "desc"),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const latestCollection = querySnapshot.docs[0].data();
                    setSlides(latestCollection.imageUrls || []);
                    setDescription(latestCollection.description || "The New Season");
                }
            } catch (err) {
                console.error("Error fetching latest collection:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatestCollection();
    }, []);

    useEffect(() => {
        const intervalRef = setInterval(() => {
            const x = dragX.get();
            if (x === 0 && slides.length > 0) {
                setImgIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }
        }, AUTO_DELAY);
        return () => clearInterval(intervalRef);
    }, [dragX, slides.length]);

    const onDragEnd = () => {
        const x = dragX.get();
        if (x <= -DRAG_BUFFER && imgIndex < slides.length - 1) {
            setImgIndex((prev) => prev + 1);
        } else if (x >= DRAG_BUFFER && imgIndex > 0) {
            setImgIndex((prev) => prev - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[70vh] md:h-[90vh] bg-[#fafafa] flex items-center justify-center">
                <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 animate-pulse italic">
                    Loading Atelier...
                </span>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden h-[75vh] md:h-[90vh] bg-white">
            {/* BACKGROUND SLIDER */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x: dragX }}
                animate={{ translateX: `-${imgIndex * 100}%` }}
                transition={SPRING_OPTIONS}
                onDragEnd={onDragEnd}
                className="flex h-full w-full cursor-grab items-center active:cursor-grabbing"
            >
                {slides.map((url, idx) => (
                    <div
                        key={idx}
                        className="relative w-full h-full shrink-0 overflow-hidden"
                    >
                        <motion.div 
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 10, ease: "easeOut" }}
                            style={{
                                backgroundImage: `url(${url})`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                            }}
                            className="w-full h-full"
                        />
                        {/* Subtle Editorial Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent md:from-black/50" />
                    </div>
                ))}
            </motion.div>

            {/* TEXT OVERLAY */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-24 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-xl space-y-6"
                >
                    <span className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold text-white/80 block mb-2 italic">
                        New Collection
                    </span>
                    <h1 className="text-white text-4xl md:text-7xl lg:text-8xl font-light uppercase tracking-tight leading-[0.9] italic">
                        {description.split(' ').map((word, i) => (
                            <span key={i} className={i % 2 !== 0 ? "font-semibold not-italic" : ""}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>
                    <p className="text-sm md:text-lg tracking-widest uppercase font-light text-white/70 max-w-sm">
                        Curated essential apparel for the modern wardrobe.
                    </p>
                    <div className="pt-6 pointer-events-auto">
                        <a 
                            href="/all" 
                            className="group inline-flex items-center gap-4 bg-white text-black px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500 rounded-sm"
                        >
                            Shop Now
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* MINIMALIST INDICATORS */}
            <div className="absolute bottom-10 left-6 md:left-24 z-20 flex items-center gap-6">
                <div className="flex gap-3">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setImgIndex(idx)}
                            className="group relative h-8 w-1"
                        >
                            <div className={`h-full w-full transition-all duration-500 ${
                                idx === imgIndex ? "bg-white" : "bg-white/20 group-hover:bg-white/40"
                            }`} />
                        </button>
                    ))}
                </div>
                <span className="text-[10px] tracking-[0.3em] text-white/50 font-bold uppercase">
                    0{imgIndex + 1} / 0{slides.length}
                </span>
            </div>
        </div>
    );
};

export default Hero;