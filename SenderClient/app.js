(function() {
  const statusEl = document.getElementById('status');
  const formEl = document.getElementById('questionForm');
  const sendBtn = document.getElementById('sendBtn');
  const nameEl = document.getElementById('name');
  const textEl = document.getElementById('text');

  const wsProto = (location.protocol === 'https:') ? 'wss' : 'ws';
  const ws = new WebSocket(wsProto + '://' + location.host + '/ws');

  ws.addEventListener('open', () => {
    sendBtn.disabled = false;
    statusEl.textContent = 'Connected';
  });

  ws.addEventListener('close', () => {
    sendBtn.disabled = true;
    statusEl.textContent = 'Disconnected';
  });

  ws.addEventListener('error', () => {
    statusEl.textContent = 'Connection error';
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const text = textEl.value.trim();
    if (!name || !text || ws.readyState !== WebSocket.OPEN) return;

    ws.send(JSON.stringify({ type: 'question', name, text }));
    textEl.value = '';
    textEl.focus();
    statusEl.textContent = 'Sent';
    setTimeout(() => { statusEl.textContent = ''; }, 800);
  });
})();


