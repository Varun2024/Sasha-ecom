/* eslint-disable no-unused-vars */
import ProductCard from './ProductCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DataContext from '../context/Context';
import { useContext } from 'react';

const products = [
  {
    id: 1,
    name: 'Scarf',
    category: 'TopWear',
    price: 29.99,
    rating: 4.5,
    reviewCount: 120,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop'
  },
  {
    id: 2,
    name: 'Bucket Hat',
    category: 'Accessories',
    price: 149.99,
    rating: 4.8,
    reviewCount: 85,
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=800&fit=crop'
  },
  {
    id: 3,
    name: 'Best Seller Jacket',
    category: 'BottomWear',
    price: 89.99,
    rating: 4.7,
    reviewCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=800&fit=crop',
    isBestSeller: true
  },
  {
    id: 4,
    name: 'Puffer Bag',
    category: 'OuterWear',
    price: 199.50,
    rating: 4.9,
    reviewCount: 350,
    imageUrl: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&h=800&fit=crop'
  },
];

const NewInSection = () => {
  // const { id } = useParams();
  
  const { setProductData } = useContext(DataContext);

  const handleClick = (product) => {
    console.log('Product clicked:', product);
    setProductData(product);
    localStorage.setItem("productData", JSON.stringify(product));
  }

  return (
    <section className="py-16 px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Side */}
        <div
          className="min-h-[500px] bg-cover bg-center rounded-2xl flex flex-col justify-end p-8"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
          <h2 className="text-white font-heading text-6xl uppercase">New In</h2>
          <a href="#" className="flex justify-center mt-6 rounded-xl border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_white] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
            Shop Now
          </a>
        </div>
        {/* Right Side */}
        <div      
          className="grid grid-cols-2 gap-5">
          {products.map((product, index) => (
            <Link 
            to={`/product/${product.id}`} 
            key={index} 
            onClick={() => handleClick(product)}
            >
              <ProductCard {...product} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewInSection;