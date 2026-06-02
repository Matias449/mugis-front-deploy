import React from 'react';
import './Instructions.css';

function Instructions() {
  return (
    <div className="instructions-container">
      <header className="instructions-header">
        <h2>Manual del Grand Line: ¿Cómo se juega? 📜</h2>
        <p>Reglas oficiales de &quot;Grand Line Rush&quot; para Piratas y Administradores.</p>
      </header>

      {/* Sección para Jugadores / Usuarios Normales */}
      <section className="instructions-section">
        <h3>1. Guía del Jugador (Usuario Normal)</h3>
        <p className="section-intro">
          Tu objetivo es recorrer el Grand Line, recolectar materiales,
          mejorar tu navío y ser el primero en derrotar al Jefe Final en Enies Lobby.
        </p>

        <div className="rules-grid">
          <article className="rule-card">
            <h4>Sistema de Turnos</h4>
            <p>El juego se desarrolla de forma secuencial. Al iniciar la partida,
              el &quot;Árbitro&quot; reparte los recursos básicos
              (10 de comida, 20 de haki) y le asigna el turno al primer jugador.
            </p>
          </article>

          <article className="rule-card">
            <h4>Movimiento y Navegación</h4>
            <p>Durante tu turno, puedes gastar recursos para mover tu barco a
              través de las diferentes islas del tablero. Cada isla presenta desafíos,
              tiendas o combates únicos.
            </p>
          </article>

          <article className="rule-card">
            <h4>La Tienda y el Barco</h4>
            <p>Puedes gastar tus Berries acumulados en la tienda para comprar ítems
              estratégicos. Además, si recolectas 5 unidades de madera,
              puedes ejecutar la acción &quot;Mejorar Barco&quot; para aumentar de nivel tu navío.
            </p>
          </article>

          <article className="rule-card">
            <h4>Condición de Victoria</h4>
            <p>Debes prepararte acumulando Haki para el combate final. El primer pirata que logre
              llegar a la última isla y derrote con éxito al Jefe Final
              se coronará como el Rey de los Piratas.
            </p>
          </article>
        </div>
      </section>

      <hr className="divider" />

      {/* Sección para Administradores */}
      <section className="instructions-section admin-section">
        <h3>2. Guía del Administrador</h3>
        <p className="section-intro">
          Los usuarios registrados con el rol de Administrador cuentan con acceso
          exclusivo a las rutas de gestión y mantenimiento de las salas de juego.
        </p>

        <ul className="admin-list">
          <li>
            <strong>Control de Partidas:</strong> Capacidad para auditar las
            salas creadas, ver el estado interno de los turnos de manera global
            y eliminar partidas inactivas o corruptas.
          </li>
          <li>
            <strong>Gestión de Usuarios:</strong> Monitoreo de los capitanes
            registrados en el sistema, con permisos para actualizar datos de
            perfil o banear cuentas que alteren el juego.
          </li>
          <li>
            <strong>Mantenimiento del Servidor:</strong> Acceso a métricas
            de sincronización de datos y supervisión del estado de las
            conexiones en tiempo real.
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Instructions;
