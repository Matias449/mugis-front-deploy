import React from 'react';
import './Map.css';

// Topología estática basada en el backend de Grand Line
const GRAND_LINE_MAP = [
  {
    id: 1, name: 'Cabo Gemelo', type: 'inicio', x: 5, y: 50,
  },
  {
    id: 2, name: 'Skypiea', type: 'pacifico', x: 23, y: 20,
  },
  {
    id: 3, name: 'Thriller Bark', type: 'combate', x: 23, y: 80,
  },
  {
    id: 4, name: 'Dressrosa', type: 'combate', x: 59, y: 80,
  },
  {
    id: 5, name: 'Zou', type: 'tesoro', x: 80, y: 50,
  },
  {
    id: 6, name: 'Wano', type: 'combate', x: 90, y: 50,
  },
  {
    id: 7, name: 'Onigashima', type: 'final', x: 96, y: 35,
  },
  {
    id: 8, name: 'Foosha', type: 'pacifico', x: 14, y: 20,
  },
  {
    id: 9, name: 'Alabasta', type: 'tesoro', x: 14, y: 50,
  },
  {
    id: 10, name: 'Water 7', type: 'tesoro', x: 23, y: 50,
  },
  {
    id: 11, name: 'Marineford', type: 'combate', x: 50, y: 50,
  },
  {
    id: 12, name: 'Kamabaka', type: 'pacifico', x: 59, y: 50,
  },
  {
    id: 13, name: 'Ohara', type: 'tesoro', x: 32, y: 20,
  },
  {
    id: 14, name: 'Sorbet', type: 'pacifico', x: 50, y: 20,
  },
  {
    id: 15, name: 'Punk Hazard', type: 'combate', x: 68, y: 80,
  },
  {
    id: 16, name: 'God Valley', type: 'combate', x: 68, y: 20,
  },
  {
    id: 17, name: 'Impel Down', type: 'combate', x: 32, y: 80,
  },
  {
    id: 18, name: 'Wholecake', type: 'tesoro', x: 68, y: 50,
  },
  {
    id: 19, name: 'Amazon Lilly', type: 'pacifico', x: 50, y: 80,
  },
  {
    id: 20, name: 'Kuraigana', type: 'combate', x: 59, y: 20,
  },
  {
    id: 21, name: 'Egghead', type: 'tesoro', x: 80, y: 20,
  },
  {
    id: 22, name: 'Hachinosu', type: 'combate', x: 80, y: 80,
  },
  {
    id: 23, name: 'Sabaody', type: 'pacifico', x: 32, y: 50,
  },
  {
    id: 24, name: 'Drum', type: 'pacifico', x: 14, y: 80,
  },
];

// Conexiones de rutas marítimas
const CONNECTIONS = [
  { from: 1, to: 8 },
  { from: 1, to: 9 },
  { from: 1, to: 24 },
  { from: 8, to: 2 },
  { from: 8, to: 9 },
  { from: 2, to: 10 },
  { from: 2, to: 13 },
  { from: 2, to: 23 },
  { from: 9, to: 10 },
  { from: 9, to: 24 },
  { from: 10, to: 13 },
  { from: 10, to: 23 },
  { from: 10, to: 17 },
  { from: 24, to: 3 },
  { from: 3, to: 17 },
  { from: 3, to: 23 },
  { from: 13, to: 14 },
  { from: 14, to: 20 },
  { from: 14, to: 12 },
  { from: 23, to: 11 },
  { from: 23, to: 17 },
  { from: 17, to: 19 },
  { from: 11, to: 20 },
  { from: 11, to: 12 },
  { from: 11, to: 4 },
  { from: 19, to: 12 },
  { from: 19, to: 4 },
  { from: 16, to: 21 },
  { from: 16, to: 5 },
  { from: 20, to: 16 },
  { from: 12, to: 18 },
  { from: 4, to: 15 },
  { from: 15, to: 5 },
  { from: 15, to: 22 },
  { from: 18, to: 21 },
  { from: 18, to: 5 },
  { from: 18, to: 22 },
  { from: 21, to: 6 },
  { from: 5, to: 6 },
  { from: 22, to: 6 },
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
    const staticData = GRAND_LINE_MAP.find((i) => i.id === isla.id || i.name === isla.nombre);
    let tipoVisual = isla.tipo || (staticData ? staticData.type : 'pacifico');

    if (isla.es_inicio) {
      tipoVisual = 'inicio';
    }

    if (isla.es_final) {
      tipoVisual = 'final';
    }

    return {
      ...isla,
      x: staticData ? staticData.x : 50,
      y: staticData ? staticData.y : 50,
      tipo: tipoVisual,
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
