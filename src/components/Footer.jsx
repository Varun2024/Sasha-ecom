import React from 'react';
import { FaInstagram, FaFacebookF, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 pb-16 border-b border-white/10">
          
          {/* Brand Story */}
          <div className="space-y-6">
            <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-400">Our Story</h3>
            <p className="text-sm font-light leading-relaxed text-gray-400 italic">
              “Trendy. Comfortable. Yours.” <br />
              <span className="not-italic mt-2 block">
                Find your next favorite outfit from our latest curations.
              </span>
            </p>
          </div>

          {/* Info & Location */}
          <div className="space-y-6">
            <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-400">Visit Us</h3>
            <p className="text-sm font-light leading-relaxed text-gray-400 uppercase tracking-wider">
              Shop No. Nagar Nigam Complex,<br />
              Near SBI Shankar Nagar, <br />
              Raipur, Chhattisgarh<br />
              <span className="text-white font-medium mt-2 block">Ph: 98268 01231</span>
            </p>
          </div>

          {/* Policy Links */}
          <div className="space-y-6">
            <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-400">Policy</h3>
            <ul className="space-y-3 text-[13px] font-light text-gray-400">
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/shipping-policy" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="/t&c" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Newsletter / Query */}
          <div className="space-y-6">
            <h3 className="text-[11px] tracking-[0.4em] uppercase font-bold text-gray-400">Newsletter</h3>
            <p className="text-[12px] font-light text-gray-500 uppercase tracking-widest">Stay updated on new drops</p>
            <form className="relative mt-4">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-white/20 focus:border-white focus:outline-none py-2 text-xs tracking-widest placeholder:text-gray-600"
              />
              <button type="submit" className="absolute right-0 bottom-2 hover:translate-x-1 transition-transform">
                <FaArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex space-x-8">
            <a href="https://www.instagram.com/sasha_store_raipur/" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <FaInstagram size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
              <FaFacebookF size={18} />
            </a>
          </div>

          <div className="text-center md:text-right space-y-2">
            <p className="text-[10px] tracking-[0.2em] text-gray-500 uppercase">
              © 2025 Sasha Store. All Rights Reserved.
            </p>
            <p className="text-[9px] tracking-widest text-gray-600 uppercase">
              Coded with precision by <a href="https://varunxbuilds.web.app" target="_blank" className="underline hover:text-white">Varun</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;