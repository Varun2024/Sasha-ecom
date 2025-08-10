/* eslint-disable no-unused-vars */

import { FaBagShopping } from 'react-icons/fa6';
import { FiUser,FiMenu, FiX } from 'react-icons/fi'; // Example icon
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import ProfileContainer from './ProfileContainer';
import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const navLinks = [
  { name: 'All', path: '/all' },
  // {name: 'TopWear', path: '/top'},
  // {name: 'BottomWear', path: '/bottom'},
  // {name: 'InnerWear', path: '/inner'},
  // {name: 'Accessories', path: '/accessories'},
  { name: 'Store locator', path: '/store-locator' },
];




const Header = () => {
  // --- Using your hooks and state logic ---
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = localStorage.getItem("cartCount") ? JSON.parse(localStorage.getItem("cartCount")) : cart.length;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="fixed top-0 z-40 w-full text-black bg-white/80 backdrop-blur-lg shadow-md flex justify-between items-center py-2 px-4 md:px-8">
        <div
          onClick={() => navigate('/')}
          className="text-2xl cursor-pointer w-24 h-10flex items-center justify-center font-bold" // Placeholder style for the logo
        >
           
          <div className="w-36 h-14 bg-[url('./logo-nbg.png')] bg-cover bg-center" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <ul className="flex items-center space-x-6 uppercase text-sm font-medium text-gray-700">
            {navLinks.map((link) => (
              <li key={link.name}>
                <div onClick={() => navigate(link.path)} className="bg-gradient-to-r from-black to-gray-800 bg-no-repeat [background-position:0%_100%] [background-size:0%_2px] transition-all duration-300 hover:[background-size:100%_2px]  hover:text-black cursor-pointer">{link.name}</div>
                {/* <div className='w-1 hover:w-full border-b border-gray-700 border-2 transition-all duration-300' /> */}
              </li>
            ))}
          </ul>
          <input type="text" className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none" placeholder="Search..." />
        </nav>

        {/* Desktop User Actions - using your implementation */}
        <div className="hidden lg:flex items-center space-x-6 text-sm text-gray-700 ">
          <div className="relative flex flex-col items-center gap-1 cursor-pointer bg-gradient-to-r from-black to-gray-800 bg-no-repeat [background-position:0%_100%] [background-size:0%_2px] transition-all duration-300 hover:[background-size:100%_2px] " onClick={toggleProfile}>
            {isProfileOpen ? (
              <>
                <FiX size={15} />
                <span>Close</span>
              </>
            ) : (
              <>
                <FiUser size={15} />
                <span>Profile</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer bg-gradient-to-r from-black to-gray-800 bg-no-repeat [background-position:0%_100%] [background-size:0%_2px] transition-all duration-300 hover:[background-size:100%_2px]" onClick={() => navigate('/cart')}>
            <FaBagShopping size={15} />
            <span>Cart ({cartCount>=0?cartCount:0})</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer bg-gradient-to-r from-black to-gray-800 bg-no-repeat [background-position:0%_100%] [background-size:0%_2px] transition-all duration-300 hover:[background-size:100%_2px]" onClick={() => navigate('/wishlist')}>
            <Heart size={15} />
            <span>Wishlist</span>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-md hover:bg-gray-200 transition-colors">
            <FiMenu size={24} />
          </button>
        </div>
      </header>

      {/* Your ProfileContainer logic */}
      <ProfileContainer isOpen={isProfileOpen} onClose={toggleProfile} />


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl lg:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md hover:bg-gray-200 transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <nav className="flex-grow">
                <ul className="flex flex-col space-y-6 text-lg">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <div onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className="cursor-pointer hover:underline">
                        {link.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-6 border-t border-gray-200 pt-6">
                 <input type="text" className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm" placeholder="Search..." />
                 <div className="space-y-4 text-md">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => { toggleProfile(); setIsMenuOpen(false); }}>
                        <FiUser size={20} />
                        <span>Profile</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/cart'); setIsMenuOpen(false); }}>
                        <FaBagShopping size={20} />
                        <span>Cart ({cartCount})</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }}>
                        <Heart size={20} />
                        <span>Wishlist</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


/*
================================================================================
  App.jsx - (This would be your main app file: src/App.jsx)
================================================================================
*/

// import Header from './components/Header'; // You would import the Header like this

function App() {
  // The state that was in Header is now managed here, so it can be passed down.
  // In a real app, this might be handled by a global state manager (Redux, Zustand)
  
  return (
    // In your real app, you would have your CartProvider and Router wrapping the app
    <div className="bg-gray-100 min-h-screen font-sans">
       <Header />
       <div className="pt-24 p-8">
         <h1 className="text-3xl font-bold">Page Content</h1>
         <p className="mt-4">Scroll down to see the header stays fixed.</p>
         <div className="h-[200vh] bg-gray-200 mt-4 rounded-lg p-4">This is a long content area to demonstrate the sticky header.</div>
       </div>
    </div>
  );
}
export default Header;