
import { ObjectId } from 'mongodb';

export type UserRole = 'CUSTOMER' | 'TELLER';

export interface User {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileUrl?: string;
  passwordHash?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}
