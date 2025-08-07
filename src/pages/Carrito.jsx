import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../Css/Carrito.css";

function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useCart();
  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div className="carrito-container">
      <h1>Carrito de compras</h1>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">
          Tu carrito está vacío. <Link to="/">Ver productos</Link>
        </p>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((item) => (
              <li key={item.id} className="carrito-item">
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="carrito-img"
                />
                <div className="item-info">
                  <h3>{item.nombre}</h3>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Precio unitario: ${item.precio}</p>
                  <p>Subtotal: ${item.precio * item.cantidad}</p>
                </div>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarDelCarrito(item.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <h2>Total: ${total}</h2>
            <div className="carrito-botones">
              <button className="btn-vaciar" onClick={vaciarCarrito}>
                Vaciar carrito
              </button>
              <Link to="/checkout">
                <button className="btn-checkout">Finalizá tu compra</button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrito;
