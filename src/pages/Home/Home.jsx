import React from 'react'
import NewInSection from '../../components/NewInSection'
import InstagramSection from '../../components/InstagramSection'
import SaleSection from '../../components/SaleSection'
import Hero from '../../components/Hero'
import ShopByCategory from '../../components/CarouselCategory'
import ProductMarquee from '../../components/Discover'

const Home = () => {
    return (
        <div className=''>
            <Hero />
            <ProductMarquee/>
            <ShopByCategory />
            <NewInSection />
            <SaleSection />
            {/* <InstagramSection /> */}
        </div >
    )
}

export default Home