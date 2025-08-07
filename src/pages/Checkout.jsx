import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../Css/Checkout.css";

function Checkout() {
  const { carrito, vaciarCarrito } = useCart();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !email) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    alert("¡Compra realizada con éxito! Gracias por confiar en nosotros.");
    vaciarCarrito();
    navigate("/");
  };

  return (
    <div className="checkout-container">
      <h1>Finalizá tu compra</h1>

      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="tuemail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="resumen">
            <h3>Resumen de tu pedido:</h3>
            <ul>
              {carrito.map((item) => (
                <li key={item.id} className="resumen-item">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="resumen-img"
                  />
                  <div>
                    {item.nombre} x{item.cantidad} — $
                    {item.precio * item.cantidad}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="total">Total a pagar: ${total}</h3>
          </div>

          <button type="submit" className="btn-finalizar">
            Finalizár compra
          </button>
        </form>
      )}
    </div>
  );
}

export default Checkout;
