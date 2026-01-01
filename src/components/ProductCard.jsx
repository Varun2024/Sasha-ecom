


import React from 'react';

const ProductCard = ({ name, mrp, sale, imageUrl, imageUrls , variants}) => {
  // Logic to handle both new 'imageUrls' array and old 'imageUrl' string
  let displayImage = 'https://placehold.co/600x800/f8f8f8/cccccc?text=Image+Not+Found';
  if (variants && variants.length > 0 && variants[0].imageUrls.length > 0) {
    displayImage = variants[0].imageUrls[0];
  } else if (imageUrl) {
    displayImage = imageUrl;
  }

  return (
    <div className="group flex flex-col bg-white h-full transition-all duration-500">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[#fafafa] aspect-[3/4]">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
        />
        
        {/* Subtle Discount Tag */}
        {mrp > sale && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 shadow-sm">
            <p className="text-[9px] tracking-widest font-bold uppercase text-gray-900 italic">
              {Math.round(((mrp - sale) / mrp) * 100)}% OFF
            </p>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="py-4 px-1 space-y-1">
        <h3 className="text-xs md:text-sm font-medium tracking-widest uppercase text-gray-900 truncate group-hover:text-gray-500 transition-colors">
          {name}
        </h3>
        
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-900 tracking-tight">
            ₹{sale}
          </p>
          {mrp && mrp > sale && (
            <p className="text-xs text-gray-400 line-through font-light">
              ₹{mrp}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;