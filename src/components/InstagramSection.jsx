import React from 'react';

const instaPosts = [
    'https://i.imgur.com/gK6B1QG.png',
    'https://i.imgur.com/2sM7hWb.png',
    'https://i.imgur.com/m5F1o9n.png',
    'https://i.imgur.com/yLw1t4P.png',
];

const InstagramSection = () => {
  return (
    <section className="py-16 px-6 md:px-12">
      <h2 className="text-center font-heading text-4xl uppercase mb-8">
        Find us on Instagram
        <span className="font-body text-base normal-case ml-2 text-gray-600">#puffers</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {instaPosts.map((post, index) => (
          <div key={index} className="rounded-2xl overflow-hidden aspect-square">
            <img src={post} alt={`Instagram post ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramSection;