import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

// Create singleton socket instance
export const socket: Socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Connection event listeners for debugging
socket.on('connect', () => {
  console.log('✅ Connected to Socket.io server:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected from Socket.io server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('🔴 Socket connection error:', error.message);
});

socket.on('error', (error: { message: string }) => {
  console.error('🔴 Socket error:', error.message);
});

export default socket;
