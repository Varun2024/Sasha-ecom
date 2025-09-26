import React from 'react';
import { FaTiktok, FaInstagram, FaYoutube, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[var(--brand-footer)] text-white py-16 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 pb-12 border-b border-gray-600">
          <div>
            <h3 className="font-heading uppercase mb-4">Our Story</h3>
            <p className="font-body text-sm text-gray-300">
              “Trendy. Comfortable. Yours. — Sasha Store” <br />
              Find your next favorite outfit from our latest collections.
            </p>
          </div>
          <div>
            <h3 className="font-heading uppercase mb-4">Info & Location</h3>
            <p className="font-body text-sm text-gray-300">
              SHOP NO. NAGAR NIGAM COMPLEX,<br />
              NEAR SBI SHANKAR NAGAR, <br />
              Raipur, Chhattisgarh<br />
              Ph.no : <strong>98268 01231</strong>
            </p>
          </div>
          <div>
            <h3 className="font-heading uppercase mb-4">Policy</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
              <li><a href="#" className="hover:underline">Refund Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
          {/* <div>
            <h3 className="font-heading uppercase mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:underline">Women</a></li>
              <li><a href="#" className="hover:underline">Men</a></li>
              <li><a href="#" className="hover:underline">Accessories</a></li>
              <li><a href="#" className="hover:underline">Sale</a></li>
            </ul>
          </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex space-x-4">
              {/* <a href="#" aria-label="TikTok"><FaTiktok size={20} /></a> */}
              <a href="https://www.instagram.com/sasha_store_raipur/" aria-label="Instagram"><FaInstagram size={20} /></a>
              {/* <a href="#" aria-label="YouTube"><FaYoutube size={20} /></a> */}
              <a href="#" aria-label="Facebook"><FaFacebookF size={20} /></a>
            </div>
          </div>
          <div>
            <h3 className="font-heading uppercase mb-4">Have any query? mails us</h3>
            <form>
              <label htmlFor="email" className="text-sm text-gray-300">Your email *</label>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <input type="email" id="email" className="w-full bg-transparent border-b border-gray-400 focus:border-white focus:outline-none py-2" />
                <button type="submit" className="inline-block mt-6 rounded-xl border-2  border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">Submit</button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-600 text-sm text-gray-400">
          <p>© 2025 by Sasha Store. All rights reserved.</p>
          <p>Developed By Varun with Love❤️.</p>
          <div className="mt-2">
            <a
              href="https://varunxbuilds.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-black px-5 py-2 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Connect with me
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;