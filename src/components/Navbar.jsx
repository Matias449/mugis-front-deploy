import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useNotification } from './NotificationContext';

function Navbar() {
  const { showNotification } = useNotification();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || 'Capitán');
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.tipo_usuario === 'administrador') {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error('Error decoding token', e);
      }
    } else {
      setIsLoggedIn(false);
      setUsername('');
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);
    setDropdownOpen(false);
    showNotification('Sesión cerrada. ¡Buen viaje por el Grand Line! 🏴‍☠️', 'info');
    setTimeout(() => {
      navigate('/');
      window.location.reload(); // Recargamos para refrescar todos los estados de la app
    }, 1500);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🏴‍☠️ Grand Line Rush</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/instrucciones">Cómo Jugar</Link></li>
        <li><Link to="/nosotros">Nosotros</Link></li>

        {isLoggedIn ? (
          <li className="navbar-dropdown-container">
            <button
              className={`navbar-dropdown-toggle ${dropdownOpen ? 'active' : ''}`}
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              Mi Cuenta 👤
            </button>
            {dropdownOpen && (
              <ul className="navbar-dropdown-menu">
                <li className="dropdown-user-info">
                  <span className="dropdown-user-role">Capitán Activo</span>
                  <span className="dropdown-username" title={username}>{username}</span>
                </li>
                <li className="dropdown-divider" />
                <li>
                  <Link to="/perfil" onClick={() => setDropdownOpen(false)}>
                    📖 Ver Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/lobby" onClick={() => setDropdownOpen(false)}>
                    🎮 Ir al Lobby
                  </Link>
                </li>
                {isAdmin && (
                  <>
                    <li className="dropdown-divider" />
                    <li>
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}>
                        🛡️ Panel de Control
                      </Link>
                    </li>
                  </>
                )}
                <li className="dropdown-divider" />
                <li>
                  <button onClick={handleLogout} className="dropdown-logout-btn">
                    🚪 Cerrar Sesión
                  </button>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li>
            <Link to="/autenticacion" className="login-link">Ingresar 🔑</Link>
          </li>
        )}

        <li>
          <Link to="/juego" className="play-link">Partida ⚔️</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
