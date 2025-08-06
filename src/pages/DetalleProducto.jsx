import { useParams } from "react-router-dom";
import productos from "../data/productos";
import { useCart } from "../context/CartContext";

function DetalleProducto() {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === parseInt(id));
  const { agregarAlCarrito } = useCart();

  if (!producto) return <p>Producto no encontrado</p>;

  return (
    <div>
      <h1>{producto.nombre}</h1>
      <img src={producto.imagen} alt={producto.nombre} width="300" />
      <p>{producto.descripcion}</p>
      <p>Precio: ${producto.precio}</p>
      <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
    </div>
  );
}

export default DetalleProducto;
