export type RealtimeStatus = "connecting" | "connected" | "offline";

export type RealtimeEvent = {
  kind: "active-project" | "agent-request" | "presence";
  projectId?: string;
  text?: string;
  at: number;
};

type RealtimeOptions = {
  room: string;
  onStatus: (status: RealtimeStatus) => void;
  onEvent: (event: RealtimeEvent) => void;
};

export function connectRealtime({ room, onStatus, onEvent }: RealtimeOptions) {
  if (typeof WebSocket === "undefined" || !location.host) {
    onStatus("offline");
    return { send: () => undefined, close: () => undefined };
  }

  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${location.host}/ws/${encodeURIComponent(room)}`);
  onStatus("connecting");

  socket.addEventListener("open", () => {
    onStatus("connected");
    socket.send(JSON.stringify({ type: "set", key: "presence", value: { at: Date.now() } }));
  });
  socket.addEventListener("message", (message) => {
    try {
      const payload = JSON.parse(String(message.data)) as { type?: string; data?: RealtimeEvent };
      if (payload.type === "msg" && payload.data) onEvent(payload.data);
    } catch {
      /* Ignore malformed room messages. */
    }
  });
  socket.addEventListener("close", () => onStatus("offline"));
  socket.addEventListener("error", () => onStatus("offline"));

  return {
    send(event: RealtimeEvent) {
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "msg", data: event }));
    },
    close() {
      socket.close();
    },
  };
}
