

import React from 'react';

const ProductCard = ({ name, mrp, sale, imageUrl, imageUrls}) => {
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
    <div className="bg-[#e0ddd9] border-2 rounded-2xl p-4 flex flex-col relative h-full transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
      <div className="w-full flex-grow ">
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