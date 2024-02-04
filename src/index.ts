import { MongoClient } from 'mongodb';
import DatabaseClient from './database/client';
import * as http from 'http';
import * as WebSocket from 'ws';

const express = require('express');
const cors = require('cors');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const client = new DatabaseClient();
const webSocketConnections: WebSocket[] = [];

const restPort = 3001;
const websocketPort = 3002;

async function start() {
  try {

    const app = express();
    app.use(cors());

    await client.connectToDatabase();
    console.log("index---Datenbankverbindung aufgebaut");
    app.db = client.getDatabase();
    app.webSocketConnections = webSocketConnections;
    app.use(express.json());

    // Routes
    app.use('/employees', require('./routes/employees'));
    app.use('/timestamps', require('./routes/timestamps'));
    app.use('/unregisteredtags', require('./routes/unregisteredtags'));

    //Websocket
    wss.on('connection', (ws) => {
      console.log('index---Client connected');
      webSocketConnections.push(ws);

      // Senden einer Nachricht an den Client, wenn die Verbindung hergestellt ist
      ws.send('Server: Hallo, Client! Du bist erfolgreich verbunden.');

      // Ereignishandler für eingehende Nachrichten vom Client
      ws.on('message', (message) => {
        console.log(`index---Nachricht von Client erhalten: ${message}`);
      });

      // Ereignishandler für das Schließen der Verbindung
      ws.on('close', () => {
        console.log('index---Client hat die WS Verbindung geschlossen');
      });
    });

    // Starten den Websocket Server
    server.listen(websocketPort, () => {
      console.log(`index---WebSocket-Server läuft auf Port ${websocketPort}`);
    });

    // Starten den REST Server
    app.listen(restPort, () => {
      console.log(`index---REST-Server läuft auf Port ${restPort}`);
    });
  }
  catch (error) {
    console.log(error);
  }
}

start();