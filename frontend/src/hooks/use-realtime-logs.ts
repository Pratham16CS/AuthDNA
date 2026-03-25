import { useState, useEffect, useRef, useCallback } from 'react';

export interface LiveLoginEvent {
  type: string;
  tenant_id?: string;
  user_id: string;
  ip: string;
  country: string;
  city: string;
  score: number;
  decision: string;
  explanation: string;
  resource: string;
  dna_match: number;
  is_new_user: boolean;
  processing_time_ms: number;
  request_id: string;
  timestamp: string;
}

interface UseRealtimeLogsOptions {
  apiKey: string | null;
  maxEvents?: number;
}

export function useRealtimeLogs({ apiKey, maxEvents = 200 }: UseRealtimeLogsOptions) {
  const [events, setEvents] = useState<LiveLoginEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!apiKey || !mountedRef.current) return;
    if (esRef.current) { esRef.current.close(); esRef.current = null; }

    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/v1/stream/events`;

    // EventSource doesn't natively support custom headers,
    // so we pass the key as a query param and trust the backend accepts it.
    // We use a URL-based workaround via fetch + ReadableStream for header support.
    startFetchSSE(url, apiKey);
  }, [apiKey]);

  const startFetchSSE = (url: string, key: string) => {
    if (!mountedRef.current) return;

    const controller = new AbortController();
    esRef.current = { close: () => controller.abort() } as any;

    fetch(url, {
      headers: { 'X-API-Key': key, 'Accept': 'text/event-stream' },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          setError(`Stream error: ${res.status}`);
          setConnected(false);
          scheduleReconnect();
          return;
        }
        setConnected(true);
        setError(null);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (mountedRef.current) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const payload = JSON.parse(line.slice(6));
                if (payload.type === 'login_event') {
                  setEvents(prev => {
                    const updated = [payload as LiveLoginEvent, ...prev];
                    return updated.slice(0, maxEvents);
                  });
                }
              } catch (_) { /* bad JSON */ }
            }
          }
        }
        if (mountedRef.current) scheduleReconnect();
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        if (mountedRef.current) {
          setConnected(false);
          setError('Connection lost — reconnecting…');
          scheduleReconnect();
        }
      });
  };

  const scheduleReconnect = () => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    reconnectTimer.current = setTimeout(() => {
      if (mountedRef.current) connect();
    }, 3000);
  };

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      if (esRef.current) esRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  return { events, connected, error };
}
