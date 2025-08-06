import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../Css/Checkout.css";

function Checkout() {
  const { carrito, vaciarCarrito } = useCart();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !email) {
      alert("Completá todos los campos");
      return;
    }

    alert("¡Compra realizada con éxito!");
    vaciarCarrito();
    navigate("/");
  };

  return (
    <div className="checkout-container">
  <h1>Checkout</h1>

  {carrito.length === 0 ? (
    <p>No hay productos en el carrito.</p>
  ) : (
    <>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="resumen">
          <h3>Resumen:</h3>
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                {item.nombre} x{item.cantidad} — ${item.precio * item.cantidad}
              </li>
            ))}
          </ul>

          <h3>Total: ${total}</h3>
        </div>

        <button type="submit" className="btn-finalizar">Finalizar compra</button>
      </form>
    </>
  )}
</div>

  );
}

export default Checkout;
