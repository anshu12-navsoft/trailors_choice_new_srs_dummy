import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'https://api.yourdomain.com'; // 🔁 match your api.js baseURL

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  async connect() {
    if (this.socket?.connected) return;

    const token = await AsyncStorage.getItem('ACCESS_TOKEN');

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('🟢 Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', reason => {
      console.log('🔴 Socket disconnected:', reason);
    });

    this.socket.on('connect_error', err => {
      console.log('❌ Socket error:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /* ── emit ── */
  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected — cannot emit:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  /* ── subscribe ── */
  on(event, callback) {
    if (!this.socket) return;
    this.socket.on(event, callback);
  }

  /* ── unsubscribe ── */
  off(event, callback) {
    if (!this.socket) return;
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  isConnected() {
    return this.socket?.connected ?? false;
  }
}

export default new SocketService();
