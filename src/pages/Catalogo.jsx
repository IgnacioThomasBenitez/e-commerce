import { useState, useEffect } from "react";
import CardProducto from "../components/CardProducto";
import "../Css/Catalogo.css";

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");

  // Cargar productos desde localStorage al montar
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(guardados);
  }, []);

  // Generar lista única de categorías
  const categoriasUnicas = ["todas", ...new Set(productos.map(p => p.categoria))];

  // Filtrado por nombre y categoría
  const filtrados = productos.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "todas" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div className="catalogo-container">
      <h1 className="catalogo-title">Catálogo de Productos</h1>

      <div className="catalogo-controls">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="catalogo-input"
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="catalogo-select"
        >
          {categoriasUnicas.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="catalogo-grid">
        {filtrados.map(p => (
          <CardProducto key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
