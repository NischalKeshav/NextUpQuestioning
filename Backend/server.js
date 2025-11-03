const { WebSocketServer } = require('ws');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, orderBy, query } = require('firebase/firestore');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1KqZkPcUy67STlMDh6wQ6d_YT7cqzk1g",
  authDomain: "nextupquestioning.firebaseapp.com",
  projectId: "nextupquestioning",
  storageBucket: "nextupquestioning.firebasestorage.app",
  messagingSenderId: "443214847473",
  appId: "1:443214847473:web:f46a6e9b48ba541c71f850",
  measurementId: "G-6SLZPFWQMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function broadcastJson(wss, data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

async function loadQuestions() {
  try {
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const questions = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        name: data.name,
        text: data.text,
        createdAt: data.createdAt
      });
    });
    return questions;
  } catch (error) {
    console.error('[firebase] error loading questions:', error);
    return [];
  }
}

async function saveQuestion(name, text) {
  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      name,
      text,
      createdAt: new Date().toISOString()
    });
    return {
      id: docRef.id,
      name,
      text,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('[firebase] error saving question:', error);
    throw error;
  }
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', async (ws) => {
  console.log('[ws] client connected, total clients:', wss.clients.size);
  
  // Load questions from Firestore and send history
  const questions = await loadQuestions();
  ws.send(
    JSON.stringify({ type: 'history', data: questions })
  );

  ws.on('message', async (message) => {
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

      try {
        const item = await saveQuestion(name, text);
        console.log('[ws] broadcasting question from:', name);
        broadcastJson(wss, { type: 'question', data: item });
      } catch (error) {
        console.error('[ws] failed to save question:', error);
      }
    }
  });

  ws.on('close', () => {
    console.log('[ws] client disconnected, total clients:', wss.clients.size);
  });
});

console.log(`[ws] server listening on ws://localhost:${PORT}`);
