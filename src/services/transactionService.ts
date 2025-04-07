
import { connectToDatabase, getCollection } from '../lib/mongodb';
import { Transaction } from '../models/Transaction';

export async function getTransactions(userId: string, options?: {
  search?: string,
  type?: 'all' | 'credit' | 'debit',
  dateRange?: 'all' | 'week' | 'month' | 'year',
  page?: number,
  limit?: number,
  accountId?: string
}) {
  try {
    console.log('Getting transactions for userId:', userId, 'with options:', options);
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

    console.log('Executing MongoDB query:', JSON.stringify(query));
    
    const transactions = await transactionsCollection
      .find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
      
    const total = await transactionsCollection.countDocuments(query);
    
    console.log(`Found ${transactions.length} transactions out of ${total} total`);
    
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
  try {
    await connectToDatabase();
    const transactionsCollection = getCollection('transactions');
    return await transactionsCollection.findOne({ id });
  } catch (error) {
    console.error('Failed to get transaction:', error);
    throw new Error('Failed to retrieve transaction');
  }
}
