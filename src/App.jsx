import React from 'react';
import {
  BrowserRouter as Router, Routes, Route, Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './views/Landing';
import Instructions from './views/Instructions';
import AboutUs from './views/AboutUs';
import Auth from './views/Auth';
import Lobby from './views/Lobby';
import GameBoard from './views/GameBoard';
import Profile from './views/Profile';
import AdminDashboard from './views/AdminDashboard';
import { NotificationProvider } from './components/NotificationContext';

// Redirecciona dinámicamente si entran a /juego directamente
function GameRedirect() {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/lobby" replace /> : <Navigate to="/autenticacion" replace />;
}

function App() {
  return (
    <NotificationProvider>
      <Router>
        {/* La barra de navegación estará siempre presente */}
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/instrucciones" element={<Instructions />} />
            <Route path="/nosotros" element={<AboutUs />} />
            <Route path="/autenticacion" element={<Auth />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/juego" element={<GameRedirect />} />
            <Route path="/juego/:partida_id" element={<GameBoard />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </Router>
    </NotificationProvider>
  );
}

export default App;
