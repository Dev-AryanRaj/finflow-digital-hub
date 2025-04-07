
import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB URI with fallbacks
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/bankapp';
const MONGODB_DB_NAME = import.meta.env.VITE_MONGODB_DB_NAME || 'bankapp';

console.log('MongoDB connection info:', {
  uri: MONGODB_URI.includes('@') 
    ? MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@') 
    : MONGODB_URI, // Log URI without exposing credentials
  dbName: MONGODB_DB_NAME
});

// MongoDB Client
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Mock implementation for browser environment
const isBrowser = typeof window !== 'undefined';

export async function connectToDatabase() {
  // For browser environment, we should provide mock implementation or API endpoints
  if (isBrowser) {
    console.warn('MongoDB direct connection not supported in browser. Use API endpoints instead.');
    
    // Return a simulated connection status based on a health check endpoint
    try {
      const response = await fetch('/api/db/health');
      if (!response.ok) {
        throw new Error('Database connection check failed');
      }
      return { status: 'connected', mockConnection: true };
    } catch (error) {
      console.error('Failed to check database connection:', error);
      return { 
        status: 'disconnected', 
        error: error instanceof Error ? error.message : 'Unknown database connection error',
        mockConnection: true
      };
    }
  }

  // Server-side connection logic
  if (cachedClient && cachedDb) {
    console.log('Using cached database connection');
    return { client: cachedClient, db: cachedDb, status: 'connected' };
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
    return { client, db, status: 'connected' };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    
    return {
      status: 'disconnected',
      error: error instanceof Error 
        ? `Database connection failed: ${error.message}. Please check your MongoDB connection string and ensure the database server is running.`
        : 'Unknown database error'
    };
  }
}

export function getCollection(collectionName: string) {
  if (isBrowser) {
    console.warn('Direct collection access not supported in browser.');
    return null;
  }
  
  if (!cachedDb) {
    throw new Error('Database connection not established. Call connectToDatabase() first.');
  }
  return cachedDb.collection(collectionName);
}

// Helper function to check database connection health
export async function checkDatabaseConnection() {
  try {
    const result = await connectToDatabase();
    if (result.status === 'connected') {
      return { 
        status: 'connected',
        ping: 'successful'
      };
    } else {
      return {
        status: 'disconnected',
        error: result.error || 'Failed to connect to database'
      };
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    return { 
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
