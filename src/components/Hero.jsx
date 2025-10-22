/* eslint-disable no-unused-vars */


import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

// --- Animation & Delay Constants ---
const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 8; // Shortened for better user experience
const DRAG_BUFFER = 50;
const SPRING_OPTIONS = {
    type: "spring",
    mass: 3,
    stiffness: 400,
    damping: 50,
};

// --- Main Hero Component ---
export const Hero = () => {
    // State for the images and description of the single latest collection
    const [slides, setSlides] = useState([]);
    const [description, setDescription] = useState("");
    const [imgIndex, setImgIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const dragX = useMotionValue(0);

    // ✅ 1. Fetch ONLY the latest collection from Firestore
    useEffect(() => {
        const fetchLatestCollection = async () => {
            try {
                const q = query(
                    collection(db, "collections"),
                    orderBy("createdAt", "desc"),
                    limit(1) // Fetches only the most recent document
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const latestCollection = querySnapshot.docs[0].data();
                    setSlides(latestCollection.imageUrls || []);
                    setDescription(latestCollection.description || "Discover Our New Collection");
                }
            } catch (err) {
                console.error("Error fetching latest collection:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLatestCollection();
    }, []);

    // ✅ 2. Handle auto-sliding
    useEffect(() => {
        const intervalRef = setInterval(() => {
            const x = dragX.get();
            if (x === 0 && slides.length > 0) {
                setImgIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
            }
        }, AUTO_DELAY);
        return () => clearInterval(intervalRef);
    }, [dragX, slides.length]);

    // ✅ 3. Handle manual dragging
    const onDragEnd = () => {
        const x = dragX.get();
        if (x <= -DRAG_BUFFER && imgIndex < slides.length - 1) {
            setImgIndex((prev) => prev + 1);
        } else if (x >= DRAG_BUFFER && imgIndex > 0) {
            setImgIndex((prev) => prev - 1);
        }
    };

    if (isLoading) {
        return <div className="h-[60vh] flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="relative overflow-hidden mt-20 md:h-[90vh] flex items-center bg-neutral-900 rounded-2xl mx-4">
            {/* SLIDING CONTAINER FOR IMAGES */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                style={{ x: dragX }}
                animate={{ translateX: `-${imgIndex * 100}%` }}
                transition={SPRING_OPTIONS}
                onDragEnd={onDragEnd}
                className="flex h-full w-full cursor-grab items-center active:cursor-grabbing"
            >
                <Slides slides={slides} />
            </motion.div>

            {/* SINGLE TEXT OVERLAY for the entire collection */}
            <div className="absolute z-10 left-6 md:left-20 text-start w-[60%] md:w-[50%] pointer-events-none bg-gray-500/10 backdrop-blur-sm p-4 rounded-xl">
                <h1 className="text-white text-sm md:text-5xl lg:text-6xl font-heading uppercase leading-none">
                    {description}
                </h1>
                <p className="text-sm text-gray-200 md:text-xl font-body mt-2">
                    Everyday Essential Apparel
                </p>
                <a href="/all" className="inline-block mt-3 md:mt-6 rounded-xl border-2 bg-white md:px-8 md:py-2 px-4 py-1 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none text-xs md:text-lg pointer-events-auto">
                    Shop Now
                </a>
            </div>

            <Dots count={slides.length} imgIndex={imgIndex} setImgIndex={setImgIndex} />
        </div>
    );
};

// --- Slides Component (Renders background images from the collection) ---
const Slides = ({ slides }) => {
    return (
        <>
            {slides.length === 0 ? (
                <div className="h-[60vh] w-full flex justify-center  text-gray-500 z-20">
                    No Images Available. Try refreshing the page.
                </div>
            ) : (
                slides.map((url, idx) => (
                    <motion.div
                        key={idx}
                        style={{
                            backgroundImage: `url(${url})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                        }}
                        className="aspect-video w-full h-full shrink-0 bg-neutral-800 object-cover"
                    />
                ))
            )}
        </>
    );
};

// --- Dots Component ---
const Dots = ({ count, imgIndex, setImgIndex }) => {
    return (
        <div className="absolute bottom-5 left-0 right-0 z-10 flex w-full justify-center gap-2">
            {Array.from({ length: count }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setImgIndex(idx)}
                    className={`h-3 w-3 rounded-full transition-colors ${idx === imgIndex ? "bg-white" : "bg-white/50"
                        }`}
                />
            ))}
        </div>
    );
};

export default Hero;