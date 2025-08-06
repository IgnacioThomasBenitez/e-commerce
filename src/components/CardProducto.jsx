import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../Css/CardProducto.css";

function CardProducto({ producto }) {
  const { agregarAlCarrito } = useCart();

  return (
    <div className="card-producto">
      <Link to={`/producto/${producto.id}`}>
        <img src={producto.imagen} alt={producto.nombre} />
        <h3>{producto.nombre}</h3>
      </Link>
      <p>${producto.precio}</p>
      <button onClick={() => agregarAlCarrito(producto)}>
        Agregar al carrito
      </button>
    </div>
  );
}

export default CardProducto;
