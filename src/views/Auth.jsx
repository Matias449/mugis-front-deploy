import React, { useState } from 'react';
import './Auth.css';
import { useNotification } from '../components/NotificationContext';

function Auth() {
  const { showNotification } = useNotification();
  // Estado para alternar entre Login (true) y Registro (false)
  const [isLogin, setIsLogin] = useState(true);

  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user'); // 'user' o 'admin' según la rúbrica

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    if (isLogin) {
      try {
        const response = await fetch(`${API_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Credenciales inválidas o error en el servidor');
        }

        // Guardamos el token JWT en el localStorage para proteger las rutas
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);

        showNotification('¡Inicio de sesión exitoso! Conectando al Grand Line...', 'success');
        setTimeout(() => {
          window.location.href = '/'; // Redirigimos al inicio
        }, 1500);
      } catch (error) {
        showNotification(`Error al iniciar sesión: ${error.message}`, 'error');
      }
    } else {
      try {
        const response = await fetch(`${API_URL}/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username, email, password, role,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al registrar el usuario');
        }

        showNotification('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
        setIsLogin(true); // Lo cambiamos a la vista de login
      } catch (error) {
        showNotification(`Error en el registro: ${error.message}`, 'error');
      }
    }
  };

  return (
    <div className="auth-container">
      <main className="auth-card">
        <header className="auth-header">
          <h2>{isLogin ? 'Iniciar Sesión 🏴‍☠️' : 'Registrarse en la Tripulación 📝'}</h2>
          <p>{isLogin ? 'Ingresa al Grand Line' : 'Crea tu cuenta de capitán o administrador'}</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Ej: MonkeyDLuffy"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu-correo@uc.cl"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {/* Selector de Roles exigido por el enunciado para el Registro */}
          {!isLogin && (
            <fieldset className="form-group role-selector">
              <legend>Selecciona tu Rol:</legend>
              <div className="radio-options">
                <label htmlFor="role-user">
                  <input
                    type="radio"
                    id="role-user"
                    name="role"
                    value="user"
                    checked={role === 'user'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Usuario Normal
                </label>
                <label htmlFor="role-admin">
                  <input
                    type="radio"
                    id="role-admin"
                    name="role"
                    value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Administrador
                </label>
              </div>
            </fieldset>
          )}

          <button type="submit" className="btn-submit">
            {isLogin ? 'Ingresar' : 'Crear Cuenta'}
          </button>
        </form>

        <footer className="auth-footer">
          <button
            type="button"
            className="btn-toggle"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? '¿No tienes cuenta? Regístrate aquí'
              : '¿Ya tienes una cuenta? Inicia sesión'}
          </button>
        </footer>
      </main>
    </div>
  );
}

export default Auth;
