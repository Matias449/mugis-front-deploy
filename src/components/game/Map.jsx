import React from 'react';
import './Map.css';

// Topología estática basada en el backend de Grand Line (Islas 1 al 7)
const GRAND_LINE_MAP = [
  {
    id: 1, name: 'Cabo Gemelo', type: 'inicio', x: 10, y: 50,
  },
  {
    id: 2, name: 'Skypiea', type: 'pacifico', x: 30, y: 20,
  },
  {
    id: 3, name: 'Thriller Bark', type: 'combate', x: 30, y: 80,
  },
  {
    id: 4, name: 'Dressrosa', type: 'combate', x: 50, y: 50,
  },
  {
    id: 5, name: 'Zou', type: 'tesoro', x: 70, y: 30,
  },
  {
    id: 6, name: 'Wano', type: 'combate', x: 85, y: 70,
  },
  {
    id: 7, name: 'Onigashima', type: 'final', x: 95, y: 50,
  },
];

// Conexiones de rutas marítimas
const CONNECTIONS = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
  { from: 5, to: 6 },
  { from: 6, to: 7 },
];

const ICONS = {
  inicio: '⚓',
  pacifico: '🏝️',
  combate: '⚔️',
  tesoro: '💎',
  final: '☠️',
};

function Map({
  mapData, islaActualJugador, islaActualRival, onSelectIsla, islaSeleccionada,
}) {
  const { islas = [], conexiones = [], escombros = [] } = mapData || {};

  // Merge dynamic backend islands with our static coordinates/types for visuals
  const visualIslands = islas.map((isla) => {
    const staticData = GRAND_LINE_MAP.find((i) => i.id === isla.id);
    return {
      ...isla,
      x: staticData ? staticData.x : 50,
      y: staticData ? staticData.y : 50,
      tipo: isla.tipo || (staticData ? staticData.type : 'pacifico'),
    };
  });

  return (
    <section className="game-map">
      <h3 className="map-title">Mapa del Grand Line</h3>

      <div className="map-canvas">
        {/* Capa SVG para dibujar las rutas */}
        <svg className="map-routes-layer">
          {conexiones.length > 0 ? conexiones.map((conn) => {
            const origin = visualIslands.find((i) => i.id === conn.isla_origen);
            const dest = visualIslands.find((i) => i.id === conn.isla_destino);
            if (!origin || !dest) return null;
            return (
              <line
                key={`conn-${conn.isla_origen}-${conn.isla_destino}`}
                x1={`${origin.x}%`}
                y1={`${origin.y}%`}
                x2={`${dest.x}%`}
                y2={`${dest.y}%`}
                className="route-line"
              />
            );
          }) : CONNECTIONS.map((conn) => {
            // Fallback for visual testing if backend doesn't return connections yet
            const origin = GRAND_LINE_MAP.find((i) => i.id === conn.from);
            const dest = GRAND_LINE_MAP.find((i) => i.id === conn.to);
            if (!origin || !dest) return null;
            return (
              <line
                key={`conn-fb-${conn.from}-${conn.to}`}
                x1={`${origin.x}%`}
                y1={`${origin.y}%`}
                x2={`${dest.x}%`}
                y2={`${dest.y}%`}
                className="route-line"
              />
            );
          })}
        </svg>

        {/* Nodos de Islas */}
        {(visualIslands.length > 0 ? visualIslands : GRAND_LINE_MAP).map((isla) => {
          const isPlayerHere = isla.id === islaActualJugador;
          const isRivalHere = isla.id === islaActualRival; // Por API actualmente está en null (niebla de guerra)
          const isSelected = isla.id === islaSeleccionada;
          const hasEscombro = escombros.some((e) => e.id_isla === isla.id);

          let statusClass = '';
          if (isPlayerHere && isRivalHere) {
            statusClass = 'active both-here';
          } else if (isPlayerHere) {
            statusClass = 'active';
          } else if (isRivalHere) {
            statusClass = 'rival-here';
          }

          if (isSelected) {
            statusClass += ' selected-island';
          }

          return (
            <div
              key={isla.id}
              className={`island-node ${isla.tipo || isla.type} ${statusClass}`}
              style={{ left: `${isla.x}%`, top: `${isla.y}%` }}
              onClick={() => onSelectIsla && onSelectIsla(isla.id)}
            >
              {hasEscombro && <div className="escombro-icon" title="Restos de madera">🪵</div>}
              <div className="island-icon">{ICONS[isla.tipo || isla.type] || '🏝️'}</div>
              <div className="island-name-label">{isla.nombre || isla.name}</div>

              <div className="indicators-container">
                {isPlayerHere && <span className="indicator-badge player-badge">Tu Barco</span>}
                {isRivalHere && <span className="indicator-badge rival-badge">Rival</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Map;
