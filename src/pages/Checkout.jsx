import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import "../Css/Checkout.css";

function Checkout() {
  const { carrito, vaciarCarrito } = useCart();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  // Generar HTML del carrito para el email
  const generarTablaCarrito = () => {
    const carritoSeguro = carrito || [];
    
    if (carritoSeguro.length === 0) {
      return "<p>No hay productos en el carrito</p>";
    }

    let filas = carritoSeguro.map(item => `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>$${item.precio}</td>
        <td>$${item.precio * item.cantidad}</td>
      </tr>
    `).join("");

    return `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
        <tfoot>
          <tr style="background-color: #f9f9f9; font-weight: bold;">
            <td colspan="3">TOTAL</td>
            <td>$${total}</td>
          </tr>
        </tfoot>
      </table>
    `;
  };

  // Enviar email con EmailJS
  const enviarEmail = async () => {
    try {
      console.log("Enviando email con carrito:", carrito);
      
      const templateParams = {
        nombre: nombre,
        email: email,
        carrito: generarTablaCarrito(),
        total: `$${total}`,
        fecha: new Date().toLocaleDateString('es-AR'),
        cantidad_productos: carrito.length
      };

      const response = await emailjs.send(
        "service_lo2b244",     // Tu Service ID
        "template_bgrfnbv",    // Tu Template ID
        templateParams,
        "0mfER7R_j1KtnPMs8"    // Tu Public Key
      );

      console.log("✅ Email enviado exitosamente!", response.status, response.text);
      return true;
    } catch (error) {
      console.error("❌ Error enviando el email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim() || !email.trim()) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    if (carrito.length === 0) {
      alert("No hay productos en el carrito.");
      return;
    }

    // Mostrar estado de carga
    setEnviandoEmail(true);

    try {
      // Intentar enviar el email
      const emailEnviado = await enviarEmail();
      
      if (emailEnviado) {
        // Si el email se envió correctamente
        alert("¡Compra realizada con éxito! Se ha enviado un correo de confirmación. Gracias por confiar en nosotros.");
        vaciarCarrito();
        navigate("/");
      } else {
        // Si hubo error enviando el email
        const continuar = window.confirm(
          "La compra se procesó correctamente, pero hubo un problema enviando el correo de confirmación. ¿Deseas continuar de todas formas?"
        );
        
        if (continuar) {
          vaciarCarrito();
          navigate("/");
        }
      }
    } finally {
      setEnviandoEmail(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Finalizá tu compra</h1>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <p>No hay productos en el carrito.</p>
          <button 
            className="btn-volver"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={enviandoEmail}
              required
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
              disabled={enviandoEmail}
              required
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
                  <div className="resumen-info">
                    <span className="nombre">{item.nombre}</span>
                    <span className="detalle">
                      {item.cantidad} x ${item.precio} = ${item.precio * item.cantidad}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total-section">
              <h3 className="total">Total a pagar: ${total}</h3>
              <p className="info-email">
                📧 Se enviará un correo de confirmación a: <strong>{email || "tu email"}</strong>
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-finalizar"
            disabled={enviandoEmail}
          >
            {enviandoEmail ? "Procesando compra..." : "Finalizar compra y enviar correo"}
          </button>

          {enviandoEmail && (
            <div className="loading-message">
              <p>⏳ Procesando tu compra y enviando correo de confirmación...</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default Checkout;