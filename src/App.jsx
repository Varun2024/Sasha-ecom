import Header from './components/Header';
import Hero from './components/Hero';
import NewInSection from './components/NewInSection';
import CategorySection from './components/CategorySection';
import SaleSection from './components/SaleSection';
import InstagramSection from './components/InstagramSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <NewInSection />
        <CategorySection />
        <SaleSection />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;