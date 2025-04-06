
// MongoDB Bulk Insertion Queries
// This file is for reference and can be run directly with Node.js when connected to your MongoDB instance

const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid'); // You'd need to install this with npm install uuid

// Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'bankapp';

// Generate a simple hash (FOR DEMO PURPOSES ONLY - use proper hashing in production)
function simpleHash(input) {
  return Buffer.from(input).toString('base64');
}

async function seedDatabase() {
  const client = new MongoClient(url);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB server');
    
    const db = client.db(dbName);
    
    // Clear existing collections
    await db.collection('users').deleteMany({});
    await db.collection('transactions').deleteMany({});
    await db.collection('accounts').deleteMany({});
    
    // Create users
    const users = [
      {
        id: uuidv4(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'CUSTOMER',
        profileUrl: 'https://i.pravatar.cc/150?u=john.doe@example.com',
        passwordHash: simpleHash('password123'),
        phone: '555-123-4567',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Admin User',
        email: 'admin@finflow.com',
        role: 'TELLER',
        profileUrl: 'https://i.pravatar.cc/150?u=admin@finflow.com',
        passwordHash: simpleHash('admin123'),
        phone: '555-987-6543',
        address: {
          street: '456 Bank Ave',
          city: 'Finance City',
          state: 'NY',
          zipCode: '67890',
          country: 'USA'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await db.collection('users').insertMany(users);
    console.log(`${result.insertedCount} users inserted`);
    
    // Create accounts for John Doe
    const johnDoe = users[0];
    const accounts = [
      {
        id: uuidv4(),
        userId: johnDoe.id,
        accountNumber: '1234567890',
        accountType: 'checking',
        balance: 5240.75,
        currency: 'USD',
        status: 'active',
        name: 'Primary Checking',
        isDefault: true,
        minimumBalance: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: johnDoe.id,
        accountNumber: '0987654321',
        accountType: 'savings',
        balance: 12750.50,
        currency: 'USD',
        status: 'active',
        name: 'Savings Account',
        isDefault: false,
        interestRate: 2.5,
        minimumBalance: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId: johnDoe.id,
        accountNumber: '5678901234',
        accountType: 'investment',
        balance: 32000.00,
        currency: 'USD',
        status: 'active',
        name: 'Investment Portfolio',
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const acctResult = await db.collection('accounts').insertMany(accounts);
    console.log(`${acctResult.insertedCount} accounts inserted`);
    
    // Create transactions for John Doe
    const transactions = [];
    
    // Transaction categories
    const categories = ['Income', 'Food', 'Shopping', 'Bills', 'Dining', 'Entertainment', 'Health', 'Insurance', 'Investment', 'Transfer'];
    
    // Transaction counterparties
    const counterparties = [
      'ABC Company',
      'Whole Foods',
      'Amazon',
      'Energy Provider',
      'Local Bistro',
      'Client XYZ',
      'Telecom Provider',
      'Fitness Club',
      'Book Store',
      'Investment Fund',
      'Own Account',
      'Insurance Co.',
      'Target',
      'Walmart',
      'Netflix',
      'Uber',
      'Gas Station',
      'Coffee Shop'
    ];
    
    // Generate 50 random transactions for the past 6 months
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    for (let i = 0; i < 50; i++) {
      const isCredit = Math.random() > 0.7; // 30% chance of being a credit
      const amount = isCredit 
        ? Math.floor(Math.random() * 3000) + 500 // Credits between 500-3500
        : Math.floor(Math.random() * 500) + 10; // Debits between 10-510
      
      const date = new Date(
        sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
      );
      
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const counterpartyIndex = Math.floor(Math.random() * counterparties.length);
      const accountIndex = Math.floor(Math.random() * accounts.length);
      
      transactions.push({
        id: uuidv4(),
        userId: johnDoe.id,
        date: date,
        description: isCredit 
          ? ['Salary Deposit', 'Freelance Payment', 'Investment Return', 'Refund', 'Transfer Received'][Math.floor(Math.random() * 5)]
          : ['Purchase', 'Payment', 'Bill', 'Subscription', 'Transfer'][Math.floor(Math.random() * 5)],
        amount: amount,
        type: isCredit ? 'credit' : 'debit',
        category: categories[categoryIndex],
        status: Math.random() > 0.9 ? 'pending' : 'completed', // 10% pending
        counterparty: counterparties[counterpartyIndex],
        reference: `REF-${Math.floor(Math.random() * 1000000)}`,
        accountId: accounts[accountIndex].id,
        createdAt: date,
        updatedAt: date
      });
    }
    
    const txResult = await db.collection('transactions').insertMany(transactions);
    console.log(`${txResult.insertedCount} transactions inserted`);
    
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedDatabase().catch(console.error);
