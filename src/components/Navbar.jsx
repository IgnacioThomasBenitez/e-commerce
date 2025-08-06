import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiHome, FiShoppingCart, FiSettings } from "react-icons/fi";
import "../Css/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { carrito } = useCart();

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Ir al inicio">
          <img src="/IB.jpg" alt="MiTienda" />
        </Link>

        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)} aria-label="Inicio">
              <FiHome className="nav-icon" />
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/gestion" onClick={() => setMenuOpen(false)} aria-label="Gestión">
              <FiSettings className="nav-icon" />
              Gestión
            </Link>
          </li>
        </ul>

        <Link
          to="/carrito"
          className="navbar-cart"
          onClick={() => setMenuOpen(false)}
          aria-label={`Carrito, ${totalItems} productos`}
        >
          <FiShoppingCart className="nav-icon cart-icon" />
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </Link>

        <button
          className={`navbar-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
