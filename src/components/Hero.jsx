/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
// import React, { useRef } from 'react';

// // slider images
// const hero = () => {
//   return (
//     <section
//     >
//       <div
//         className="h-full md:max-w-full mx-2 md:mx-6 bg-cover bg-center flex items-center justify-start md:px-7 px-4 text-white bg-blend-multiply bg-gray-600 rounded-4xl mt-16 py-10"
//         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>

//         <div className="text-start w-[50%]">
//           <h1 className="text-5xl md:text-4xl lg:text-6xl font-heading uppercase leading-none">
//             Winter Collection
//           </h1>
//           <p className="text-md md:text-xl font-body mt-2">Everyday Essential Apparel</p>
//           <a href="#" className="inline-block mt-6 rounded-2xl border-2 border-dashed border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
//             Shop Now
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };






// import { useEffect, useState } from "react";
// import { motion, useMotionValue } from "framer-motion";
// import { db } from '../firebase/firebaseConfig';
// import { collection, getDocs, orderBy, query } from 'firebase/firestore';


// // mock collection data
// // const imgs = [
// //   'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
// //   "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// //   "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
// // ];

// const useHeroImages = () => {
//   const [imgs, setImgs] = useState([]);
//   const hasFetched = useRef(false);
//   const [slides, setSlides] = useState([]);

//   useEffect(() => {
//     const fetchSlides = async () => {
//       if (hasFetched.current) return;
//       hasFetched.current = true;

//       try {
//         // fetch in order of createdAt (latest first)
//         const q = query(collection(db, "collections"), orderBy("createdAt", "desc"));
//         const snapshot = await getDocs(q);

//         const data = snapshot.docs.flatMap(doc => {
//           const d = doc.data();
//           return (d.imageUrls || []).map(url => ({
//             url,
//             description: d.description,
//           }));
//         }); // take only first 1 images for hero slider

//         setSlides(data);
//       } catch (err) {
//         console.error("Error fetching hero slides:", err);
//       }
//     };

//     fetchSlides();
//   }, [slides]);


//   return slides;
// };


// const ONE_SECOND = 1000;
// const AUTO_DELAY = ONE_SECOND * 10;
// const DRAG_BUFFER = 50;

// const SPRING_OPTIONS = {
//   type: "spring",
//   mass: 3,
//   stiffness: 400,
//   damping: 50,
// };

// export const Hero = () => {
//   const [imgIndex, setImgIndex] = useState(0);
//   const imgs = useHeroImages();

//   const dragX = useMotionValue(0);

//   useEffect(() => {
//     const intervalRef = setInterval(() => {
//       const x = dragX.get();

//       if (x === 0) {
//         setImgIndex((pv) => {
//           if (pv === imgs.length - 1) {
//             return 0;
//           }
//           return pv + 1;
//         });
//       }
//     }, AUTO_DELAY);

//     return () => clearInterval(intervalRef);
//   }, [dragX, imgs.length]);

//   const onDragEnd = () => {
//     const x = dragX.get();

//     if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
//       setImgIndex((pv) => pv + 1);
//     } else if (x >= DRAG_BUFFER && imgIndex > 0) {
//       setImgIndex((pv) => pv - 1);
//     }
//   };

//   return (
//     <>

//       <div className="relative overflow-hidden mt-20">

//         <motion.div
//           drag="x"
//           dragConstraints={{
//             left: 0,
//             right: 0,
//           }}
//           style={{
//             x: dragX,
//           }}
//           animate={{
//             translateX: `-${imgIndex * 100}%`,
//           }}
//           transition={SPRING_OPTIONS}
//           onDragEnd={onDragEnd}
//           className="flex cursor-grab items-center active:cursor-grabbing"
//         >

//           <Images imgs={imgs} imgIndex={imgIndex} />
//         </motion.div>

//         <Dots imgs={imgs} imgIndex={imgIndex} setImgIndex={setImgIndex} />

//       </div>
//     </>
//   );
// };
// const Images = ({ imgs, imgIndex }) => {
//   console.log("Rendering Images with imgs:", imgs, "and imgIndex:", imgIndex);
//   return (
//     <>
//       {imgs.map((imgSrc, imgIndex) => {
//         return (
//           <>
//             <motion.div
//               key={imgIndex}
//               style={{
//                 backgroundImage: `url(${imgSrc.url})`,
//                 backgroundSize: "contain",
//                 backgroundPosition: "center",
//               }}
//               animate={{
//                 scale: imgIndex === imgIndex ? 0.95 : 0.85,
//               }}
//               transition={SPRING_OPTIONS}
//               className="aspect-video w-full md:h-[90vh] shrink-0 rounded-xl bg-neutral-800 object-cover"
//             />
//             <div className="absolute z-0 left-10 md:left-20 top-10 md:top-40 text-start w-[70%]">
//               <h1 className="text-white text-s md:text-3xl lg:text-6xl font-heading uppercase leading-none">
//                 {imgSrc.description}
//               </h1>
//               <p className="text-xs text-gray-500 md:text-xl font-body mt-2">Everyday Essential Apparel</p>
//               <a href="/all" className="inline-block mt-6 rounded-xl border-2 bg-white md:px-8 md:py-2 px-4 py-1 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none text-xs md:text-lg">
//                 Shop Now
//               </a>
//             </div>
//           </>
//         );
//       })}
//     </>
//   );
// };
// const Dots = ({ imgs, imgIndex, setImgIndex }) => {
//   return (
//     <div className="mt-4 flex w-full justify-center gap-2">
//       {imgs.map((_, idx) => {
//         return (
//           <button
//             key={idx}
//             onClick={() => setImgIndex(idx)}
//             className={`h-3 w-3 rounded-full transition-colors ${idx === imgIndex ? "bg-neutral-500" : "bg-neutral-300"
//               }`}
//           />
//         );
//       })}
//     </div>
//   );
// };


// const GradientEdges = () => {
//   return (
//     <>
//       <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" />
//       <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
//     </>
//   );
// };
// export default Hero;


// /* eslint-disable no-unused-vars */
// // import React, { useEffect, useState } from "react";
// // import { motion, useMotionValue } from "framer-motion";
// // import { collection, getDocs, orderBy, query } from "firebase/firestore";
// // import { db } from "../firebase/firebaseConfig"; // ✅ adjust path if needed

// // const ONE_SECOND = 1000;
// // const AUTO_DELAY = ONE_SECOND * 10;
// // const DRAG_BUFFER = 50;

// // const SPRING_OPTIONS = {
// //   type: "spring",
// //   mass: 3,
// //   stiffness: 400,
// //   damping: 50,
// // };

// // export const Hero = () => {
// //   const [imgIndex, setImgIndex] = useState(0);
// //   const [collections, setCollections] = useState([]);
// //   const dragX = useMotionValue(0);

// //   // ✅ Fetch collections from Firestore
// //   useEffect(() => {
// //     const fetchCollections = async () => {
// //       try {
// //         const q = query(collection(db, "collections"));
// //         const querySnapshot = await getDocs(q);

// //         const data = querySnapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));
// //         console.log("Fetched collections:", data);
// //         setCollections(data);
// //       } catch (err) {
// //         console.error("Error fetching collections:", err);
// //       }
// //     };

// //     fetchCollections();
// //   });

// //   // ✅ Auto slide
// //   useEffect(() => {
// //     const intervalRef = setInterval(() => {
// //       const x = dragX.get();

// //       if (x === 0 && collections.length > 0) {
// //         setImgIndex((pv) => {
// //           if (pv === collections.length - 1) {
// //             return 0;
// //           }
// //           return pv + 1;
// //         });
// //       }
// //     }, AUTO_DELAY);

// //     return () => clearInterval(intervalRef);
// //   }, [dragX, collections]);

// //   const onDragEnd = () => {
// //     const x = dragX.get();

// //     if (x <= -DRAG_BUFFER && imgIndex < collections.length - 1) {
// //       setImgIndex((pv) => pv + 1);
// //     } else if (x >= DRAG_BUFFER && imgIndex > 0) {
// //       setImgIndex((pv) => pv - 1);
// //     }
// //   };

// //   if (collections.length === 0) {
// //     return (
// //       <div className="h-[60vh] flex items-center justify-center text-gray-500">
// //         Loading hero collections...
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="relative overflow-hidden mt-20">
// //       <motion.div
// //         drag="x"
// //         dragConstraints={{ left: 0, right: 0 }}
// //         style={{ x: dragX }}
// //         animate={{ translateX: `-${imgIndex * 100}%` }}
// //         transition={SPRING_OPTIONS}
// //         onDragEnd={onDragEnd}
// //         className="flex cursor-grab items-center active:cursor-grabbing"
// //       >
// //         <Images collections={collections} imgIndex={imgIndex} />
// //       </motion.div>

// //       <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} count={collections.length} />
// //     </div>
// //   );
// // };

// // // ✅ Show images + description
// // const Images = ({ collections, imgIndex }) => {
// //   return (
// //     <>
// //       {collections.map((collection, idx) => {
// //         // Take the first image of each collection for the hero slider
// //         const bgImage = collection.imageUrls?.[0];
// //         return (
// //           <motion.div
// //             key={collection.id}
// //             style={{
// //               backgroundImage: `url(${bgImage})`,
// //               backgroundSize: "cover",
// //               backgroundPosition: "center",
// //             }}
// //             animate={{ scale: imgIndex === idx ? 0.95 : 0.85 }}
// //             transition={SPRING_OPTIONS}
// //             className="relative aspect-video w-full md:h-[90vh] shrink-0 rounded-xl bg-neutral-800 object-cover"
// //           >
// //             <div className="absolute z-10 left-10 top-10 md:left-20 md:top-20 text-start max-w-[50%]">
// //               <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-heading uppercase leading-none">
// //                 {collection.description || "Untitled Collection"}
// //               </h1>
// //               <p className="text-md text-white md:text-xl font-body mt-2">
// //                 Everyday Essential Apparel
// //               </p>
// //               <a
// //                 href="#"
// //                 className="inline-block mt-6 rounded-xl border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
// //               >
// //                 Shop Now
// //               </a>
// //             </div>
// //           </motion.div>
// //         );
// //       })}
// //     </>
// //   );
// // };

// // const Dots = ({ imgIndex, setImgIndex, count }) => {
// //   return (
// //     <div className="mt-4 flex w-full justify-center gap-2">
// //       {Array.from({ length: count }).map((_, idx) => (
// //         <button
// //           key={idx}
// //           onClick={() => setImgIndex(idx)}
// //           className={`h-3 w-3 rounded-full transition-colors ${
// //             idx === imgIndex ? "bg-neutral-500" : "bg-neutral-300"
// //           }`}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // export default Hero;


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
            {slides.map((url, idx) => (
                <motion.div
                    key={idx}
                    style={{
                        backgroundImage: `url(${url})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                    }}
                    className="aspect-video w-full h-full shrink-0 bg-neutral-800 object-cover"
                />
            ))}
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
                    className={`h-3 w-3 rounded-full transition-colors ${
                        idx === imgIndex ? "bg-white" : "bg-white/50"
                    }`}
                />
            ))}
        </div>
    );
};

export default Hero;