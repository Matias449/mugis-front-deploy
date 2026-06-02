import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      {/* Encabezado principal o Hero Section */}
      <header className="landing-hero">
        <h1>¡Bienvenidos a Grand Line Rush! 🏴‍☠️</h1>
        <p>
          El juego de estrategia definitivo donde competirás por convertirte
          en el Rey de los Piratas. Gestiona tus recursos, mejora tu barco y navega el océano.
        </p>
        <Link to="/autenticacion" className="btn-cta">
          Comenzar Aventura
        </Link>
      </header>

      {/* Secciones informativas para orientar al usuario */}
      <section className="landing-features">
        <h2>¿Qué te espera en el Grand Line?</h2>

        <div className="features-container">
          <article className="feature-card">
            <div className="feature-icon">🚢</div>
            <h3>Navegación Estratégica</h3>
            <p>Muévete de isla en isla gastando recursos de forma inteligente. Cada destino tiene peligros y recompensas únicas.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Economía Pirata</h3>
            <p>Acumula Berries en tus travesías para gastar en la tienda o reúne madera para aumentar el nivel de tu navío y obtener ventajas.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">⚔️</div>
            <h3>Combates en Tiempo Real</h3>
            <p>Sincroniza tus turnos y enfréntate a otros capitanes gracias a la tecnología de comunicación bidireccional en vivo.</p>
          </article>
        </div>
      </section>

      {/* Footer informativo básico */}
      <footer className="landing-footer">
        <p>© 2026 Grand Line Rush - Proyecto IIC2513. Hecho con React.</p>
      </footer>
    </div>
  );
}

export default Landing;
