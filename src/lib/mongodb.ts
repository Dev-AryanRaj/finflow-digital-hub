
import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB URI with fallbacks
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/bankapp';
const MONGODB_DB_NAME = import.meta.env.VITE_MONGODB_DB_NAME || 'bankapp';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

console.log('MongoDB environment:', {
  isBrowser,
  uri: !isBrowser ? MONGODB_URI.includes('@') 
    ? MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@') 
    : MONGODB_URI : 'browser-mode', // Log URI without exposing credentials
  dbName: MONGODB_DB_NAME
});

// MongoDB Client
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Mock implementations for browser environment
const mockCollections: Record<string, any[]> = {
  users: [
    {
      id: '1',
      email: 'customer@example.com',
      passwordHash: 'cGFzc3dvcmQ=', // 'password' encoded
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'teller@example.com',
      passwordHash: 'cGFzc3dvcmQ=', // 'password' encoded
      role: 'TELLER',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  accounts: [],
  transactions: []
};

// Mock collection for browser usage
class MockCollection {
  private data: any[];
  
  constructor(collectionName: string) {
    this.data = mockCollections[collectionName] || [];
  }
  
  async find(query: any = {}) {
    console.log('Mock find with query:', query);
    // Simple filtering based on query
    let results = [...this.data];
    
    // Filter by fields (very basic implementation)
    Object.keys(query).forEach(key => {
      if (key === '$or') {
        // Handle $or operator
        const orConditions = query[key];
        results = results.filter(item => 
          orConditions.some((condition: any) => {
            const conditionKey = Object.keys(condition)[0];
            const conditionValue = condition[conditionKey];
            
            if (conditionValue instanceof RegExp) {
              return conditionValue.test(item[conditionKey]);
            }
            return item[conditionKey] === conditionValue;
          })
        );
      } else if (typeof query[key] === 'object' && query[key] !== null) {
        // Handle operators like $gte
        const operators = query[key];
        Object.keys(operators).forEach(op => {
          if (op === '$gte') {
            results = results.filter(item => item[key] >= operators[op]);
          }
        });
      } else {
        // Simple equality
        results = results.filter(item => item[key] === query[key]);
      }
    });
    
    return {
      toArray: async () => results,
      sort: (sortOptions: any) => {
        // Basic sort implementation
        const sortKey = Object.keys(sortOptions)[0];
        const sortDir = sortOptions[sortKey];
        results.sort((a, b) => {
          if (sortDir === 1) {
            return a[sortKey] > b[sortKey] ? 1 : -1;
          }
          return a[sortKey] < b[sortKey] ? 1 : -1;
        });
        return {
          skip: (n: number) => {
            results = results.slice(n);
            return {
              limit: (n: number) => {
                results = results.slice(0, n);
                return {
                  toArray: async () => results
                };
              }
            };
          },
          limit: (n: number) => {
            results = results.slice(0, n);
            return {
              toArray: async () => results
            };
          },
          toArray: async () => results
        };
      }
    };
  }
  
  async findOne(query: any = {}) {
    console.log('Mock findOne with query:', query);
    return this.data.find(item => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    }) || null;
  }
  
  async insertOne(document: any) {
    console.log('Mock insertOne:', document);
    this.data.push(document);
    return { insertedId: document.id };
  }
  
  async updateOne(filter: any, update: any) {
    console.log('Mock updateOne:', filter, update);
    const index = this.data.findIndex(item => {
      for (const key in filter) {
        if (item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
    
    if (index !== -1) {
      if (update.$set) {
        this.data[index] = {
          ...this.data[index],
          ...update.$set
        };
      }
    }
    
    return { modifiedCount: index !== -1 ? 1 : 0 };
  }
  
  async countDocuments(query: any = {}) {
    const results = await this.find(query);
    const arr = await results.toArray();
    return arr.length;
  }
}

export async function connectToDatabase() {
  // For browser environment, return a mock connection
  if (isBrowser) {
    console.log('Browser environment detected, using mock MongoDB connection');
    return { 
      status: 'connected', 
      mockConnection: true 
    };
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
    console.log('Browser environment detected, using mock collection for:', collectionName);
    return new MockCollection(collectionName);
  }
  
  if (!cachedDb) {
    throw new Error('Database connection not established. Call connectToDatabase() first.');
  }
  return cachedDb.collection(collectionName);
}

// Helper function to check database connection health
export async function checkDatabaseConnection() {
  if (isBrowser) {
    console.log('Browser environment detected, database check will always succeed');
    return { 
      status: 'connected',
      ping: 'successful (browser mock)'
    };
  }
  
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
