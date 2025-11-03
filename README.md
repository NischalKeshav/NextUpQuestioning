Nextup Questioning - Minimal Sender/Receiver
===========================================

A tiny question-sending app with two frontends:
- Sender (`SenderClient/index.html`): submit your name and a question
- Receiver (`RecieverClient/index.html`): see the live list of incoming questions

Colors
------
- Primary: `#405e86`
- Accent: `#299ebf`
- Background: `#f8f7ed`

Run Locally
-----------
1) Start the WebSocket relay server:

```bash
cd Backend
npm install
npm start
```

2) Open the clients in a browser:
   - Double-click `SenderClient/index.html`
   - Double-click `RecieverClient/index.html`

   (Alternatively, serve the repo statically; the clients connect to `ws://localhost:8080`.)

Run with Docker
---------------
1) Build the Docker image:

```bash
cd Backend
docker build -t nextup-questioning-backend .
```

2) Run the container:

```bash
docker run -p 8080:8080 nextup-questioning-backend
```

3) Open the clients in a browser:
   - Double-click `SenderClient/index.html`
   - Double-click `RecieverClient/index.html`

Notes
-----
- No database; questions are kept in memory for the server's lifetime.
- Only essential features are included: send name + question; receiver lists them live.
- WebSocket server runs on port 8080 by default.
