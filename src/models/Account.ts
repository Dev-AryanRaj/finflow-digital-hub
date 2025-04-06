
import { ObjectId } from 'mongodb';

export type AccountType = 'checking' | 'savings' | 'investment' | 'loan';
export type AccountStatus = 'active' | 'inactive' | 'frozen' | 'closed';

export interface Account {
  _id?: ObjectId;
  id: string;
  userId: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  currency: string;
  status: AccountStatus;
  name: string;
  isDefault?: boolean;
  interestRate?: number;
  minimumBalance?: number;
  createdAt: Date;
  updatedAt: Date;
}
