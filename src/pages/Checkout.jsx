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
  const [cuotas, setCuotas] = useState(1);
  const [metodoEnvio, setMetodoEnvio] = useState("envio");
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  // 🔹 Formateador de precios en pesos argentinos
  const formatPrice = (valor) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(valor);

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const calcularMontoCuota = () => total / cuotas;

  const generarTablaCarrito = () => {
    if (!carrito || carrito.length === 0) {
      return "<p>No hay productos en el carrito</p>";
    }

    const filas = carrito
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.nombre}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.cantidad}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatPrice(item.precio)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatPrice(item.precio * item.cantidad)}</td>
      </tr>
    `
      )
      .join("");

    return `
      <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th style="padding: 8px; border: 1px solid #ddd;">Producto</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Precio Unitario</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
        </tbody>
        <tfoot>
          <tr style="background-color: #f9f9f9; font-weight: bold;">
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">TOTAL</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${formatPrice(total)}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Forma de pago</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
              ${cuotas} ${cuotas > 1 ? `cuotas de ${formatPrice(calcularMontoCuota())}` : "cuota única"}
            </td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">Método de entrega</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
              ${metodoEnvio === "envio" ? "Envío a domicilio" : "Retiro en local"}
            </td>
          </tr>
        </tfoot>
      </table>
    `;
  };

  const enviarEmail = async () => {
    try {
      const templateParams = {
        nombre,
        email,
        carrito: generarTablaCarrito(),
        total: formatPrice(total),
        fecha: new Date().toLocaleDateString("es-AR"),
        cantidad_productos: carrito.length,
        cuotas,
        monto_cuota: formatPrice(calcularMontoCuota()),
        metodo_envio: metodoEnvio === "envio" ? "Envío a domicilio" : "Retiro en local",
      };

      await emailjs.send(
        "service_lo2b244",
        "template_bgrfnbv",
        templateParams,
        "0mfER7R_j1KtnPMs8"
      );

      return true;
    } catch (error) {
      console.error("Error enviando el email:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim()) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    if (carrito.length === 0) {
      alert("No hay productos en el carrito.");
      return;
    }

    setEnviandoEmail(true);

    try {
      const emailEnviado = await enviarEmail();

      if (emailEnviado) {
        alert(
          "¡Compra realizada con éxito! Se ha enviado un correo de confirmación. Gracias por confiar en nosotros."
        );
        vaciarCarrito();
        navigate("/");
      } else {
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
          <button className="btn-volver" onClick={() => navigate("/")}>
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

          <div className="form-group">
            <label htmlFor="cuotas">Forma de pago</label>
            <select
              id="cuotas"
              value={cuotas}
              onChange={(e) => setCuotas(Number(e.target.value))}
              disabled={enviandoEmail}
            >
              {[1, 3, 6, 12].map((op) => (
                <option key={op} value={op}>
                  {op} {op > 1 ? "cuotas" : "cuota"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group envio-group">
            <label>Método de entrega</label>
            <div className="envio-opciones">
              <label className="checkbox-container">
                <input
                  type="radio"
                  name="metodoEnvio"
                  value="envio"
                  checked={metodoEnvio === "envio"}
                  onChange={() => setMetodoEnvio("envio")}
                  disabled={enviandoEmail}
                />
                <span className="checkmark"></span>
                Envío a domicilio
              </label>

              <label className="checkbox-container">
                <input
                  type="radio"
                  name="metodoEnvio"
                  value="retiro"
                  checked={metodoEnvio === "retiro"}
                  onChange={() => setMetodoEnvio("retiro")}
                  disabled={enviandoEmail}
                />
                <span className="checkmark"></span>
                Retiro en local
              </label>
            </div>
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
                      {item.cantidad} x {formatPrice(item.precio)} ={" "}
                      {formatPrice(item.precio * item.cantidad)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total-section">
              <h3 className="total">Total a pagar: {formatPrice(total)}</h3>
              {cuotas > 1 && (
                <p className="detalle-cuotas">
                  Pagás en {cuotas} cuotas de {formatPrice(calcularMontoCuota())}
                </p>
              )}
              <p>
                <strong>Método de entrega:</strong>{" "}
                {metodoEnvio === "envio" ? "Envío a domicilio" : "Retiro en local"}
              </p>
              <p className="info-email">
                📧 Se enviará un correo de confirmación a:{" "}
                <strong>{email || "tu email"}</strong>
              </p>
            </div>
          </div>

          <button type="submit" className="btn-finalizar" disabled={enviandoEmail}>
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
