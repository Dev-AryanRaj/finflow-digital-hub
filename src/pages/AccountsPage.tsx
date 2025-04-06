
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusCircle, CreditCard, ArrowDownUp } from 'lucide-react';
import { getUserAccounts } from '@/services/accountService';
import { useUser } from '@/contexts/UserContext';
import { Account } from '@/models/Account';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const AccountsPage = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  // Use React Query to fetch accounts
  const { data: accounts, isLoading, isError, error } = useQuery({
    queryKey: ['accounts', user?.id],
    queryFn: () => getUserAccounts(user?.id || ''),
    enabled: !!user?.id,
  });

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Show error toast if query fails
  React.useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading accounts",
        description: error.toString(),
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  // Account card component
  const AccountCard = ({ account }: { account: Account }) => {
    const isSelected = selectedAccountId === account.id;
    
    return (
      <Card 
        key={account.id} 
        className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
          isSelected ? 'border-primary ring-1 ring-primary' : ''
        }`}
        onClick={() => setSelectedAccountId(account.id)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {account.name}
          </CardTitle>
          <CardDescription>
            **** {account.accountNumber.slice(-4)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(account.balance, account.currency)}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
          </p>
          {account.isDefault && (
            <div className="mt-2">
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                Default Account
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" size="sm">Details</Button>
          <Button variant="outline" size="sm">
            <ArrowDownUp className="h-4 w-4 mr-2" />
            Transfer
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Loading skeleton for accounts
  const AccountSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-28 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your bank accounts and view balances
          </p>
        </div>
        
        <Button className="flex gap-2">
          <PlusCircle size={16} />
          New Account
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <AccountSkeleton />
            <AccountSkeleton />
            <AccountSkeleton />
          </>
        ) : accounts?.length === 0 ? (
          <Card className="col-span-full p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold">No accounts found</h3>
                <p className="text-muted-foreground">
                  You don't have any accounts yet. Create a new account to get started.
                </p>
              </div>
              <Button>
                <PlusCircle size={16} className="mr-2" />
                Create an Account
              </Button>
            </div>
          </Card>
        ) : (
          accounts?.map((account: Account) => (
            <AccountCard key={account.id} account={account} />
          ))
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
