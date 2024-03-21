import DatabaseClient from './database/client';
import * as http from 'http';
import * as WebSocket from 'ws';
import express from 'express';
import cors from 'cors';

const server = http.createServer();
const wss = new WebSocket.Server({ server });
const dbclient = new DatabaseClient();
const webSocketConnections: WebSocket[] = [];
const restPort = 3001;
const websocketPort = 3002;

async function start() {
  try {

    const app = express();
    app.use(cors());
    app.use(express.json());

    await dbclient.connectToDatabase();

    app.db = dbclient.getDatabase();
    app.webSocketConnections = webSocketConnections;


    // Routes
    app.use('/employees', require('./routes/employees'));
    app.use('/employeesArchive', require('./routes/employeesArchive'));
    app.use('/users', require('./routes/users'));
    app.use('/transponders', require('./routes/transponders'));
    app.use('/timerecords', require('./routes/timerecords'));
    app.use('/pdf', require('./routes/pdf'));
    app.use('/media', require('./routes/media'));
    app.use('/cards', require('./routes/cards'));

    // Websocket
    wss.on('connection', (ws) => {
      console.log('Websocket---Client connected');
      webSocketConnections.push(ws);

      // Senden einer Nachricht an den Client, wenn die Verbindung hergestellt ist
      ws.send(JSON.stringify({ message: 'Verbindung mit Server hergestellt!' }));

      // Ereignishandler für eingehende Nachrichten vom Client
      ws.on('message', (message) => {
        console.log(`Websocket---Nachricht von Client: ${message}`);
      });

      // Ereignishandler für das Schließen der Verbindung
      ws.on('close', () => {
        console.log('Websocket---Client disconnected');
        // Entfernen der Verbindung aus dem Array
        const index = webSocketConnections.indexOf(ws);
        if (index !== -1) {
          webSocketConnections.splice(index, 1);
          console.log('Websocket---Clientverbindung entfernt');
        }
      });
    });

    // Starten den Websocket Server
    server.listen(websocketPort, () => {
      console.log(`app---WebSocket-Server läuft auf Port ${websocketPort}`);
    });

    // Starten den REST Server
    app.listen(restPort, () => {
      console.log(`app---REST-Server läuft auf Port ${restPort}`);
    });
  }
  catch (error) {
    console.log(error);
  }
}

start();