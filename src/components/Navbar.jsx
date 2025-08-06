import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiHome, FiShoppingCart, FiSettings } from "react-icons/fi";
import "../Css/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { carrito } = useCart();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Animación del contador
  const [animateBadge, setAnimateBadge] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="Ir al inicio">
          <img src="/IB.jpg" alt="MiTienda" />
        </Link>

        {/* Menú */}
        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)} aria-label="Inicio">
              <FiHome className="nav-icon" />
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/gestion"
              onClick={() => setMenuOpen(false)}
              aria-label="Gestión"
            >
              <FiSettings className="nav-icon" />
              Gestión
            </Link>
          </li>
        </ul>

        {/* Carrito */}
        <Link
          to="/carrito"
          className="navbar-cart"
          onClick={() => setMenuOpen(false)}
          aria-label={`Carrito, ${totalItems} productos`}
        >
          <FiShoppingCart className="nav-icon cart-icon" />
          {totalItems > 0 && (
            <span
              className={`cart-count ${animateBadge ? "pop" : ""}`}
              aria-hidden="true"
            >
              {totalItems}
            </span>
          )}
        </Link>

        {/* Toggle móvil */}
        <button
          className={`navbar-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
