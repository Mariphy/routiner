import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cashedClient: MongoClient | null = null;
let cashedDb: Db | null = null;

export async function connectToDb() {
    if (cashedClient && cashedDb) {
        return { client: cashedClient, db: cashedDb };
    }
const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
}

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