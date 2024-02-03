import { MongoClient } from 'mongodb';
import DatabaseClient from './database/client';

const express = require('express');
const port = 3001;
const client = new DatabaseClient();

async function start() {
  try {

    const app = express();

    await client.connectToDatabase();
    console.log("index---Datenbankverbindung aufgebaut");
    app.db = client.getDatabase();
    app.use(express.json());

    // Routes
    app.use('/employees', require('./routes/employees'));

    //Starte Server
    app.listen(port, () => {
      console.log(`index---Server läuft auf Port ${port}`);
    });
  }
  catch(error) {
    console.log(error);
  }
}

start();