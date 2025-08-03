import React from 'react';
import { FiUser } from 'react-icons/fi'; // Example icon

const navLinks = [ "Men", "Accessories", "Sale", "Gift Card"];

const Header = () => {
  return (
    <header className="heading fixed z-1 w-full bg-[var(--brand-accent)] flex justify-between items-center py-2 px-6 md:px-12 rounded-b-full  ">
      <h1 className="text-2xl">Sasha Store</h1>
      <nav className="hidden md:flex">
        <ul className="flex space-x-6 uppercase text-sm">
          {navLinks.map((link) => (
            <li key={link}>
              <a href="#" className="hover:underline">{link}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center space-x-4 text-sm font-heading">
        <FiUser size={20} />
        <span>Cart (0)</span>
      </div>
    </header>
  );
};

export default Header;