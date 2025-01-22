import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cashedClient: MongoClient | null = null;
let cashedDb: Db | null = null;

export async function connectToDb() {
    if (cashedClient && cashedDb) {
        return { client: cashedClient, db: cashedDb };
    }
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.5qjn6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
   
    const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });

    await client.connect();

    cashedClient = client;
    cashedDb = client.db('Routiner');

    return { client, db: client.db('Routiner') };
}