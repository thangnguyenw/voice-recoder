// utils/ws-client.ts

// let socket: WebSocket;

// export function initSocket(url: string): WebSocket {
//   socket = new WebSocket(url);
//   return socket;
// }

// export function getSocket(): WebSocket {
//   return socket;
// }

let socket: WebSocket | null = null;

export function initSocket(url: string): WebSocket {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url);
  }
  return socket;
}

export function getSocket(): WebSocket {
  if (!socket) {
    throw new Error('Socket chưa được khởi tạo. Gọi initSocket() trước.');
  }
  return socket;
}

