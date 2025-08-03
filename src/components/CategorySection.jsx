import React from 'react';

const categories = [
    { img: 'https://i.imgur.com/xVd2o5b.png', alt: 'Men Puffer' },
    { img: 'https://i.imgur.com/yvQWjE9.png', alt: 'Women Puffer' },
    { img: 'https://i.imgur.com/T0b6Xo1.png', alt: 'Puffer Bag' },
];

const CategorySection = () => {
  return (
    <section className="py-16 px-6 md:px-12">
      <h2 className="text-center font-heading text-4xl uppercase mb-8">Shop By Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {categories.map((cat, index) => (
          <div key={index} className="rounded-2xl overflow-hidden">
            <img src={cat.img} alt={cat.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;