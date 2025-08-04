import React from 'react';

const Hero = () => {
  return (
    <section 
      className="h-screen bg-cover bg-center flex items-center justify-start px-4 md:px-7 text-white bg-blend-multiply bg-gray-600"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="text-start w-[50%] ">
        <h1 className="text-4xl md:text-8xl lg:text-9xl font-heading uppercase leading-none">
          Winter Collection
        </h1>
        <p className="text-md md:text-xl font-body mt-2">Everyday Essential Apparel</p>
        <a href="#" className="mt-8 inline-block bg-white text-black hover:text-white font-heading uppercase py-2 px-10 md:px-30 rounded-full hover:bg-gray-700/80 transition-colors">
          Shop Now  
        </a>
      </div>
    </section>
  );
};

export default Hero;