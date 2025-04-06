
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Search, 
  ArrowDown, 
  ArrowUp, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  status: 'pending' | 'completed' | 'failed';
  counterparty?: string;
};

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(2025, 3, 5),
    description: 'Salary Deposit',
    amount: 3500,
    type: 'credit',
    category: 'Income',
    status: 'completed',
    counterparty: 'ABC Company'
  },
  {
    id: '2',
    date: new Date(2025, 3, 4),
    description: 'Grocery Shopping',
    amount: 87.45,
    type: 'debit',
    category: 'Food',
    status: 'completed',
    counterparty: 'Whole Foods'
  },
  {
    id: '3',
    date: new Date(2025, 3, 3),
    description: 'Online Purchase',
    amount: 129.99,
    type: 'debit',
    category: 'Shopping',
    status: 'completed',
    counterparty: 'Amazon'
  },
  {
    id: '4',
    date: new Date(2025, 3, 2),
    description: 'Utility Bill',
    amount: 65.00,
    type: 'debit',
    category: 'Bills',
    status: 'completed',
    counterparty: 'Energy Provider'
  },
  {
    id: '5',
    date: new Date(2025, 3, 1),
    description: 'Restaurant Payment',
    amount: 42.75,
    type: 'debit',
    category: 'Dining',
    status: 'completed',
    counterparty: 'Local Bistro'
  },
  {
    id: '6',
    date: new Date(2025, 2, 28),
    description: 'Freelance Payment',
    amount: 750,
    type: 'credit',
    category: 'Income',
    status: 'completed',
    counterparty: 'Client XYZ'
  },
  {
    id: '7',
    date: new Date(2025, 2, 25),
    description: 'Mobile Phone Bill',
    amount: 35.99,
    type: 'debit',
    category: 'Bills',
    status: 'completed',
    counterparty: 'Telecom Provider'
  },
  {
    id: '8',
    date: new Date(2025, 2, 20),
    description: 'Gym Membership',
    amount: 49.99,
    type: 'debit',
    category: 'Health',
    status: 'completed',
    counterparty: 'Fitness Club'
  },
  {
    id: '9',
    date: new Date(2025, 2, 15),
    description: 'Book Purchase',
    amount: 24.95,
    type: 'debit',
    category: 'Entertainment',
    status: 'completed',
    counterparty: 'Book Store'
  },
  {
    id: '10',
    date: new Date(2025, 2, 10),
    description: 'Investment Dividend',
    amount: 125.50,
    type: 'credit',
    category: 'Investment',
    status: 'completed',
    counterparty: 'Investment Fund'
  },
  {
    id: '11',
    date: new Date(2025, 2, 5),
    description: 'Transfer to Savings',
    amount: 300,
    type: 'debit',
    category: 'Transfer',
    status: 'completed',
    counterparty: 'Own Account'
  },
  {
    id: '12',
    date: new Date(2025, 2, 1),
    description: 'Car Insurance',
    amount: 89.75,
    type: 'debit',
    category: 'Insurance',
    status: 'completed',
    counterparty: 'Insurance Co.'
  }
];

const TransactionsPage = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter transactions based on search query, type filter, and date filter
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.counterparty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'credit' && transaction.type === 'credit') ||
      (typeFilter === 'debit' && transaction.type === 'debit');
    
    let matchesDate = true;
    const today = new Date();
    if (dateFilter === 'week') {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      matchesDate = transaction.date >= lastWeek;
    } else if (dateFilter === 'month') {
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      matchesDate = transaction.date >= lastMonth;
    } else if (dateFilter === 'year') {
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      matchesDate = transaction.date >= lastYear;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  // Paginate transactions
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and filter all your transaction history
          </p>
        </div>
        
        <Button variant="outline" className="flex gap-2">
          <Download size={16} />
          Export
        </Button>
      </div>
      
      <Separator />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="flex items-center space-x-1">
                <Filter size={16} className="text-muted-foreground" />
                <span className="text-sm">Filters:</span>
              </div>
              
              <Select 
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credits</SelectItem>
                  <SelectItem value="debit">Debits</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">
                          {format(transaction.date, 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-muted-foreground md:hidden">
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.counterparty}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`flex items-center justify-end font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : ''
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowDown size={16} className="mr-1 text-green-600" />
                          ) : (
                            <ArrowUp size={16} className="mr-1 text-current" />
                          )}
                          {formatCurrency(transaction.amount)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        <Badge
                          variant={
                            transaction.status === 'completed'
                              ? 'outline'
                              : transaction.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                        isActive={pageNumber === currentPage}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                        isActive={totalPages === currentPage}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
