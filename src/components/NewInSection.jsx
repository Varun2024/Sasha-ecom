/* eslint-disable no-unused-vars */
import ProductCard from './ProductCard';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DataContext from '../context/Context';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const NewInSection = () => {
  const [products, setProducts] = useState([]);
  // const { id } = useParams();
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getDocs(collection(db, 'products'));
      const productsData = res.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 4); //to get 4 items there
      setProducts(productsData);
    }
    fetchProducts();
  }, [products]);
  const navigate = useNavigate();


  const { setProductData } = useContext(DataContext);

  const handleClick = (product) => {
    setProductData(product);
    // window.location.href = `/product/${product.id}`;
    navigate(`/product/${product.id}`);
    localStorage.setItem("productData", JSON.stringify(product));
  }

  return (
    <section className="py-16 px-6 md:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Side */}
        <div
          className="border-2 min-h-[500px] bg-cover bg-center rounded-2xl flex flex-col justify-end p-8 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
          style={{ backgroundImage: "url('https://res.cloudinary.com/doftlqnmi/image/upload/v1758871267/express-uploads/eubjhp0xjxqbz2breakq.png')" }}
        >
          <div className=" bg-black backdrop-blur-md opacity-70 rounded-2xl p-8 " >
            <h2 className="text-white font-heading text-6xl uppercase">New in House</h2>
            <a href="/all" className="flex justify-center mt-6 rounded-xl border-2 border-black bg-white px-8 py-2 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_gray] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none">
              Shop Now
            </a>
          </div>
        </div>
        {/* Right Side */}
        <div
          className="grid grid-cols-2 gap-5">
          {products.map((product, index) => (
            <div
              key={index}
              onClick={() => handleClick(product)}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewInSection;