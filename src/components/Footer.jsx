import React from 'react';
import { FaTiktok, FaInstagram, FaYoutube, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[var(--brand-footer)] text-white py-16 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 pb-12 border-b border-gray-600">
          <div>
            <h3 className="font-heading uppercase mb-4">Our Story</h3>
            <p className="font-body text-sm text-gray-300">This is a space to welcome visitors to the site. Grab their attention with copy that clearly states what the site is about.</p>
          </div>
          <div>
            <h3 className="font-heading uppercase mb-4">Info & Location</h3>
            <p className="font-body text-sm text-gray-300">500 Terry Francine Street<br />San Francisco, CA 94158<br />info@mysite.com<br />Tel: 123-456-7890</p>
          </div>
          <div>
            <h3 className="font-heading uppercase mb-4">Policy</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
              <li><a href="#" className="hover:underline">Refund Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading uppercase mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Women</a></li>
              <li><a href="#" className="hover:underline">Men</a></li>
              <li><a href="#" className="hover:underline">Accessories</a></li>
              <li><a href="#" className="hover:underline">Sale</a></li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                 <div className="flex space-x-4">
                    <a href="#" aria-label="TikTok"><FaTiktok size={20} /></a>
                    <a href="#" aria-label="Instagram"><FaInstagram size={20} /></a>
                    <a href="#" aria-label="YouTube"><FaYoutube size={20} /></a>
                    <a href="#" aria-label="Facebook"><FaFacebookF size={20} /></a>
                </div>
            </div>
            <div>
                <h3 className="font-heading uppercase mb-4">Have any query? mails us</h3>
                <form>
                    <label htmlFor="email" className="text-sm text-gray-300">Your email *</label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <input type="email" id="email" className="w-full bg-transparent border-b border-gray-400 focus:border-white focus:outline-none py-2" />
                        <button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 text-white font-heading uppercase py-3 px-8 rounded-full w-full sm:w-auto whitespace-nowrap">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-600 text-sm text-gray-400">
          <p>© 2025 by Sasha Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;