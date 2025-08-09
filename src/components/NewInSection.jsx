/* eslint-disable no-unused-vars */
import ProductCard from './ProductCard';
import { Link, useNavigate, useParams } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Scarf',
    price: '$30.00',
    imageUrl: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    name: 'Bucket Hat',
    price: '$25.00',
    oldPrice: '$30.00',
    imageUrl: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    name: 'Best Seller Jacket',
    price: '$150.00',
    imageUrl: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    isBestSeller: true
  },
  {
    id: 4,
    name: 'Puffer Bag',
    price: '$75.00',
    imageUrl: 'https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];

const NewInSection = () => {
  // const { id } = useParams();
  
  return (
    <section className="py-16 px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Side */}
        <div
          className="min-h-[500px] bg-cover bg-center rounded-2xl flex flex-col justify-end p-8"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        >
          <h2 className="text-white font-heading text-6xl uppercase">New In</h2>
          <a href="#" className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 text-white font-heading uppercase py-4 px-10 rounded-full w-fit hover:bg-gray-500/40 hover:text-white transition-colors">
            Shop Now
          </a>
        </div>
        {/* Right Side */}
        <div
          className="grid grid-cols-2 gap-5">
          {products.map((product,index) => (
            <Link to={`/product`} key={index} >
              <ProductCard {...product} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewInSection;