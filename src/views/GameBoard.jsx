import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Map from '../components/game/Map';
import Sidebar from '../components/game/Sidebar';
import ActionPanel from '../components/game/ActionPanel';
import socket from '../socket';
import './GameBoard.css';
import { useNotification } from '../components/NotificationContext';

function GameBoard() {
  const { showNotification } = useNotification();
  const { partida_id: partidaId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [mapData, setMapData] = useState({ islas: [], conexiones: [], escombros: [] });
  const [islaSeleccionada, setIslaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVictory, setShowVictory] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  const fetchGameData = useCallback(async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resEstado, resInv, resMapa] = await Promise.all([
        fetch(`${API_URL}/game/verificar-estado/${partidaId}`, { headers }),
        fetch(`${API_URL}/game/inventario/${partidaId}`, { headers }),
        fetch(`${API_URL}/game/mapa`, { headers }),
      ]);

      if (!resEstado.ok || !resInv.ok || !resMapa.ok) {
        throw new Error('Error al obtener datos de la partida');
      }

      const estadoData = await resEstado.json();
      const invData = await resInv.json();
      const mapaData = await resMapa.json();

      setMapData(mapaData.mapData || { islas: [], conexiones: [], escombros: [] });

      let myId = null;
      let username = 'Jugador';
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        myId = payload.id;
        username = payload.username;
      } catch {
        // token decode error
      }

      const newState = {
        partidaId,
        estado: estadoData.estado,
        ganador: estadoData.ganador,
        turno_actual_id: estadoData.turno_actual,
        jugador_actual: {
          ...invData.inventario,
          id: myId,
          username,
        },
      };

      setGameState(newState);
      setLoading(false);

      if (estadoData.ganador && estadoData.estado === 'finalizada') {
        setShowVictory(true);
        setTimeout(() => {
          showNotification(`¡La partida ha finalizado! Ganador ID: ${estadoData.ganador}`, 'success');
          localStorage.removeItem('salaActual');
          navigate('/lobby');
        }, 3000);
      }
    } catch {
      setLoading(false);
    }
  }, [token, partidaId, API_URL, showNotification, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/autenticacion');
    } else {
      fetchGameData();
    }
  }, [partidaId, token, navigate, fetchGameData]);

  useEffect(() => {
    if (!partidaId) return undefined;
    const channelName = `partida_${partidaId}`;

    const handleGameUpdate = (data) => {
      if (data.evento === 'partida_abandonada') {
        showNotification('El rival abandonó la partida. ¡Has ganado por abandono! 🏆', 'success');
      }
      fetchGameData();
    };

    socket.on(channelName, handleGameUpdate);

    return () => {
      socket.off(channelName, handleGameUpdate);
    };
  }, [partidaId, fetchGameData, showNotification]);

  if (loading) return <div className="loading">Cargando bitácora del Grand Line...</div>;
  if (!gameState) return <div className="error">No se pudo conectar a la partida activa.</div>;

  const esMiTurno = gameState.turno_actual_id === gameState.jugador_actual.id && !gameState.ganador;

  return (
    <div className="gameboard-container">
      <h2>
        Partida #
        {gameState.partidaId}
        {' '}
        🏴‍☠️
      </h2>
      {showVictory && (
        <div className="victory-overlay">
          <div className="victory-animation">
            <h1>¡Partida Finalizada! 👑</h1>
            <p>
              {gameState.ganador === gameState.jugador_actual.id
                ? '¡Has ganado la partida!'
                : 'Has sido derrotado.'}
            </p>
          </div>
        </div>
      )}
      <div className="gameboard-layout">
        <div className="gameboard-main">
          <Map
            mapData={mapData}
            islaActualJugador={gameState.jugador_actual.posicion_actual}
            islaActualRival={null}
            onSelectIsla={setIslaSeleccionada}
            islaSeleccionada={islaSeleccionada}
          />
          <ActionPanel
            esMiTurno={esMiTurno}
            jugador={gameState.jugador_actual}
            partidaId={gameState.partidaId}
            islaSeleccionada={islaSeleccionada}
            mapData={mapData}
            onRefreshData={fetchGameData}
          />
        </div>
        <div className="gameboard-side">
          <Sidebar
            jugadorActual={gameState.jugador_actual}
            esMiTurno={esMiTurno}
          />
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
