import React from 'react'

const StoreLocation = () => {
  return (
    <div className="bg-white text-center p-6 rounded-xl shadow-sm flex flex-col h-full mt-20">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Store Location</h3>
      <div className="flex-grow w-full h-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.3712311752365!2d81.66161749999999!3d21.256768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dd6f7d73db33%3A0xfe7f24dec5da55ee!2sSASHA%20STORE%20(%20BEST%20CLOTH%20SHOP)!5e0!3m2!1sen!2sin!4v1754844443605!5m2!1sen!2sin"
          className="w-full h-screen rounded-lg"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};

export default StoreLocation;
