import React from 'react';

const ProductCard = ({ name, price, oldPrice, imageUrl, isBestSeller }) => {
  return (
    <div className="bg-[#e0ddd9] rounded-2xl p-4 flex flex-col relative">
      {isBestSeller && (
        <span className="absolute top-4 left-4 bg-[var(--brand-accent)] text-[var(--brand-dark)] text-xs font-bold uppercase px-3 py-1 rounded-full">
          Best Seller
        </span>
      )}
      <img src={imageUrl} alt={name} className="w-full object-cover rounded-lg" />
      <div className="mt-4">
        <h3 className="font-heading uppercase">{name}</h3>
        <p className="font-body text-sm">
          {oldPrice && <span className="line-through text-gray-500 mr-2">{oldPrice}</span>}
          {price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;