import React from 'react';

const SaleSection = () => {
  return (
    <section 
      className="h-[60vh] md:max-w-full mx-4 rounded-4xl bg-cover bg-center flex items-center justify-center text-white bg-blend-multiply bg-gray-500"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="text-center"> 
        
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-heading uppercase leading-none">
          Sale Is On
        </h2>
        <p className="text-lg font-body mt-2">End of the season last catch</p>
        <a href="#" className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 text-white font-heading uppercase py-4 px-10 rounded-full hover:bg-yellow-400 transition-colors">
          Shop Sale
        </a>
      </div>
    </section>
  );
};

export default SaleSection;