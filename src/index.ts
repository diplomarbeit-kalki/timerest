import { MongoClient } from 'mongodb';
import DatabaseClient from './database/client';

const express = require('express');
const body = require('body-parser');
const port = 3001;
const client = new DatabaseClient();

async function start() {
  try {

    const app = express();

    await client.connectToDatabase();
    console.log("index---Datenbankverbindung aufgebaut")
    app.db = client.getDatabase();

    // body parser

    app.use(body.json({
      limit: '500kb'
    }));

    // Routes

    app.use('/employees', require('./routes/employees'));

    // Start server

    app.listen(port, () => {
      console.log(`index---Server läuft auf Port ${port}`);
    });

  }
  catch(error) {
    console.log(error);
  }
  
}

start();