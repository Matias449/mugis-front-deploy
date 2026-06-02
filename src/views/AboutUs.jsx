import React from 'react';
import './AboutUs.css';

function AboutUs() {
  const integrantes = [
    {
      id: 1,
      nombre: 'Matías Acuña',
      rol: 'Frontend Master & UI (Integrante 1)',
      recompensa: '500,000,000 ฿',
      descripcion: 'Encargado de timonear la interfaz en React, modularizar los componentes del tablero y domar el linter de Airbnb.',
    },
    {
      id: 2,
      nombre: 'Agustín Chateau',
      rol: 'Backend & Real-Time Expert (Integrante 2)',
      recompensa: '480,000,000 ฿',
      descripcion: 'Diseñador del servidor de WebSockets, las pruebas unitarias en Jest y el control de flujos del Árbitro en Koa.',
    },
    {
      id: 3,
      nombre: 'Javier Torres',
      rol: 'Integration & Auth Specialist (Integrante 3)',
      recompensa: '450,000,000 ฿',
      descripcion: 'El puente del equipo. Conecta los formularios al backend usando JWT, protege las rutas y maneja el despliegue.',
    },
  ];

  return (
    <div className="about-container">
      <header className="about-header">
        <h2>La Tripulación de Desarrollo 🏴‍☠️</h2>
        <p>Los ingenieros detrás de la simulación del Grand Line</p>
      </header>

      <section className="about-grid">
        {integrantes.map((miembro) => (
          <article key={miembro.id} className="crew-card">
            <div className="crew-avatar">🏴‍☠️</div>
            <div className="crew-info">
              <h3>{miembro.nombre}</h3>
              <span className="crew-rol">{miembro.rol}</span>
              <p className="crew-bounty">
                <strong>Recompensa:</strong> {miembro.recompensa}
              </p>
              <p className="crew-desc">{miembro.descripcion}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default AboutUs;
