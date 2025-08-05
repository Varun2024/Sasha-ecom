import React from 'react'
import NewInSection from '../../components/NewInSection'
import InstagramSection from '../../components/InstagramSection'
import SaleSection from '../../components/SaleSection'
import Hero from '../../components/Hero'
import ShopByCategory from '../../components/CarouselCategory'

const Home = () => {
    return (
        <div className=''>
            <Hero />
            <NewInSection />
            <ShopByCategory />
            <SaleSection />
            <InstagramSection />
        </div >
    )
}

export default Home