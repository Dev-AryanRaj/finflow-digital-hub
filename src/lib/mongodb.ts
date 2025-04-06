
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bankapp';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'bankapp';

// MongoDB Client
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect();
  const db = client.db(MONGODB_DB_NAME);
  
  cachedClient = client;
  cachedDb = db;
  
  console.log('Connected to MongoDB');
  return { client, db };
}

export function getCollection(collectionName: string) {
  if (!cachedDb) {
    throw new Error('Database connection not established. Call connectToDatabase() first.');
  }
  return cachedDb.collection(collectionName);
}
