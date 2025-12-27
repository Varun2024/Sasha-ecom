import React from 'react'
import NewInSection from '../../components/NewInSection'
import SaleSection from '../../components/SaleSection'
import Hero from '../../components/Hero'
import ShopByCategory from '../../components/CarouselCategory'
import ProductMarquee from '../../components/Discover'
import InstagramFeed from '../../components/InstagramFeed'

const Home = () => {
    return (
        <div className='bg-white '>
            {/* 1. Impactful Entrance */}
            <section className="mb-12 md:mb-20">
                <Hero />
            </section>

            {/* 2. Brand Identity / Discover Marquee 
                Placed here to act as a separator between Hero and Products */}
            <section className=" bg-[#fafafa] border-y border-gray-50">
                <ProductMarquee />
            </section>

            {/* 3. Primary Conversion: New Arrivals */}
            <section className="container mx-auto px-4 md:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3">Fresh Arrivals</h2>
                    <h3 className="text-2xl md:text-3xl font-light tracking-widest uppercase text-gray-900">The New Season</h3>
                    <div className="h-[1px] w-12 bg-black mx-auto mt-6"></div>
                    <NewInSection />
                </div>
            </section>

            {/* 4. Categorical Discovery */}
            <section className="bg-[#fcfcfc] border-y border-gray-50">
                <div className="container mx-auto px-4 md:px-12">
                    <ShopByCategory />
                </div>
            </section>

            {/* 5. Urgency / Promotion: Sale Section */}
            <section className="container mx-auto px-4 md:px-12 py-16 md:py-24">
                <SaleSection />
            </section>

            {/* 6. Social Proof & Community */}
            <section className=" bg-white">
                <div className="text-center mb-12">
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-3">Community</h2>
                    <h3 className="text-xl md:text-2xl font-light tracking-widest uppercase text-gray-900">#SashaOnYou</h3>
                    <p className="text-gray-500 text-xs mt-4 tracking-wide font-light uppercase">Tag us to be featured in our gallery</p>
                </div>
                <InstagramFeed />
            </section>
        </div>
    )
}

export default Home