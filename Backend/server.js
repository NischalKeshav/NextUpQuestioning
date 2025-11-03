const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

/**
 * In-memory store of questions for the session.
 * Each item: { id, name, text, createdAt }
 */
const questions = [];

function broadcastJson(wss, data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url || '/');
  const pathname = parsed.pathname || '/';

  // Basic health check
  if (req.method === 'GET' && pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ok');
    return;
  }

  // Route: /Sending -> SenderClient/index.html
  if (req.method === 'GET' && pathname === '/Sending') {
    const filePath = path.join(__dirname, '../SenderClient/index.html');
    return streamFile(filePath, 'text/html; charset=utf-8', res);
  }

  // Route: /Recieving -> RecieverClient/index.html
  if (req.method === 'GET' && pathname === '/Recieving') {
    const filePath = path.join(__dirname, '../RecieverClient/index.html');
    return streamFile(filePath, 'text/html; charset=utf-8', res);
  }

  // Sender assets under /Sending/
  if (req.method === 'GET' && pathname === '/Sending/style.css') {
    const filePath = path.join(__dirname, '../SenderClient/style.css');
    return streamFile(filePath, 'text/css; charset=utf-8', res);
  }
  if (req.method === 'GET' && pathname === '/Sending/app.js') {
    const filePath = path.join(__dirname, '../SenderClient/app.js');
    return streamFile(filePath, 'application/javascript; charset=utf-8', res);
  }

  // Receiver assets under /Recieving/
  if (req.method === 'GET' && pathname === '/Recieving/index.css') {
    const filePath = path.join(__dirname, '../RecieverClient/index.css');
    return streamFile(filePath, 'text/css; charset=utf-8', res);
  }
  if (req.method === 'GET' && pathname === '/Recieving/app.js') {
    const filePath = path.join(__dirname, '../RecieverClient/app.js');
    return streamFile(filePath, 'application/javascript; charset=utf-8', res);
  }

  // Static: allow direct access to client assets
  if (req.method === 'GET' && pathname.startsWith('/SenderClient/')) {
    const filePath = path.join(__dirname, '..', pathname);
    return streamStatic(filePath, res);
  }
  if (req.method === 'GET' && pathname.startsWith('/RecieverClient/')) {
    const filePath = path.join(__dirname, '..', pathname);
    return streamStatic(filePath, res);
  }

  // Default: 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

function streamFile(filePath, contentType, res) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

function streamStatic(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
  };
  const contentType = types[ext] || 'application/octet-stream';
  streamFile(filePath, contentType, res);
}

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  ws.send(
    JSON.stringify({ type: 'history', data: questions })
  );

  ws.on('message', (message) => {
    let parsed;
    try {
      parsed = JSON.parse(message.toString());
    } catch {
      return; // ignore non-JSON
    }

    if (parsed && parsed.type === 'question') {
      const name = typeof parsed.name === 'string' ? parsed.name.trim() : '';
      const text = typeof parsed.text === 'string' ? parsed.text.trim() : '';

      if (!name || !text) return; // minimal validation

      const item = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        name,
        text,
        createdAt: new Date().toISOString(),
      };
      questions.push(item);

      broadcastJson(wss, { type: 'question', data: item });
    }
  });
});

server.on('upgrade', (request, socket, head) => {
  const { pathname } = url.parse(request.url || '/');
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`[http] listening on http://0.0.0.0:${PORT}`);
  console.log(`[ws]   listening on ws://0.0.0.0:${PORT}/ws`);
});


