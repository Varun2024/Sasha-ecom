import React from 'react';

const instaPosts = [
    'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const InstagramSection = () => {
  return (
    <section className="py-16 px-6 md:px-12">
      <h2 className="text-center font-heading text-4xl uppercase mb-8">
        Find us on Instagram
        {/* <span className="font-body text-base normal-case ml-2 text-gray-600">#puffers</span> */}
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