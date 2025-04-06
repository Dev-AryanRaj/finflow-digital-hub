
import { connectToDatabase, getCollection } from '../lib/mongodb';
import { Account } from '../models/Account';
import { v4 as uuidv4 } from 'uuid';

export async function getUserAccounts(userId: string): Promise<Account[]> {
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
