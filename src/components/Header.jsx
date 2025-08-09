
import { FaBagShopping } from 'react-icons/fa6';
import { FiUser } from 'react-icons/fi'; // Example icon
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navLinks = [ 
  {name: 'All', path: '/all'},
  {name: 'TopWear', path: '/top'},
  {name: 'BottomWear', path: '/bottom'},
  {name: 'InnerWear', path: '/inner'},
  {name: 'Accessories', path: '/accessories'},
  {name: 'Store locator', path: '/store-locator'},
];


const Header = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount =  (localStorage.getItem("cartCount")) ? JSON.parse(localStorage.getItem("cartCount")) : cart.length;
  return (
    <header className=" fixed top-0 z-1 w-full  text-black bg-neutral-500/40 backdrop-blur-3xl shadow-xl flex justify-between items-center py-2 px-6 md:px-8 ">
      <div
      onClick={() => navigate('/')}
      className="text-2xl cursor-pointer w-25 h-10 bg-[url('./logo-nbg.png')] bg-cover bg-center"
      />

      {/* desktop view */}
      <nav className="hidden lg:flex">
        <ul className="flex space-x-6 uppercase text-sm">
          {navLinks.map((link, index) => (
            <li key={index}>
              <div onClick={() => navigate(link.path)} className="hover:underline cursor-pointer">{link.name}</div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile view */}
      {/* <nav className="lg:hidden">
        <ul className="flex flex-col space-x-4">
          {navLinks.map((link, index) => (
            <li key={index}>
              <div onClick={() => navigate(link.path)} className="hover:underline cursor-pointer">{link.name}</div>
            </li>
          ))}
        </ul>
      </nav> */}

      <div className="flex items-center space-x-4 text-sm font-heading gap-1">
        <div className="flex flex-col items-center gap-1 cursor-pointer" >
        <FiUser size={15} />
        profile
        </div>
        <span className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/cart')}><FaBagShopping/> Cart ({cartCount ? cartCount : 0})</span>
      </div>
    </header>
  );
};

export default Header;