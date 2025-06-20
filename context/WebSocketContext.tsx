// context/WebSocketContext.tsx

'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type WebSocketContextType = {
  socket: WebSocket | null;
  sendAudio: (buffer: ArrayBuffer) => void;
  sendMessage: (message: any) => void;
  motorRpm: number | null;
  messageResult: MessageResult | null;
  connected: boolean;
  users: User[];
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [motorRpm, setMotorRpm] = useState<number | null>(null);
  const [messageResult, setMessageResult] = useState<MessageResult | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([{ name: 'thang', audioCount: 36 }, { name: 'thu', audioCount: 36 }]);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      const socket = new WebSocket('ws://localhost:8000/ws');
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('✅ [WS] Connected');
        setConnected(true);
        socket.send(JSON.stringify({ type: "identify", client_id: "web_client" }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'motor_status' && typeof data.rpm === 'number') {
            setMotorRpm(data.rpm);
          }

          if (data.type === 'user_list') {
            setUsers(data.users);
          }

          if (data.type === 'detected_command') {
            setUsers(data.users);
          }

          // Xử lý message từ nhận diện
          if (
            data.type === 'notification' &&
            'check_speaker_message' in data &&
            'transcribe_audio_message' in data
          ) {
            setMessageResult({
              check_speaker_message: data.check_speaker_message,
              transcribe_audio_message: data.transcribe_audio_message,
            });
          }

        } catch (err) {
          console.error('❌ [WS] Parse error:', err);
        }
      };

      socket.onclose = () => {
        console.warn('⚠️ [WS] Closed, retrying...');
        setConnected(false);
        reconnectTimeout = setTimeout(connect, 1000);
      };

      socket.onerror = (err) => {
        console.error('❌ [WS] Error:', err);
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket not ready');
    }
  };

  const sendAudio = (buffer: ArrayBuffer) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(buffer);
      console.log('📤 [WS] Sent audio buffer');
    } else {
      console.warn('⚠️ [WS] Not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, sendAudio, sendMessage, motorRpm, messageResult, connected, users}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
};
