import React, {
  createContext, useContext, useState, useCallback, useMemo,
} from 'react';
import './NotificationContext.css';

const NotificationContext = createContext(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ isOpen: false, message: '', onConfirm: null });

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const showConfirm = useCallback((message, onConfirm) => {
    setConfirm({
      isOpen: true,
      message,
      onConfirm: () => {
        setConfirm({ isOpen: false, message: '', onConfirm: null });
        if (onConfirm) onConfirm();
      },
    });
  }, []);

  const handleCancelConfirm = () => {
    setConfirm({ isOpen: false, message: '', onConfirm: null });
  };

  const contextValue = useMemo(
    () => ({ showNotification, showConfirm }),
    [showNotification, showConfirm],
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}

      {/* Floating Toasts List Container */}
      <div className="toasts-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'info' && 'ℹ️'}
            </span>
            <div className="toast-message">{toast.message}</div>
            <button
              className="toast-close-btn"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              &times;
            </button>
            <div className="toast-progress-bar" />
          </div>
        ))}
      </div>

      {/* Custom Confirmation Modal */}
      {confirm.isOpen && (
        <div className="confirm-overlay" onClick={handleCancelConfirm}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <h3>Confirmación del Capitán 🏴‍☠️</h3>
            </div>
            <div className="confirm-body">
              <p>{confirm.message}</p>
            </div>
            <div className="confirm-footer">
              <button className="btn-confirm-cancel" onClick={handleCancelConfirm}>
                Cancelar ❌
              </button>
              <button
                className="btn-confirm-accept"
                onClick={confirm.onConfirm}
              >
                Aceptar ⚔️
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
