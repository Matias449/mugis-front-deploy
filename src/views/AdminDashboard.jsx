import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cheatData, setCheatData] = useState({
    partida_id: '',
    jugador_id: '',
    recursos: {
      madera: 0,
      berries: 0,
      haki: 0
    }
  });

  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Decode JWT to check role
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.tipo_usuario !== 'administrador') {
        showNotification('Acceso denegado: No eres administrador.', 'error');
        navigate('/lobbys');
      } else {
        fetchData(activeTab);
      }
    } catch (error) {
      navigate('/login');
    }
  }, [activeTab, navigate, showNotification]);

  const fetchData = async (tab) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (tab === 'users') {
        const res = await fetch(`${apiUrl}/users`, { headers });
        const data = await res.json();
        setUsers(data.users || []);
      } else if (tab === 'games') {
        const res = await fetch(`${apiUrl}/game/partidas`, { headers });
        const data = await res.json();
        setPartidas(data.partidas || []);
      }
    } catch (error) {
      showNotification('Error al cargar datos del servidor', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario #${id}? Esta acción es irreversible.`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      showNotification('Usuario eliminado con éxito', 'success');
      fetchData('users');
    } catch (error) {
      showNotification('Error al eliminar usuario', 'error');
    }
  };

  const handleDeletePartida = async (id) => {
    if (!window.confirm(`¿Estás seguro de destruir la partida #${id}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/game/partidas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al destruir');
      showNotification('Partida destruida con éxito', 'success');
      fetchData('games');
    } catch (error) {
      showNotification('Error al destruir partida', 'error');
    }
  };

  const handleTogglePartidaType = async (id, currentType) => {
    const newType = currentType === 'publica' ? 'privada' : 'publica';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/game/partidas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tipo: newType })
      });
      if (!res.ok) throw new Error('Error al cambiar el tipo');
      showNotification(`Partida cambiada a ${newType}`, 'success');
      fetchData('games');
    } catch (error) {
      showNotification('Error al cambiar el tipo de partida', 'error');
    }
  };

  const handleCheatSubmit = async (e) => {
    e.preventDefault();
    if (!cheatData.partida_id || !cheatData.jugador_id) {
      showNotification('Debes proveer ID de partida y jugador', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/game/add-resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          partida_id: parseInt(cheatData.partida_id),
          jugador_id: parseInt(cheatData.jugador_id),
          recursos: {
            madera: parseInt(cheatData.recursos.madera) || 0,
            berries: parseInt(cheatData.recursos.berries) || 0,
            haki: parseInt(cheatData.recursos.haki) || 0
          }
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.mensaje || 'Error al inyectar recursos');
      }
      showNotification('Recursos inyectados exitosamente', 'success');
      setCheatData({ partida_id: '', jugador_id: '', recursos: { madera: 0, berries: 0, haki: 0 } });
    } catch (error) {
      showNotification(error.message || 'Error al inyectar recursos', 'error');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Panel de Administración 🛡️</h1>
        <button className="btn-back" onClick={() => navigate('/lobbys')}>Volver a Lobbys</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gestión de Usuarios
        </button>
        <button 
          className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Gestión de Partidas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cheats' ? 'active' : ''}`}
          onClick={() => setActiveTab('cheats')}
        >
          Consola de Trampas
        </button>
      </div>

      <div className="admin-content">
        {loading && activeTab !== 'cheats' ? (
          <div className="loading-spinner">Cargando datos del servidor...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="admin-table-container">
                <h2>Lista de Usuarios (Capitanes)</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.email || user.username}</td>
                        <td>
                          <span className={`role-badge ${user.tipo_usuario === 'administrador' ? 'admin' : 'player'}`}>
                            {user.tipo_usuario}
                          </span>
                        </td>
                        <td>
                          <button className="btn-danger" onClick={() => handleDeleteUser(user.id)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan="4" className="text-center">No hay usuarios</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'games' && (
              <div className="admin-table-container">
                <h2>Lista de Partidas (Travesías)</h2>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Código</th>
                      <th>Estado</th>
                      <th>Tipo</th>
                      <th>Creador / Jugadores</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partidas.map(partida => (
                      <tr key={partida.id}>
                        <td>#{partida.id}</td>
                        <td>{partida.codigo_sala || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${partida.estado}`}>
                            {partida.estado}
                          </span>
                        </td>
                        <td>{partida.tipo}</td>
                        <td>
                          <strong>{partida.creador}</strong>
                          <div className="players-list">
                            {partida.jugadores && partida.jugadores.length > 0 ? 
                              partida.jugadores.join(' vs ') : 
                              'Sin oponentes'}
                          </div>
                        </td>
                        <td className="actions-cell">
                          <button className="btn-warning" onClick={() => handleTogglePartidaType(partida.id, partida.tipo)}>
                            Cambiar Tipo
                          </button>
                          <button className="btn-danger" onClick={() => handleDeletePartida(partida.id)}>
                            Destruir
                          </button>
                        </td>
                      </tr>
                    ))}
                    {partidas.length === 0 && (
                      <tr><td colSpan="6" className="text-center">No hay partidas activas o registradas</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'cheats' && (
              <div className="admin-cheat-console">
                <h2>Consola del Mar de Supervivencia 🏴‍☠️</h2>
                <p>Inyecta recursos directamente en las partidas activas para alterar el flujo del juego.</p>
                <form className="cheat-form" onSubmit={handleCheatSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>ID de Partida</label>
                      <input 
                        type="number" 
                        required 
                        value={cheatData.partida_id}
                        onChange={(e) => setCheatData({...cheatData, partida_id: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>ID de Jugador</label>
                      <input 
                        type="number" 
                        required 
                        value={cheatData.jugador_id}
                        onChange={(e) => setCheatData({...cheatData, jugador_id: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-row resources-row">
                    <div className="form-group">
                      <label>💰 Berries</label>
                      <input 
                        type="number" 
                        value={cheatData.recursos.berries}
                        onChange={(e) => setCheatData({
                          ...cheatData, 
                          recursos: {...cheatData.recursos, berries: e.target.value}
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>🪵 Madera</label>
                      <input 
                        type="number" 
                        value={cheatData.recursos.madera}
                        onChange={(e) => setCheatData({
                          ...cheatData, 
                          recursos: {...cheatData.recursos, madera: e.target.value}
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>✨ Haki</label>
                      <input 
                        type="number" 
                        value={cheatData.recursos.haki}
                        onChange={(e) => setCheatData({
                          ...cheatData, 
                          recursos: {...cheatData.recursos, haki: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-submit-cheat">Inyectar Recursos</button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
