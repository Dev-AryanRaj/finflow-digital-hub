
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure MongoDB URI with fallbacks
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bankapp';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'bankapp';

console.log('MongoDB connection info:', {
  uri: MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@'), // Log URI without exposing credentials
  dbName: MONGODB_DB_NAME
});

// MongoDB Client
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    console.log('Using cached database connection');
    return { client: cachedClient, db: cachedDb };
  }

  try {
    console.log('Establishing new MongoDB connection...');
    
    // Options with increased timeout for connection issues
    const client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,  // 45 seconds
    });

    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    
    // Test the connection with a simple command
    await db.command({ ping: 1 });
    
    cachedClient = client;
    cachedDb = db;
    
    console.log('Successfully connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
    // Attempt to handle specific errors or provide better error messages
    if (error instanceof Error) {
      // Improve the error message
      throw new Error(`Database connection failed: ${error.message}. Please check your MongoDB connection string and ensure the database server is running.`);
    }
    throw error;
  }
}

export function getCollection(collectionName: string) {
  if (!cachedDb) {
    throw new Error('Database connection not established. Call connectToDatabase() first.');
  }
  return cachedDb.collection(collectionName);
}

// Helper function to check database connection health
export async function checkDatabaseConnection() {
  try {
    const { client } = await connectToDatabase();
    const admin = client.db().admin();
    const result = await admin.ping();
    return { 
      status: 'connected',
      ping: result.ok === 1 ? 'successful' : 'failed'
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return { 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
