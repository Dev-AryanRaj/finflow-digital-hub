import { connectToDatabase, getCollection } from '../lib/mongodb';
import { Transaction, TransactionType } from '../models/Transaction';

// Check if running in browser environment
const isBrowser = typeof window !== 'undefined';

// Generate mock transactions for browser environment
function generateMockTransactions(userId: string, count = 10): Transaction[] {
  const transactions: Transaction[] = [];
  const types: TransactionType[] = ['credit', 'debit'];
  const categories = ['Groceries', 'Utilities', 'Salary', 'Transfer', 'Shopping'];
  const counterparties = ['Amazon', 'Walmart', 'Employer Inc', 'Electric Company', 'Friend'];
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const counterparty = counterparties[Math.floor(Math.random() * counterparties.length)];
    const amount = Math.floor(Math.random() * 500) + 10;
    
    const date = new Date(now);
    date.setDate(now.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days
    
    transactions.push({
      id: `mock-${i}`,
      userId,
      accountId: '1',
      type,
      amount,
      currency: 'USD',
      date,
      description: `Payment to ${counterparty}`,
      category,
      counterparty,
      status: 'completed',
      createdAt: date,
      updatedAt: date
    });
  }
  
  return transactions;
}

export async function getTransactions(userId: string, options?: {
  search?: string,
  type?: 'all' | 'credit' | 'debit',
  dateRange?: 'all' | 'week' | 'month' | 'year',
  page?: number,
  limit?: number,
  accountId?: string
}) {
  if (isBrowser) {
    console.log('Getting transactions for userId:', userId, 'with options:', options);
    
    // Generate mock data for browser
    let mockTransactions = generateMockTransactions(userId, 20);
    
    // Apply filters if provided
    if (options?.accountId) {
      mockTransactions = mockTransactions.filter(t => t.accountId === options.accountId);
    }
    
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      mockTransactions = mockTransactions.filter(t => 
        t.description.toLowerCase().includes(searchLower) ||
        t.counterparty.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower)
      );
    }
    
    if (options?.type && options.type !== 'all') {
      mockTransactions = mockTransactions.filter(t => t.type === options.type);
    }
    
    // Sort by date descending
    mockTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Paginate
    const limit = options?.limit || 10;
    const page = options?.page || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = mockTransactions.slice(startIndex, endIndex);
    
    return {
      data: paginatedTransactions,
      pagination: {
        total: mockTransactions.length,
        page: page,
        limit,
        totalPages: Math.ceil(mockTransactions.length / limit)
      }
    };
  }
  
  try {
    await connectToDatabase();
    const transactionsCollection = getCollection('transactions');
    
    const query: any = {};
    
    // Add userId filter only if provided (to allow filtering by accountId only)
    if (userId) {
      query.userId = userId;
    }
    
    // Add accountId filter if provided
    if (options?.accountId) {
      query.accountId = options.accountId;
    }
    
    // We must have either userId or accountId
    if (!userId && !options?.accountId) {
      throw new Error('Either userId or accountId must be provided');
    }
    
    const limit = options?.limit || 10;
    const skip = ((options?.page || 1) - 1) * limit;
    
    // Apply search filter
    if (options?.search) {
      const searchRegex = new RegExp(options.search, 'i');
      query.$or = [
        { description: searchRegex },
        { counterparty: searchRegex },
        { category: searchRegex }
      ];
    }
    
    // Apply type filter
    if (options?.type && options.type !== 'all') {
      query.type = options.type;
    }
    
    // Apply date filter
    if (options?.dateRange && options.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (options.dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      query.date = { $gte: startDate };
    }
    
    const transactions = await transactionsCollection
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const total = await transactionsCollection.countDocuments(query);
    
    return {
      data: transactions,
      pagination: {
        total,
        page: options?.page || 1,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Failed to get transactions:', error);
    
    // Return empty data with error information instead of throwing
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error fetching transactions',
      pagination: {
        total: 0,
        page: options?.page || 1,
        limit: options?.limit || 10,
        totalPages: 0
      }
    };
  }
}

export async function getTransactionById(id: string) {
  if (isBrowser) {
    console.log('Getting transaction details for transaction:', id);
    // Mock transaction for browser
    return {
      id,
      userId: '123',
      accountId: '1',
      type: 'debit',
      amount: 42.99,
      currency: 'USD',
      date: new Date(),
      description: 'Purchase at Online Store',
      category: 'Shopping',
      counterparty: 'Online Store',
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  try {
    await connectToDatabase();
    const transactionsCollection = getCollection('transactions');
    return await transactionsCollection.findOne({ id });
  } catch (error) {
    console.error('Failed to get transaction:', error);
    throw new Error('Failed to retrieve transaction');
  }
}
