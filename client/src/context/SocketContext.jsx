import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// Create ONE shared instance outside the component to prevent multiple instances
// in React 18 StrictMode or frequent re-renders.
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
const sharedSocket = io(apiUrl, {
  withCredentials: true,
  autoConnect: false, // Don't connect until authenticated
});

export const SocketProvider = ({ children }) => {
  const [online, setOnline] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(sharedSocket);

  useEffect(() => {
    const socket = socketRef.current;

    if (user) {
      // Connect if not already connected
      if (!socket.connected) {
        socket.connect();
      }

      const onConnect = () => {
        console.log('Connected to socket server');
        setOnline(true);
        // Join user-specific room
        socket.emit('join-room', `user:${user._id}`);
      };

      const onDisconnect = () => {
        console.log('Disconnected from socket server');
        setOnline(false);
      };

      // Attach event listeners
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);

      // If it's already connected (e.g. fast refresh), fire the join-room event immediately
      if (socket.connected) {
        onConnect();
      }

      return () => {
        // Clean up event listeners to prevent memory leaks and duplicate handlers
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        
        // We do NOT call socket.disconnect() here because we want to share the instance
        // across fast refreshes or component remounts without destroying the TCP connection.
      };
    } else {
      // If user logs out, disconnect the socket
      if (socket.connected) {
        socket.disconnect();
        setOnline(false);
      }
    }
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, online }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
