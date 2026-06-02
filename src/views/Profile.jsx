import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';
import { useNotification } from '../components/NotificationContext';

function Profile() {
  const { showNotification } = useNotification();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para actualizar datos
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    showNotification('Sesión cerrada. ¡Buen viaje por el Grand Line, Capitán! 🏴‍☠️', 'info');
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  }, [showNotification]);

  useEffect(() => {
    if (!token) {
      window.location.href = '/autenticacion';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al obtener datos del usuario');
        }

        setUser(data.user);
        setNewEmail(data.user.email);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        // Si el token es inválido o expiró, forzar logout
        if (err.message.includes('token') || err.message.includes('autenticador') || err.message.includes('expirado')) {
          handleLogout();
        }
      }
    };

    fetchUserData();
  }, [token, API_URL, handleLogout]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    setIsUpdating(true);

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword || undefined, // Solo lo enviamos si se ingresó uno nuevo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil');
      }

      setUpdateSuccess('¡Perfil actualizado con éxito! ✨');
      showNotification('¡Perfil actualizado con éxito! ✨', 'success');
      setUser(data.user);
      localStorage.setItem('username', data.user.email); // Sincronizamos
      setNewPassword(''); // Limpiar campo de contraseña
    } catch (err) {
      setUpdateError(err.message);
      showNotification(`Error al actualizar el perfil: ${err.message}`, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="spinner" />
        <p>Cargando datos del Capitán... ⚓</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error">
        <h2>⚠️ Error al Cargar Perfil</h2>
        <p>{error}</p>
        <button onClick={handleLogout} className="btn-logout">Volver al Puerto (Login)</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <main className="profile-card">
        <header className="profile-header">
          <div className="avatar-badge">🏴‍☠️</div>
          <h2>Bitácora de Capitán 📖</h2>
          <p>Consulta y modifica tus credenciales en el Grand Line</p>
        </header>

        <section className="profile-info-grid">
          <div className="info-item">
            <span className="info-label">Identificador de Tripulante (ID):</span>
            <span className="info-value">#{user?.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Rol en la Tripulación:</span>
            <span className={`info-value role-badge ${user?.tipo_usuario}`}>
              {user?.tipo_usuario === 'administrador' ? '👑 Administrador' : '⚔️ Capitán / Jugador'}
            </span>
          </div>
        </section>

        <hr className="divider" />

        <form onSubmit={handleUpdate} className="profile-form">
          <h3>Modificar Datos de Navegación 🛠️</h3>

          {updateSuccess && <div className="alert success">{updateSuccess}</div>}
          {updateError && <div className="alert error">{updateError}</div>}

          <div className="form-group">
            <label htmlFor="profile-email">Correo Electrónico:</label>
            <input
              type="email"
              id="profile-email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              placeholder="tu-correo@uc.cl"
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-password">Nueva Contraseña (dejar en blanco para mantener actual):</label>
            <input
              type="password"
              id="profile-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-update" disabled={isUpdating}>
            {isUpdating ? 'Actualizando datos...' : 'Guardar Cambios'}
          </button>
        </form>

        <footer className="profile-footer">
          <button onClick={handleLogout} className="btn-logout">
            Abandonar Barco (Cerrar Sesión) 🚪
          </button>
        </footer>
      </main>
    </div>
  );
}

export default Profile;
