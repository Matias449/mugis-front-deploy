import React, { useState, useEffect } from 'react';
import './ShopModal.css';
import { useNotification } from '../NotificationContext';

function ShopModal({
  isOpen, onClose, jugador, partidaId, onRefreshData,
}) {
  const { showNotification } = useNotification();
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  // Descriptions and icons matching the One Piece theme
  const getItemDetails = (nombre) => {
    switch (nombre) {
      case 'Madera':
        return {
          descripcion: 'Madera para reparar y mejorar tu barco. ¡Asegura tu supervivencia!',
          icono: '🪵',
          efecto: '+1 Madera',
        };
      case 'Comida':
        return {
          descripcion: 'Provisiones para mantener con energía a tu tripulación.',
          icono: '🍖',
          efecto: '+1 Comida',
        };
      case 'Bono Haki':
        return {
          descripcion: 'Entrenamiento espiritual intensivo para endurecer tu Haki.',
          icono: '✨',
          efecto: '+20 Haki',
        };
      case 'Gomu Gomu no Mi':
        return {
          descripcion: 'Fruta del Diablo legendaria tipo Paramecia. Poder de goma.',
          icono: '🍇',
          efecto: '+100 Haki',
        };
      case 'Mera Mera no Mi':
        return {
          descripcion: 'Fruta del Diablo tipo Logia que te permite controlar el fuego.',
          icono: '🔥',
          efecto: '+100 Haki',
        };
      default:
        return {
          descripcion: 'Un objeto exótico traído del mismísimo Grand Line.',
          icono: '📦',
          efecto: 'Efecto desconocido',
        };
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchShopItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/shop/items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensaje || 'Error al cargar ítems de la tienda');

        setItems(data.items || []);

        // Initialize quantities at 1 for all items
        const initialQuantities = {};
        data.items.forEach((item) => {
          initialQuantities[item.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopItems();
  }, [isOpen, API_URL, token]);

  const handleQuantityChange = (itemId, increment) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 1;
      const next = current + increment;
      return {
        ...prev,
        [itemId]: next < 1 ? 1 : next,
      };
    });
  };

  const handleComprar = async (item) => {
    const cantidad = quantities[item.id] || 1;
    const costoTotal = item.costo_berries * cantidad;

    if (jugador.berries < costoTotal) {
      showNotification('¡No tienes suficientes berries, marinero! Ve a buscar tesoros o combate.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/shop/comprar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          partida_id: partidaId,
          id_item: item.id,
          cantidad,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.mensaje || 'Error al procesar la compra');

      showNotification(data.mensaje || `Comprado con éxito: ${cantidad}x ${item.nombre}`, 'success');
      onRefreshData();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderShopContent = () => {
    if (loading && items.length === 0) {
      return <div className="shop-loading">Cargando mercancías del Grand Line...</div>;
    }
    if (error) {
      return <div className="shop-error">⚠️ {error}</div>;
    }
    if (items.length === 0) {
      return <div className="shop-empty">La tienda está vacía por hoy.</div>;
    }
    return (
      <div className="shop-items-grid">
        {items.map((item) => {
          const details = getItemDetails(item.nombre);
          const quantity = quantities[item.id] || 1;
          const cost = item.costo_berries * quantity;
          const canAfford = (jugador?.berries || 0) >= cost;

          return (
            <div key={item.id} className="shop-item-card">
              <div className="shop-item-icon-wrapper">
                <span className="shop-item-icon">{details.icono}</span>
              </div>
              <div className="shop-item-info">
                <h4>{item.nombre}</h4>
                <p className="shop-item-desc">{details.descripcion}</p>
                <span className="shop-item-effect">{details.efecto}</span>
              </div>

              <div className="shop-item-price-section">
                <span className="shop-price-label">Precio Unitario:</span>
                <span className="shop-unit-price">💰 {item.costo_berries} Berries</span>
              </div>

              <div className="shop-item-controls">
                <div className="quantity-selector">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, -1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <div className="shop-total-cost">
                  Total: <strong className={canAfford ? 'text-gold' : 'text-error'}>💰 {cost}</strong>
                </div>

                <button
                  className={`btn-shop-buy ${!canAfford ? 'btn-disabled' : ''}`}
                  onClick={() => handleComprar(item)}
                  disabled={!canAfford || loading}
                >
                  Comprar 🛒
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="shop-modal-overlay" onClick={onClose}>
      <div className="shop-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="shop-modal-header">
          <h2>Tienda del Puerto 🏪</h2>
          <div className="shop-player-berries">
            <span>💰 Mis Berries: <strong>{jugador?.berries || 0}</strong></span>
          </div>
          <button className="shop-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="shop-modal-body">
          {renderShopContent()}
        </div>
      </div>
    </div>
  );
}

export default ShopModal;
