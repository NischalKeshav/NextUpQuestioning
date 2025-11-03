const { WebSocketServer } = require('ws');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const questions = [];

function broadcastJson(wss, data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  console.log('[ws] client connected, total clients:', wss.clients.size);
  
  ws.send(
    JSON.stringify({ type: 'history', data: questions })
  );

  ws.on('message', (message) => {
    let parsed;
    try {
      parsed = JSON.parse(message.toString());
    } catch {
      return; 
    }

    if (parsed && parsed.type === 'question') {
      const name = typeof parsed.name === 'string' ? parsed.name.trim() : '';
      const text = typeof parsed.text === 'string' ? parsed.text.trim() : '';

      if (!name || !text) return; 

      const item = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        name,
        text,
        createdAt: new Date().toISOString(),
      };
      questions.push(item);

      console.log('[ws] broadcasting question from:', name);
      broadcastJson(wss, { type: 'question', data: item });
    }
  });

  ws.on('close', () => {
    console.log('[ws] client disconnected, total clients:', wss.clients.size);
  });
});

console.log(`[ws] server listening on ws://localhost:${PORT}`);


