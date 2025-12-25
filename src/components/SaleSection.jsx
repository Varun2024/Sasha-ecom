// import React from 'react';

const SaleSection = () => {
  return (
    <section 
      className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-cover bg-center flex items-center justify-center text-white mb-24 group"
      style={{ 
        backgroundImage: "url('https://res.cloudinary.com/doftlqnmi/image/upload/v1758866028/express-uploads/pfjelop2gsvbool3phfd.jpg')" 
      }}
    >
      {/* Subtle Overlay to ensure text legibility while keeping the "luxury" look */}
      <div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/40"></div>

      <div className="relative z-10 text-center px-4"> 
        {/* Top Label */}
        <span className="text-[10px] md:text-[12px] tracking-[0.6em] uppercase font-bold text-white/90 mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">
          Limited Time Opportunity
        </span>
        
        {/* Main Title: Minimalist & Spaced */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-light uppercase tracking-[0.15em] leading-tight italic">
          Sale <span className="font-semibold not-italic">Is On</span>
        </h2>
        
        {/* Subtitle */}
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase font-light mt-6 text-white/80">
          Festive curations for the modern wardrobe
        </p>
        
        {/* Refined Button */}
        <div className="mt-10">
          <a 
            href="/all" 
            className="inline-block px-12 py-4 bg-white text-black text-[11px] font-semibold uppercase tracking-[0.3em] transition-all duration-300 hover:bg-black hover:text-white border border-white"
          >
            Explore Offers
          </a>
        </div>
      </div>
    </section>
  );
};

export default SaleSection;