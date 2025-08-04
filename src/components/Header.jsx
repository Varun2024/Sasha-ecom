
import { FiUser } from 'react-icons/fi'; // Example icon
import { useNavigate } from 'react-router-dom';

const navLinks = [ 
  {name: 'All', path: '/all'},
  {name: 'TopWear', path: '/top'},
  {name: 'BottomWear', path: '/bottom'},
  {name: 'InnerWear', path: '/inner'},
  {name: 'Store locator', path: '/store-locator'},
];

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="heading fixed z-1 w-full  text-white bg-gray-900/40 backdrop-blur-3xl flex justify-between items-center py-2 px-6 md:px-12 ">
      <h1
      onClick={() => navigate('/')}
      className="text-2xl cursor-pointer">Sasha Store</h1>
      <nav className="hidden md:flex">
        <ul className="flex space-x-6 uppercase text-sm">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a href={link.path} className="hover:underline">{link.name}</a>
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