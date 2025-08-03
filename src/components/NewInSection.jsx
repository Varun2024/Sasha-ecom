import React from 'react';
import ProductCard from './ProductCard';

const products = [
    { name: 'Scarf', price: '$30.00', imageUrl: 'https://i.imgur.com/uG9a10u.png' },
    { name: 'Bucket Hat', price: '$25.00', oldPrice: '$30.00', imageUrl: 'https://i.imgur.com/BfA3H4g.png' },
    { name: 'Best Seller Jacket', price: '$150.00', imageUrl: 'https://i.imgur.com/Qk7xH2J.png', isBestSeller: true },
    { name: 'Puffer Bag', price: '$75.00', imageUrl: 'https://i.imgur.com/zVv7tqf.png' },
];

const NewInSection = () => {
  return (
    <section className="py-16 px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Side */}
        <div 
          className="min-h-[500px] bg-cover bg-center rounded-2xl flex flex-col justify-end p-8"
          style={{ backgroundImage: "url('https://i.imgur.com/zH3T2zK.png')" }}
        >
          <h2 className="text-[var(--brand-accent)] font-heading text-6xl uppercase">New In</h2>
          <a href="#" className="mt-4 inline-block bg-[var(--brand-accent)] text-[var(--brand-dark)] font-heading uppercase py-4 px-10 rounded-full w-fit hover:bg-yellow-400 transition-colors">
            Shop Now
          </a>
        </div>
        {/* Right Side */}
        <div className="grid grid-cols-2 gap-5">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewInSection;