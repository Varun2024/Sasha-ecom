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
        <a href="all" className="inline-block mt-6 rounded-xl border-2  border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
          Shop Sale
        </a>
      </div>
    </section>
  );
};

export default SaleSection;