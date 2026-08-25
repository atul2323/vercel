import { useEffect, useRef, useState, useCallback } from 'react';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8005/ws';

export interface WebSocketMessage {
  event: string;
  [key: string]: any;
}

export function useWebSocket(path = '') {
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    const fullUrl = path ? `${WS_BASE_URL}${path}` : WS_BASE_URL;
    try {
      const ws = new WebSocket(fullUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch {
          // Non-JSON message
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Automatic reconnection every 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      // Reconnect attempt on failure
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, 3000);
    }
  }, [path]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((msg: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
  }, []);

  return { lastMessage, isConnected, sendMessage };
}
