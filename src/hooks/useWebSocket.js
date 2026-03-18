// src/hooks/useWebSocket.js
'use client';
import { useEffect, useRef, useCallback, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

export function useWebSocket(role = 'public') {
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const listenersRef = useRef({});

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}?role=${role}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('[WS] Connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const listeners = listenersRef.current[data.type] || [];
        listeners.forEach((fn) => fn(data.payload));
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 3s
      setTimeout(connect, 3000);
    };

    ws.onerror = () => ws.close();
  }, [role]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((type, payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  const on = useCallback((type, fn) => {
    if (!listenersRef.current[type]) listenersRef.current[type] = [];
    listenersRef.current[type].push(fn);
    return () => {
      listenersRef.current[type] = listenersRef.current[type].filter((l) => l !== fn);
    };
  }, []);

  return { connected, send, on };
}
