import React from 'react';
import './Sidebar.css';

function Sidebar({ jugadorActual, esMiTurno }) {
  const state = jugadorActual || {
    username: 'Cargando...',
    berries: 0,
    madera: 0,
    haki: 0,
    comida: 0,
    nivel_barco: 1,
  };

  return (
    <aside className="game-sidebar">
      <div className="turn-indicator">
        {esMiTurno ? (
          <span className="badge active">Tu Turno</span>
        ) : (
          <span className="badge waiting">Esperando Rival...</span>
        )}
      </div>

      <div className="player-info">
        <h3>{state.username ? state.username.split('@')[0] : 'Cargando...'}</h3>
        <p>🚢 Nivel del Barco: {state.nivel_barco}</p>
      </div>

      <div className="resources-panel">
        <h4>Recursos</h4>
        <ul>
          <li>💰 Berries: {state.berries}</li>
          <li>🪵 Madera: {state.madera}</li>
          <li>✨ Haki: {state.haki}</li>
          <li>🍖 Comida: {state.comida}</li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
