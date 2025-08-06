import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Css/Home.css";

const imagenesCarrusel = [
  { id: 1, url: "https://www.asus.com/media/Odin/Websites/global/ProductLine/20200824120814.jpg", alt: "Oferta 1" },
  { id: 2, url: "https://tse2.mm.bing.net/th/id/OIP.uewfTwllAJwRDflSC93THwHaGX?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", alt: "Oferta 2" },
  { id: 3, url: "https://tse1.mm.bing.net/th/id/OIP.I5y8FPMatMiV8d5n1XSvugHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", alt: "Oferta 3" }
];

export default function Home() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenesCarrusel.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="home-container">
      <div className="carrusel">
        {imagenesCarrusel.map((img, i) => (
          <img
            key={img.id}
            src={img.url}
            alt={img.alt}
            className={`slide ${i === indice ? "active" : ""}`}
          />
        ))}
      </div>
      <h1>Bienvenido a la tienda</h1>
      <p>Explorá nuestros productos y agregalos al carrito.</p>

      <Link to="/catalogo" className="catalogo-link">Ir al Catálogo</Link>
    </div>
  );
}
