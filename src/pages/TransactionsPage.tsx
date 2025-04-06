
import React, { useState, useEffect } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@/services/transactionService';
import { Transaction } from '@/models/Transaction';

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
import { useToast } from '@/components/ui/use-toast';

const TransactionsPage = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Use React Query to fetch transactions
  const { data: transactionData, isLoading, isError, error } = useQuery({
    queryKey: ['transactions', user?.id, searchQuery, typeFilter, dateFilter, currentPage],
    queryFn: () => getTransactions(user?.id || '', {
      search: searchQuery,
      type: typeFilter,
      dateRange: dateFilter,
      page: currentPage,
      limit: itemsPerPage
    }),
    enabled: !!user?.id,
  });

  // Show error toast if query fails
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading transactions",
        description: error.toString(),
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

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

  // Generate pagination items
  const generatePaginationItems = () => {
    if (!transactionData?.pagination) return [];

    const { totalPages, page } = transactionData.pagination;
    let items = [];

    // Always show first page
    items.push(1);

    // Calculate range of pages to show around current page
    let startPage = Math.max(2, page - 1);
    let endPage = Math.min(totalPages - 1, page + 1);

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push('ellipsis-start');
    }

    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      items.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1 && totalPages > 1) {
      items.push('ellipsis-end');
    }

    // Add last page if it's not the first page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
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
                onValueChange={(value) => setTypeFilter(value as 'all' | 'credit' | 'debit')}
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
                onValueChange={(value) => setDateFilter(value as 'all' | 'week' | 'month' | 'year')}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-bank-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactionData?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactionData?.data.map((transaction: Transaction) => (
                    <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
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
          
          {transactionData?.pagination && transactionData.pagination.totalPages > 1 && (
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
                
                {generatePaginationItems().map((item, index) => (
                  item === 'ellipsis-start' || item === 'ellipsis-end' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`page-${item}`}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(item as number);
                        }}
                        isActive={item === currentPage}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (transactionData.pagination && currentPage < transactionData.pagination.totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={
                      transactionData.pagination && currentPage === transactionData.pagination.totalPages 
                      ? 'pointer-events-none opacity-50' 
                      : ''
                    }
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
