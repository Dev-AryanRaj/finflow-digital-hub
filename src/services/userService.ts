
import { connectToDatabase, getCollection } from '../lib/mongodb';
import { User, UserCredentials } from '../models/User';

// Check if running in browser environment
const isBrowser = typeof window !== 'undefined';

// This is a simple hash function for demo purposes
// In a real app, use bcrypt or a similar library
function simpleHash(input: string): string {
  return Buffer.from(input).toString('base64');
}

export async function findUserByEmail(email: string): Promise<User | null> {
  if (isBrowser) {
    console.log('Finding user by email:', email);
    // Mock user data for browser environment
    if (email === 'customer@example.com') {
      return {
        id: '1',
        email: 'customer@example.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else if (email === 'teller@example.com') {
      return {
        id: '2',
        email: 'teller@example.com',
        role: 'TELLER',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return null;
  }
  
  try {
    await connectToDatabase();
    const usersCollection = getCollection('users');
    return await usersCollection.findOne({ email }) as User | null;
  } catch (error) {
    console.error('Failed to find user:', error);
    throw new Error('Database error');
  }
}

export async function authenticateUser(credentials: UserCredentials): Promise<User | null> {
  if (isBrowser) {
    console.log('Authenticating user:', credentials.email);
    // Mock authentication for browser environment
    if (credentials.email === 'customer@example.com' && credentials.password === 'password') {
      return {
        id: '1',
        email: 'customer@example.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } else if (credentials.email === 'teller@example.com' && credentials.password === 'password') {
      return {
        id: '2',
        email: 'teller@example.com',
        role: 'TELLER',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    return null;
  }
  
  try {
    const { email, password } = credentials;
    await connectToDatabase();
    const usersCollection = getCollection('users');
    
    // In a real app, use proper password hashing
    const user = await usersCollection.findOne({
      email,
      passwordHash: simpleHash(password)
    }) as User | null;
    
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
  if (isBrowser) {
    console.log('Updating user:', userId, 'with data:', updates);
    // Mock update for browser environment
    return {
      id: userId,
      email: updates.email || 'user@example.com',
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  try {
    await connectToDatabase();
    const usersCollection = getCollection('users');
    
    // Remove fields that shouldn't be updated directly
    const { id, _id, role, passwordHash, ...safeUpdates } = updates;
    
    await usersCollection.updateOne(
      { id: userId },
      { 
        $set: { 
          ...safeUpdates,
          updatedAt: new Date()
        } 
      }
    );
    
    return await usersCollection.findOne({ id: userId }) as User | null;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Update failed');
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  if (isBrowser) {
    console.log('Changing password for user:', userId);
    // Mock password change for browser environment
    return true;
  }
  
  try {
    await connectToDatabase();
    const usersCollection = getCollection('users');
    
    // First verify current password
    const user = await usersCollection.findOne({
      id: userId,
      passwordHash: simpleHash(currentPassword)
    });
    
    if (!user) {
      return false;
    }
    
    // Update password
    await usersCollection.updateOne(
      { id: userId },
      { 
        $set: { 
          passwordHash: simpleHash(newPassword),
          updatedAt: new Date()
        } 
      }
    );
    
    return true;
  } catch (error) {
    console.error('Failed to change password:', error);
    throw new Error('Password change failed');
  }
}
