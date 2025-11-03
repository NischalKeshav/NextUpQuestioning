(function() {
  var listEl = document.getElementById('list');
  var emptyEl = document.getElementById('empty');
  var wsProto = (location.protocol === 'https:') ? 'wss' : 'ws';
  var ws = new WebSocket(wsProto + '://' + location.host + '/ws');

  function addItem(item) {
    var li = document.createElement('li');
    li.className = 'card';
    var name = document.createElement('div');
    name.className = 'name';
    name.textContent = item.name;
    var text = document.createElement('div');
    text.className = 'text';
    text.textContent = item.text;
    li.appendChild(name);
    li.appendChild(text);
    listEl.appendChild(li);
    emptyEl.style.display = 'none';
  }

  ws.addEventListener('message', function(ev) {
    try {
      var msg = JSON.parse(ev.data);
      if (msg.type === 'history' && Array.isArray(msg.data)) {
        if (msg.data.length === 0) {
          emptyEl.style.display = '';
        } else {
          emptyEl.style.display = 'none';
          msg.data.forEach(addItem);
        }
      }
      if (msg.type === 'question' && msg.data) {
        addItem(msg.data);
      }
    } catch (e) {
      // ignore non-JSON
    }
  });
})();


