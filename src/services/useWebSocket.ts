import { useEffect, useRef, useState, useCallback } from 'react';

function getWebSocketBaseUrl(): string {
  const envWs = import.meta.env.VITE_WS_URL;
  if (envWs && !envWs.includes('localhost')) {
    return envWs.replace(/\/+$/, '');
  }

  const envApi = import.meta.env.VITE_API_URL;
  if (envApi && !envApi.includes('localhost')) {
    // Derives wss://... from https://.../api
    const wsUrl = envApi.replace(/^http(s?):\/\//, 'ws$1://').replace(/\/api\/?$/, '/ws');
    return wsUrl.replace(/\/+$/, '');
  }

  return envWs || 'ws://localhost:8005/ws';
}

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
    const baseUrl = getWebSocketBaseUrl();
    const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
    // Avoid double /ws/ws
    const fullUrl = baseUrl.endsWith('/ws') && cleanPath.startsWith('/ws')
      ? `${baseUrl.slice(0, -3)}${cleanPath}`
      : `${baseUrl}${cleanPath}`;

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
