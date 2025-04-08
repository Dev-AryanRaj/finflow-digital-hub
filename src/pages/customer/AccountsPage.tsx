
import React, { useState } from 'react';
import { PlusCircle, CreditCard as CreditCardIcon, Wallet, Eye, EyeOff, DollarSign } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// Mock account data
const checkingAccounts = [
  {
    id: 'c1',
    accountNumber: '2093 **** **** 4582',
    balance: 5249.80,
    type: 'Checking',
    status: 'active',
    availableBalance: 5249.80
  },
  {
    id: 'c2',
    accountNumber: '1845 **** **** 3692',
    balance: 1320.45,
    type: 'Joint Checking',
    status: 'active',
    availableBalance: 1320.45
  }
];

const savingsAccounts = [
  {
    id: 's1',
    accountNumber: '4528 **** **** 9037',
    balance: 12750.30,
    type: 'High Yield Savings',
    status: 'active',
    interestRate: 3.25,
    availableBalance: 12750.30
  }
];

const creditAccounts = [
  {
    id: 'cc1',
    accountNumber: '5783 **** **** 9245',
    balance: 350.75,
    creditLimit: 5000,
    availableCredit: 4649.25,
    type: 'Premium Credit Card',
    status: 'active',
    dueDate: '2025-04-15'
  }
];

const AccountsPage = () => {
  const [showBalances, setShowBalances] = useState(true);
  const { toast } = useToast();
  
  const toggleBalanceVisibility = () => {
    setShowBalances(!showBalances);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const handleNewAccount = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in a future update.",
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage all your accounts in one place
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleBalanceVisibility}
          >
            {showBalances ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
          
          <Button onClick={handleNewAccount} className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>New Account</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="checking" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checking" className="space-y-4">
          {checkingAccounts.map(account => (
            <AccountCard 
              key={account.id}
              account={account}
              showBalance={showBalances}
              formatCurrency={formatCurrency}
              icon={<Wallet className="h-5 w-5 text-bank-primary" />}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-4">
          {savingsAccounts.map(account => (
            <SavingsCard 
              key={account.id}
              account={account}
              showBalance={showBalances}
              formatCurrency={formatCurrency}
              icon={<DollarSign className="h-5 w-5 text-bank-primary" />}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="credit" className="space-y-4">
          {creditAccounts.map(account => (
            <CreditCardComponent 
              key={account.id}
              account={account}
              showBalance={showBalances}
              formatCurrency={formatCurrency}
              icon={<CreditCardIcon className="h-5 w-5 text-bank-primary" />}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AccountProps {
  account: {
    id: string;
    accountNumber: string;
    balance: number;
    type: string;
    status: string;
    availableBalance: number;
  };
  showBalance: boolean;
  formatCurrency: (amount: number) => string;
  icon: React.ReactNode;
}

const AccountCard = ({ account, showBalance, formatCurrency, icon }: AccountProps) => {
  const { toast } = useToast();
  
  const handleTransfer = () => {
    toast({
      title: "Transfer Initiated",
      description: "Please complete the transfer form.",
    });
  };
  
  const handleDetails = () => {
    toast({
      title: "Account Details",
      description: "Detailed view coming soon.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <div>
            <CardTitle>{account.type}</CardTitle>
            <CardDescription>
              {account.accountNumber}
            </CardDescription>
          </div>
        </div>
        <div className={`text-xl font-bold ${showBalance ? '' : 'blur-sm'}`}>
          {formatCurrency(account.balance)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Available Balance
            </p>
            <p className={`font-medium ${showBalance ? '' : 'blur-sm'}`}>
              {formatCurrency(account.availableBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Status
            </p>
            <p className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleTransfer}>Transfer</Button>
        <Button variant="secondary" onClick={handleDetails}>Details</Button>
      </CardFooter>
    </Card>
  );
};

interface SavingsProps {
  account: {
    id: string;
    accountNumber: string;
    balance: number;
    type: string;
    status: string;
    interestRate: number;
    availableBalance: number;
  };
  showBalance: boolean;
  formatCurrency: (amount: number) => string;
  icon: React.ReactNode;
}

const SavingsCard = ({ account, showBalance, formatCurrency, icon }: SavingsProps) => {
  const { toast } = useToast();
  
  const handleTransfer = () => {
    toast({
      title: "Transfer Initiated",
      description: "Please complete the transfer form.",
    });
  };
  
  const handleDetails = () => {
    toast({
      title: "Account Details",
      description: "Detailed view coming soon.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <div>
            <CardTitle>{account.type}</CardTitle>
            <CardDescription>
              {account.accountNumber}
            </CardDescription>
          </div>
        </div>
        <div className={`text-xl font-bold ${showBalance ? '' : 'blur-sm'}`}>
          {formatCurrency(account.balance)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Available Balance
            </p>
            <p className={`font-medium ${showBalance ? '' : 'blur-sm'}`}>
              {formatCurrency(account.availableBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Interest Rate
            </p>
            <p className="font-medium">
              {account.interestRate}%
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={handleTransfer}>Transfer</Button>
        <Button variant="secondary" onClick={handleDetails}>Details</Button>
      </CardFooter>
    </Card>
  );
};

interface CreditCardProps {
  account: {
    id: string;
    accountNumber: string;
    balance: number;
    creditLimit: number;
    availableCredit: number;
    type: string;
    status: string;
    dueDate: string;
  };
  showBalance: boolean;
  formatCurrency: (amount: number) => string;
  icon: React.ReactNode;
}

const CreditCardComponent = ({ account, showBalance, formatCurrency, icon }: CreditCardProps) => {
  const { toast } = useToast();
  
  const handlePayment = () => {
    toast({
      title: "Payment Initiated",
      description: "Please complete the payment form.",
    });
  };
  
  const handleDetails = () => {
    toast({
      title: "Account Details",
      description: "Detailed view coming soon.",
    });
  };
  
  // Calculate utilization percentage
  const utilization = (account.balance / account.creditLimit) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <div>
            <CardTitle>{account.type}</CardTitle>
            <CardDescription>
              {account.accountNumber}
            </CardDescription>
          </div>
        </div>
        <div className={`text-xl font-bold ${showBalance ? '' : 'blur-sm'}`}>
          {formatCurrency(account.balance)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Credit Limit
              </p>
              <p className={`font-medium ${showBalance ? '' : 'blur-sm'}`}>
                {formatCurrency(account.creditLimit)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Available Credit
              </p>
              <p className={`font-medium ${showBalance ? '' : 'blur-sm'}`}>
                {formatCurrency(account.availableCredit)}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-muted-foreground">
                Credit Utilization
              </p>
              <p className="text-sm font-medium">
                {utilization.toFixed(0)}%
              </p>
            </div>
            <Progress value={utilization} className="h-2" />
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Payment Due Date
            </p>
            <p className="font-medium">
              {new Date(account.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" onClick={handlePayment}>Make Payment</Button>
        <Button variant="secondary" onClick={handleDetails}>Details</Button>
      </CardFooter>
    </Card>
  );
};

export default AccountsPage;
