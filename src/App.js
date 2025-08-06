import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Carrito from './pages/Carrito';
import DetalleProducto from './pages/DetalleProducto';
import Catalogo from './pages/Catalogo';
import Checkout from './pages/Checkout';
import Gestion from './pages/Gestion';

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gestion" element={<Gestion />} />
        </Routes>

        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
