
import { ObjectId } from 'mongodb';

export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  _id?: ObjectId;
  id: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  status: TransactionStatus;
  counterparty?: string;
  reference?: string;
  accountId?: string;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}
