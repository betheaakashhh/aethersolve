// ws-server.js — Deploy this on Render as a separate Node.js service
const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.WS_PORT || 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', clients: wss.clients.size }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const wss = new WebSocketServer({ server });

// Track clients by role
const clients = new Map(); // id -> { ws, role }

function broadcast(data, filter = null) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      if (!filter || clients.get(ws)?.role === filter) {
        ws.send(msg);
      }
    }
  });
}

wss.on('connection', (ws, req) => {
  const role = new URL(req.url, `http://localhost`).searchParams.get('role') || 'public';
  clients.set(ws, { role });

  console.log(`[WS] Client connected: ${role} (total: ${wss.clients.size})`);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      // Relay new_application to all admin clients
      if (message.type === 'new_application') {
        broadcast({ type: 'new_application', payload: message.payload }, 'admin');
        console.log('[WS] New application broadcast to admins');
      }

      // Relay announcement updates to all public clients
      if (message.type === 'announcement_update') {
        broadcast({ type: 'announcement_update', payload: message.payload }, 'public');
      }

      // Relay testimonial updates
      if (message.type === 'testimonial_update') {
        broadcast({ type: 'testimonial_update', payload: message.payload }, 'public');
      }
    } catch (err) {
      console.error('[WS] Parse error:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client disconnected (total: ${wss.clients.size})`);
  });

  ws.on('error', (err) => {
    console.error('[WS] Error:', err);
  });

  // Ping to keep connection alive (Render closes idle connections)
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) ws.ping();
  }, 25000);

  ws.on('close', () => clearInterval(interval));
});

server.listen(PORT, () => {
  console.log(`✅ AetherSolve WebSocket Server running on port ${PORT}`);
});
