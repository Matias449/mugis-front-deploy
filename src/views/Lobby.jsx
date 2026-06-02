import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css';

function Lobby() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persistimos el estado de la sala actual para no perderlo al recargar la página
  const [salaActual, setSalaActual] = useState(() => {
    const saved = localStorage.getItem('salaActual');
    return saved ? JSON.parse(saved) : null;
  });

  const [codigoUnirse, setCodigoUnirse] = useState('');
  const [partidasActivas, setPartidasActivas] = useState([]);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/autenticacion');
    }
  }, [token, navigate]);

  // Cargar partidas activas de este usuario al montar el lobby
  useEffect(() => {
    if (!token) return;

    const fetchPartidasActivas = async () => {
      try {
        const response = await fetch(`${API_URL}/game/activas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setPartidasActivas(data.partidas || []);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPartidasActivas();
  }, [token, API_URL]);

  // Sincronizar la sala con el localStorage
  useEffect(() => {
    if (salaActual) {
      localStorage.setItem('salaActual', JSON.stringify(salaActual));
    } else {
      localStorage.removeItem('salaActual');
    }
  }, [salaActual]);

  // Polling para verificar si la partida inició (útil para el jugador invitado)
  useEffect(() => {
    let intervalId;
    if (salaActual && salaActual.estado === 'esperando') {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${API_URL}/game/verificar-estado/${salaActual.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.estado === 'en_curso') {
              // Limpiamos la sala guardada antes de ir a jugar
              localStorage.removeItem('salaActual');
              navigate(`/juego/${salaActual.id}`);
            }
          }
        } catch (err) {
          // silenciado para no dar problemas a Linter
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [salaActual, navigate, API_URL, token]);

  const handleCrearPartida = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/game/crear`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error al crear partida');

      setSalaActual({
        id: data.partida.id,
        codigo_sala: data.partida.codigo_sala,
        estado: data.partida.estado,
        soyCreador: true,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnirsePartida = async (e) => {
    e.preventDefault();
    if (!codigoUnirse) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/game/unirse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ codigo_sala: codigoUnirse.toUpperCase() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error al unirse');

      setSalaActual({
        id: data.partida.id,
        codigo_sala: data.partida.codigo_sala,
        estado: data.partida.estado,
        soyCreador: false,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarPartida = async () => {
    if (!salaActual) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/game/iniciar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ partida_id: salaActual.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error al iniciar partida');

      // Limpiamos la sala guardada antes de ir a jugar
      localStorage.removeItem('salaActual');
      navigate(`/juego/${salaActual.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h2>Taberna Pirata 🍻</h2>
        <p>Prepara tu tripulación para entrar al Grand Line</p>

        {error && <div className="lobby-error">{error}</div>}

        {!salaActual ? (
          <div className="lobby-actions">
            {partidasActivas.length > 0 && (
              <div className="action-box active-games-box">
                <h3>Tus Partidas en Curso ⚓</h3>
                <div className="active-games-list">
                  {partidasActivas.map((p) => (
                    <div key={p.id} className="active-game-item">
                      <div className="active-game-info">
                        <span className="game-code">Código: {p.codigo_sala}</span>
                        <span className={`game-status ${p.estado}`}>
                          {p.estado === 'en_curso' ? '⚔️ En Curso' : '⏳ Esperando'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (p.estado === 'en_curso') {
                            navigate(`/juego/${p.id}`);
                          } else {
                            setSalaActual({
                              id: p.id,
                              codigo_sala: p.codigo_sala,
                              estado: p.estado,
                              soyCreador: p.soyCreador,
                            });
                          }
                        }}
                        className="btn-resume"
                      >
                        {p.estado === 'en_curso' ? 'Reingresar Partida ⚔️' : 'Ir a la Sala 🚪'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="action-box">
              <h3>Nueva Aventura</h3>
              <button
                className="btn-create"
                onClick={handleCrearPartida}
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Partida'}
              </button>
            </div>

            <div className="action-divider"><span>O</span></div>

            <div className="action-box">
              <h3>Unirse a Tripulación</h3>
              <form onSubmit={handleUnirsePartida}>
                <input
                  type="text"
                  placeholder="Código de la Sala"
                  value={codigoUnirse}
                  onChange={(e) => setCodigoUnirse(e.target.value)}
                  maxLength={6}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn-join"
                  disabled={loading || !codigoUnirse}
                >
                  {loading ? 'Uniéndose...' : 'Unirse'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="lobby-waiting">
            <h3>Sala: <span>{salaActual.codigo_sala}</span></h3>
            <p>Estado: {salaActual.estado === 'esperando' ? 'Esperando tripulación...' : salaActual.estado}</p>

            {salaActual.soyCreador ? (
              <div className="creator-panel">
                <p>Comparte el código con tu rival. Cuando esté listo, inicia la travesía.</p>
                <button
                  className="btn-start"
                  onClick={handleIniciarPartida}
                  disabled={loading}
                >
                  {loading ? 'Iniciando...' : 'Zarpar (Iniciar Partida)'}
                </button>
              </div>
            ) : (
              <div className="guest-panel">
                <p>Esperando a que el creador de la sala inicie la partida...</p>
                <div className="loader" />
              </div>
            )}

            <button
              className="btn-leave"
              onClick={() => setSalaActual(null)}
              disabled={loading}
            >
              Abandonar Sala 🚪
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lobby;
