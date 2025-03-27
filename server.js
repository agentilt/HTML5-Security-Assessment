// Install dependencies: npm install express ws cors

const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();
const port = 3000;

// Insecure CORS: Allows all origins and credentials
app.use(cors({ origin: '*', credentials: true }));

// Serve static files
app.use(express.static('public'));

// API with sensitive data (accessible via CORS misconfiguration)
app.get('/data', (req, res) => {
    res.json({ secret: 'This is sensitive data!' });
});

// Start Express server
app.listen(port, () => console.log(`Vulnerable web app running at http://localhost:${port}`));

// WebSocket server (no authentication, reflects input)
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('Received:', message);
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message); // Reflecting user input
            }
        });
    });
    ws.send('Connected to vulnerable WebSocket!');
});
