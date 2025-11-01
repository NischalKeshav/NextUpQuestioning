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

Run (minimal)
-------------
1) Start the WebSocket relay server:

```
cd Backend
npm install
npm start
```

2) Open the clients in a browser:
   - Double-click `SenderClient/index.html`
   - Double-click `RecieverClient/index.html`

   (Alternatively, serve the repo statically; the clients connect to `ws://localhost:8080`.)

Notes
-----
- No database; questions are kept in memory for the server's lifetime.
- Only essential features are included: send name + question; receiver lists them live.

