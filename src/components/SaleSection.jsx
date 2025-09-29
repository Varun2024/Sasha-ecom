import React from 'react';

const SaleSection = () => {
  return (
    <section 
      className="h-[60vh] md:max-w-full mx-4 rounded-4xl bg-cover bg-center flex items-center justify-center text-white bg-blend-multiply bg-gray-500 mb-20"
      style={{ backgroundImage: "url('https://res.cloudinary.com/doftlqnmi/image/upload/v1758866028/express-uploads/pfjelop2gsvbool3phfd.jpg"  }}
    >
      <div className="text-center"> 
        
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-heading uppercase leading-none">
          Sale Is On
        </h2>
        <p className="text-lg font-body mt-2">Festive offers on the plate</p>
        <a href="all" className="inline-block mt-6 rounded-xl border-2  border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
          Shop Sale
        </a>
      </div>
    </section>
  );
};

export default SaleSection;