import React, { useState } from 'react';
import ShopModal from './ShopModal';
import './ActionPanel.css';
import { useNotification } from '../NotificationContext';

function ActionPanel({
  esMiTurno, jugador, partidaId, islaSeleccionada, mapData, onRefreshData,
}) {
  const { showNotification, showConfirm } = useNotification();
  const [showInfo, setShowInfo] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');
  const maderaActual = jugador?.madera || 0;

  // Determinar la isla actual en base al mapData
  const islaActual = mapData?.islas?.find((i) => i.id === jugador?.posicion_actual);
  const tipoIsla = islaActual?.tipo || 'pacifico';

  const handleAction = async (endpoint, payload) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partida_id: partidaId, ...payload }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error en la acción');

      showNotification(data.mensaje || 'Acción completada', 'success');
      onRefreshData();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleMover = () => {
    if (!islaSeleccionada) {
      showNotification('Debes seleccionar una isla de destino en el mapa primero.', 'warning');
      return;
    }
    handleAction('/game/mover', { destino_isla_id: islaSeleccionada });
  };

  const handleCombate = () => {
    handleAction('/game/combate', { enemigo_id: islaActual.id });
  };

  const handleRuleta = () => {
    handleAction('/game/ruleta', {});
  };

  const handleTerminarTurno = () => {
    handleAction('/game/terminar-turno', {});
  };

  const handleMejorarBarco = () => {
    handleAction('/game/mejorar-barco', {});
  };

  const handleAbandonar = () => {
    showConfirm(
      '¿Estás seguro que deseas abandonar la partida? Perderás automáticamente.',
      () => {
        handleAction('/game/abandonar', {});
      },
    );
  };

  const renderContextualButton = () => {
    if (tipoIsla === 'combate' || tipoIsla === 'final') {
      return (
        <button
          type="button"
          onClick={handleCombate}
          className="btn-action btn-combat"
          disabled={!esMiTurno}
        >
          Combatir ⚔️
        </button>
      );
    }
    if (tipoIsla === 'tesoro') {
      return (
        <button
          type="button"
          onClick={handleRuleta}
          className="btn-action btn-treasure"
          disabled={!esMiTurno}
        >
          Buscar Tesoro 💎
        </button>
      );
    }
    return (
      <button
        type="button"
        className="btn-action btn-rest"
        disabled
      >
        Descansar 🏕️
      </button>
    );
  };

  return (
    <section className="action-panel">
      <h3>Acciones de Turno</h3>
      <div className="actions-container">

        <button
          type="button"
          onClick={handleMover}
          className="btn-action btn-move"
          disabled={!esMiTurno || !islaSeleccionada}
        >
          Mover Barco 🚢
        </button>

        <div className="contextual-action-wrapper">
          {renderContextualButton()}
          <button className="btn-info" onClick={() => setShowInfo(!showInfo)} title="Ver info">ℹ️</button>

          {showInfo && (
            <div className="info-popup">
              <h4>Mecánicas de la Isla</h4>
              <p><strong>⚔️ Combate:</strong> Enfréntate a enemigos. Tu probabilidad de ganar se calcula por tu Haki +30 Base enemigo. Victoria = +Haki +Berries. Derrota = Pierdes 1 de comida y vuelves al inicio.</p>
              <p><strong>💎 Tesoro:</strong> Gira la ruleta y prueba tu suerte. Puedes obtener Frutas del Diablo, Berries, o caer en trampas de la Marina.</p>
              <p><strong>🏕️ Descansar:</strong> Zona pacífica. No hay acciones especiales aquí, solo prepárate para el siguiente viaje.</p>
              <button onClick={() => setShowInfo(false)}>Cerrar</button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleMejorarBarco}
          className="btn-action btn-upgrade"
          disabled={!esMiTurno || maderaActual < 5}
        >
          Mejorar Barco (-5 Madera) 🪵
        </button>

        <button
          type="button"
          onClick={() => setShowShop(true)}
          className="btn-action btn-shop"
          disabled={!esMiTurno}
        >
          Tienda 🏪
        </button>

        <button
          type="button"
          onClick={handleTerminarTurno}
          className="btn-action btn-end-turn"
          disabled={!esMiTurno}
        >
          Terminar Turno ⏳
        </button>

        <button
          type="button"
          onClick={handleAbandonar}
          className="btn-action btn-surrender"
          disabled={!esMiTurno}
        >
          Abandonar Partida 🏳️
        </button>
      </div>

      <ShopModal
        isOpen={showShop}
        onClose={() => setShowShop(false)}
        jugador={jugador}
        partidaId={partidaId}
        onRefreshData={onRefreshData}
      />
    </section>
  );
}

export default ActionPanel;
