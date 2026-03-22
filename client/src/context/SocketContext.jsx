import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { showCrisis } from '../store/slices/uiSlice';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

    const newSocket = io(socketURL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle crisis notifications
    newSocket.on('crisis-detected', (data) => {
      dispatch(showCrisis(data));
    });

    // Handle notifications
    newSocket.on('notification', (data) => {
      toast(data.title, { icon: '🔔' });
    });

    // Handle encouragement
    newSocket.on('received-encouragement', (data) => {
      toast(`💛 ${data.fromName}: ${data.message}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;