// src/pages/Gestion.jsx
import { useState, useEffect } from "react";
import "../Css/Gestion.css";

export default function Gestion() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cuotas, setCuotas] = useState(1);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem("productos"));
      if (Array.isArray(guardados)) setProductos(guardados);
    } catch (e) {
      console.error("Error leyendo productos desde localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const resetForm = () => {
    setNombre("");
    setPrecio("");
    setImagen("");
    setCategoria("");
    setCuotas(1);
    setEditId(null);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precio || !imagen.trim() || !categoria.trim()) {
      alert("Completa todos los campos.");
      return;
    }

    const productoData = {
      id: editId !== null ? editId : Date.now(),
      nombre: nombre.trim(),
      precio: Number(precio),
      imagen: imagen.trim(),
      categoria: categoria.trim(),
      cuotas: Number(cuotas),
    };

    if (editId !== null) {
      setProductos((prev) =>
        prev.map((p) => (p.id === editId ? productoData : p))
      );
      resetForm();
    } else {
      setProductos((prev) => [...prev, productoData]);
      resetForm();
    }
  };

  const editarProducto = (id) => {
    const prod = productos.find((p) => p.id === id);
    if (!prod) return;
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setImagen(prod.imagen);
    setCategoria(prod.categoria);
    setCuotas(prod.cuotas || 1);
    setEditId(prod.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarProducto = (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este producto?")) return;
    setProductos((prev) => prev.filter((p) => p.id !== id));
    if (editId === id) resetForm();
  };

  const calcularPorCuota = (precio, cuotas) => {
    return (precio / cuotas).toFixed(2);
  };

  return (
    <div className="gestion-container">
      <h1>Panel de Gestión</h1>

      <form onSubmit={manejarEnvio} className="gestion-form">
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Precio"
          type="number"
          min="0"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <input
          placeholder="URL de imagen"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />
        <input
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        <select value={cuotas} onChange={(e) => setCuotas(e.target.value)}>
          {[1, 3, 6, 12].map((op) => (
            <option key={op} value={op}>
              {op} {op > 1 ? "cuotas" : "cuota"}
            </option>
          ))}
        </select>

        <div className="gestion-buttons">
          <button type="submit">
            {editId !== null ? "Guardar cambios" : "Agregar producto"}
          </button>

          {editId !== null && (
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="h2">Lista de productos ({productos.length})</h2>
      {productos.length === 0 ? (
        <p>No hay productos aún.</p>
      ) : (
        <table className="gestion-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Cuotas</th>
              <th>Precio por cuota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/60x60?text=No+img";
                    }}
                  />
                </td>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.categoria}</td>
                <td>
                  <select
                    value={p.cuotas}
                    onChange={(e) =>
                      setProductos((prev) =>
                        prev.map((prod) =>
                          prod.id === p.id
                            ? { ...prod, cuotas: Number(e.target.value) }
                            : prod
                        )
                      )
                    }
                  >
                    {[1, 3, 6, 12].map((op) => (
                      <option key={op} value={op}>
                        {op} {op > 1 ? "cuotas" : "cuota"}
                      </option>
                    ))}
                  </select>
                </td>
                <td>${calcularPorCuota(p.precio, p.cuotas)}</td>
                <td className="gestion-actions">
                  <button onClick={() => editarProducto(p.id)}>✏️ Editar</button>
                  <button onClick={() => eliminarProducto(p.id)}>🗑️ Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
