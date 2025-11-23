import React from 'react'
import NewInSection from '../../components/NewInSection'
import SaleSection from '../../components/SaleSection'
import Hero from '../../components/Hero'
import ShopByCategory from '../../components/CarouselCategory'
import ProductMarquee from '../../components/Discover'
import InstagramFeed from '../../components/InstagramFeed'

const Home = () => {
    return (
        <div className=''>
            <Hero />
            <NewInSection />
            <ProductMarquee/>
            <ShopByCategory />
            <InstagramFeed />
            <SaleSection />
        </div >
    )
}

export default Home