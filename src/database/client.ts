import { MongoClient, Db, Collection, Document } from 'mongodb';

class DatabaseClient {
    private client: MongoClient;
    private database: Db | undefined;
    private dbName: string;

    constructor() {
        this.client = new MongoClient("mongodb+srv://user:GdIqBoLUDsYfRQIc@cluster0.3swcs5d.mongodb.net/");
        this.database = undefined; // Initialize to undefined, as it will be set during connection
        this.dbName = "kalki";
    }

    async connectToDatabase() {
        try {
            await this.client.connect();
            this.database = this.client.db(this.dbName);
            console.log('client---Erfolgreich mit der Datenbank verbunden');
        } catch (error) {
            console.error('client---Fehler beim Verbindungsaufbau zur Datenbank:', error);
        }
    }

    async closeDatabaseConnection() {
        try {
            await this.client.close();
            console.log('client---Verbindung zur Datenbank erfolgreich geschlossen');
        } catch (error) {
            console.error('client---Fehler beim Schließen der Datenbankverbindung:', error);
        }
    }

    getDatabase(): Db {
        if (!this.database) {
            throw new Error('Database is not connected. Call connectToDatabase() first.');
        }
        return this.database;
    }

    getCollection(collectionName: string): Collection<Document> {
        const database = this.getDatabase();
        return database.collection(collectionName);
    }
}

export default DatabaseClient;
