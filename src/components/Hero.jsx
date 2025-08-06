import React from 'react';

// slider images
const Hero = () => {
  return (
    <section 
    >
      <div 
      className="h-full md:max-w-full mx-2 md:mx-6 bg-cover bg-center flex items-center justify-start md:px-7 px-4 text-white bg-blend-multiply bg-gray-600 rounded-4xl mt-16 py-10"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>

      <div className="text-start w-[50%]">
        <h1 className="text-5xl md:text-4xl lg:text-6xl font-heading uppercase leading-none">
          Winter Collection
        </h1>
        <p className="text-md md:text-xl font-body mt-2">Everyday Essential Apparel</p>
<<<<<<< HEAD
        <a href="#" className="mt-8 inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 text-white font-heading uppercase py-2 px-10 md:px-30 rounded-full hover:bg-gray-700 transition-colors">
=======
        <a href="#" className="mt-8 inline-block bg-white text-black hover:text-white font-heading uppercase py-2 px-10 md:px-30 rounded-full hover:bg-gray-700/80 transition-colors">
>>>>>>> 24ff6001aa417e3043f026c808dd8a7ddc0e0f5e
          Shop Now  
        </a>
      </div>
      </div>
    </section>
  );
};

export default Hero;