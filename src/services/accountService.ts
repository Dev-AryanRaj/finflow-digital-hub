
import { connectToDatabase, getCollection } from '../lib/mongodb';
import { Account } from '../models/Account';
import { v4 as uuidv4 } from 'uuid';

// Check if running in browser environment
const isBrowser = typeof window !== 'undefined';

export async function getUserAccounts(userId: string): Promise<Account[]> {
  if (isBrowser) {
    console.log('Getting user accounts for user:', userId);
    // In browser, we would normally fetch from an API
    // For now, return mock data to prevent errors
    return [
      {
        id: '1',
        userId: userId,
        accountNumber: '1234567890',
        accountType: 'checking',
        balance: 5000,
        currency: 'USD',
        status: 'active',
        name: 'Primary Checking',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        userId: userId,
        accountNumber: '0987654321',
        accountType: 'savings',
        balance: 10000,
        currency: 'USD',
        status: 'active',
        name: 'Savings Account',
        isDefault: false,
        interestRate: 2.5,
        minimumBalance: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
  
  try {
    await connectToDatabase();
    const accountsCollection = getCollection('accounts');
    return await accountsCollection.find({ userId }).toArray() as Account[];
  } catch (error) {
    console.error('Failed to get accounts:', error);
    throw new Error('Failed to retrieve accounts');
  }
}

export async function getAccountById(accountId: string): Promise<Account | null> {
  if (isBrowser) {
    console.log('Getting account details for account:', accountId);
    // Mock data for browser
    return {
      id: accountId,
      userId: '123',
      accountNumber: '1234567890',
      accountType: 'checking',
      balance: 5000,
      currency: 'USD',
      status: 'active',
      name: 'Primary Checking',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  try {
    await connectToDatabase();
    const accountsCollection = getCollection('accounts');
    return await accountsCollection.findOne({ id: accountId }) as Account | null;
  } catch (error) {
    console.error('Failed to get account:', error);
    throw new Error('Failed to retrieve account');
  }
}

export async function createAccount(accountData: Partial<Account>, userId: string): Promise<Account> {
  if (isBrowser) {
    console.log('Creating new account for user:', userId, 'with data:', accountData);
    // Mock response for browser
    return {
      id: uuidv4(),
      userId: userId,
      accountNumber: generateAccountNumber(),
      accountType: accountData.accountType || 'checking',
      balance: accountData.balance || 0,
      currency: accountData.currency || 'USD',
      status: accountData.status || 'active',
      name: accountData.name || `${accountData.accountType || 'New'} Account`,
      isDefault: accountData.isDefault || false,
      interestRate: accountData.interestRate,
      minimumBalance: accountData.minimumBalance,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  try {
    await connectToDatabase();
    const accountsCollection = getCollection('accounts');
    
    const now = new Date();
    
    const newAccount: Account = {
      id: uuidv4(),
      userId: userId,
      accountNumber: generateAccountNumber(),
      accountType: accountData.accountType || 'checking',
      balance: accountData.balance || 0,
      currency: accountData.currency || 'USD',
      status: accountData.status || 'active',
      name: accountData.name || `${accountData.accountType || 'New'} Account`,
      isDefault: accountData.isDefault || false,
      interestRate: accountData.interestRate,
      minimumBalance: accountData.minimumBalance,
      createdAt: now,
      updatedAt: now
    };
    
    await accountsCollection.insertOne(newAccount);
    return newAccount;
  } catch (error) {
    console.error('Failed to create account:', error);
    throw new Error('Failed to create account');
  }
}

export async function updateAccount(accountId: string, updates: Partial<Account>): Promise<Account | null> {
  if (isBrowser) {
    console.log('Updating account:', accountId, 'with data:', updates);
    // Mock response for browser
    return {
      id: accountId,
      userId: '123',
      accountNumber: '1234567890',
      accountType: updates.accountType || 'checking',
      balance: updates.balance || 5000,
      currency: updates.currency || 'USD',
      status: updates.status || 'active',
      name: updates.name || 'Updated Account',
      isDefault: updates.isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  try {
    await connectToDatabase();
    const accountsCollection = getCollection('accounts');
    
    // Remove fields that shouldn't be updated directly
    const { id, _id, userId, accountNumber, createdAt, ...safeUpdates } = updates;
    
    await accountsCollection.updateOne(
      { id: accountId },
      { 
        $set: { 
          ...safeUpdates,
          updatedAt: new Date()
        } 
      }
    );
    
    return await accountsCollection.findOne({ id: accountId }) as Account | null;
  } catch (error) {
    console.error('Failed to update account:', error);
    throw new Error('Failed to update account');
  }
}

// Helper function to generate account number
function generateAccountNumber(): string {
  // Generate a random 10-digit account number
  return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
}
