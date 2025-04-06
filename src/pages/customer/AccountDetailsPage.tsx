
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  BarChart4, 
  Download, 
  PiggyBank, 
  Shield, 
  Clock,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { getAccountById } from '@/services/accountService';
import { getTransactions } from '@/services/transactionService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Transaction } from '@/models/Transaction';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AccountDetailsPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch account details
  const { 
    data: account, 
    isLoading: isLoadingAccount, 
    isError: isAccountError 
  } = useQuery({
    queryKey: ['account', accountId],
    queryFn: () => getAccountById(accountId || ''),
    enabled: !!accountId,
  });
  
  // Fetch recent transactions for this account
  const { 
    data: transactionsData, 
    isLoading: isLoadingTransactions 
  } = useQuery({
    queryKey: ['account-transactions', accountId],
    queryFn: () => getTransactions('', { 
      limit: 5,
      accountId: accountId
    }),
    enabled: !!accountId,
  });
  
  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  if (isAccountError) {
    toast({
      title: "Error loading account",
      description: "Could not load account details. Please try again.",
      variant: "destructive",
    });
    navigate("/accounts");
    return null;
  }
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/accounts")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Account Details</h1>
      </div>
      
      {isLoadingAccount ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bank-primary"></div>
        </div>
      ) : account ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    {account.name}
                    {account.isDefault && (
                      <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-0">
                        Default
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Account ending in {account.accountNumber.slice(-4)}</CardDescription>
                </div>
                
                <Button variant="outline" className="flex gap-2">
                  <Download size={16} />
                  Download Statement
                </Button>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current balance</p>
                  <p className="text-3xl font-bold">{formatCurrency(account.balance, account.currency)}</p>
                </div>
                
                <div className="flex gap-4">
                  <Button>Transfer</Button>
                  <Button variant="outline">Pay</Button>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Tabs defaultValue="transactions">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="details">Account Details</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recent Transactions</h3>
                <Button variant="ghost" onClick={() => navigate("/transactions")}>View All</Button>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  {isLoadingTransactions ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-bank-primary"></div>
                    </div>
                  ) : transactionsData?.data.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions found for this account
                    </div>
                  ) : (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="hidden md:table-cell text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactionsData?.data.map((transaction: Transaction) => (
                            <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell>
                                <div className="font-medium">
                                  {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="font-medium">{transaction.description}</div>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.counterparty}
                                </div>
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                      <p className="text-lg font-medium">
                        {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                      <p className="text-lg font-medium">
                        **** **** **** {account.accountNumber.slice(-4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Currency</p>
                      <p className="text-lg font-medium">{account.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <p className="text-lg font-medium capitalize">{account.status}</p>
                    </div>
                    {account.interestRate !== undefined && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                        <p className="text-lg font-medium">{account.interestRate}%</p>
                      </div>
                    )}
                    {account.minimumBalance !== undefined && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Minimum Balance</p>
                        <p className="text-lg font-medium">{formatCurrency(account.minimumBalance)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Opened On</p>
                      <p className="text-lg font-medium">
                        {format(new Date(account.createdAt), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Card className="bg-muted/50 border-0">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Shield size={24} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Security Features</h4>
                            <p className="text-sm text-muted-foreground">
                              Enhanced protection for your account
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex-1">
                      <Card className="bg-muted/50 border-0">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <PiggyBank size={24} className="text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Savings Goals</h4>
                            <p className="text-sm text-muted-foreground">
                              Set and track your savings targets
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5" />
                    Spending Analysis
                  </CardTitle>
                  <CardDescription>
                    Insights into your spending patterns and habits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center items-center py-12 text-center">
                    <div>
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        We're working on adding detailed spending analysis for your account.
                        Check back soon for insights into your financial habits.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <p>Account not found</p>
          <Button 
            variant="link" 
            onClick={() => navigate("/accounts")}
            className="mt-4"
          >
            Back to Accounts
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountDetailsPage;
