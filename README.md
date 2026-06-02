# Mugiwaras

## Dependencias instaladas en esta entrega

```bash
# Cliente WebSocket para conectarse al servidor en tiempo real
yarn add socket.io-client
```

## WebSockets

El cliente se conecta al servidor via `src/socket.js` usando `socket.io-client`.

En `GameBoard.jsx` se suscribe al canal `partida_{id}` correspondiente a la partida activa
y escucha los eventos emitidos por el backend:

- Al recibir **`jugador_movido`**: actualiza automáticamente el `Sidebar` con los recursos
  del jugador (berries, madera, haki) sin recargar la página.
- Al recibir **`turno_cambiado`**: actualiza el indicador de turno
  (`Tu Turno / Esperando Rival...`) en tiempo real.
- Al recibir **`partida_abandonada`**: muestra una notificación de victoria por abandono
  y refresca el estado de la partida.