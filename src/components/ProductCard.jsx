

import React from 'react';

const ProductCard = ({ name, mrp, sale, imageUrl, imageUrls, isBestSeller }) => {
  // ✅ Logic to handle both new 'imageUrls' array and old 'imageUrl' string
  let displayImage = 'https://placehold.co/600x800/f8f8f8/cccccc?text=Image+Not+Found'; // Fallback image
  if (imageUrls && imageUrls.length > 0) {
    // Use the first image from the new array structure
    displayImage = imageUrls[0];
  } else if (imageUrl) {
    // Fallback to the old single imageUrl field
    displayImage = imageUrl;
  }

  return (
    <div className="bg-[#e0ddd9] rounded-2xl p-4 flex flex-col relative h-full">
      {isBestSeller && (
        <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full z-10">
          Best Seller
        </span>
      )}
      <div className="w-full flex-grow">
        <img src={displayImage} alt={name} className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="mt-4 flex-shrink-0">
        <h3 className="font-heading uppercase truncate">{name}</h3>
        <p className="font-body text-sm">
          {mrp && <span className="line-through text-gray-500 mr-2">₹{mrp}</span>}
          ₹{sale}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;