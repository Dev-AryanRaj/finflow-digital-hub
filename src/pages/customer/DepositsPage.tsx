
import React, { useState } from 'react';
import { Calendar, CheckCircle, PiggyBank, Clock, Info, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

// Mock deposits data
const activeDeposits = [
  {
    id: 'd1',
    name: 'Premium CD',
    depositAmount: 10000,
    interestRate: 4.25,
    openDate: new Date('2024-12-01'),
    maturityDate: new Date('2026-12-01'),
    term: 24, // months
    status: 'active',
    projectedReturn: 10850,
    type: 'CD'
  },
  {
    id: 'd2',
    name: 'Money Market',
    depositAmount: 15000,
    interestRate: 3.75,
    openDate: new Date('2025-01-15'),
    maturityDate: null, // No fixed maturity
    term: null,
    status: 'active',
    projectedReturn: null,
    type: 'Money Market'
  },
  {
    id: 'd3',
    name: 'Short Term CD',
    depositAmount: 5000,
    interestRate: 3.50,
    openDate: new Date('2025-02-01'),
    maturityDate: new Date('2025-08-01'),
    term: 6, // months
    status: 'active',
    projectedReturn: 5087.50,
    type: 'CD'
  }
];

const maturedDeposits = [
  {
    id: 'd4',
    name: '12-Month CD',
    depositAmount: 8000,
    interestRate: 3.25,
    openDate: new Date('2024-01-01'),
    maturityDate: new Date('2025-01-01'),
    term: 12, // months
    status: 'matured',
    finalReturn: 8260,
    type: 'CD'
  },
  {
    id: 'd5',
    name: 'Roth IRA CD',
    depositAmount: 6000,
    interestRate: 3.50,
    openDate: new Date('2023-06-01'),
    maturityDate: new Date('2024-12-01'),
    term: 18, // months
    status: 'matured',
    finalReturn: 6315,
    type: 'CD'
  }
];

const DepositsPage = () => {
  const [isNewDepositOpen, setIsNewDepositOpen] = useState(false);
  const { toast } = useToast();
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'Variable';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewDepositOpen(false);
    toast({
      title: "Deposit Creation Initiated",
      description: "A banker will contact you to complete the process.",
    });
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deposits</h1>
          <p className="text-muted-foreground">
            Manage your CDs and money market accounts
          </p>
        </div>
        
        <Dialog open={isNewDepositOpen} onOpenChange={setIsNewDepositOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              <span>New Deposit</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>New Certificate of Deposit</DialogTitle>
              <DialogDescription>
                Create a new certificate of deposit to grow your savings.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDeposit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="depositType" className="text-right">
                    Type
                  </Label>
                  <Select defaultValue="cd">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cd">Certificate of Deposit</SelectItem>
                      <SelectItem value="mm">Money Market</SelectItem>
                      <SelectItem value="ira">IRA CD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <div className="col-span-3 relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="amount" placeholder="5000.00" className="pl-8" />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="term" className="text-right">
                    Term
                  </Label>
                  <Select defaultValue="12">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                      <SelectItem value="24">24 Months</SelectItem>
                      <SelectItem value="36">36 Months</SelectItem>
                      <SelectItem value="60">60 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="source" className="text-right">
                    Source
                  </Label>
                  <Select defaultValue="checking">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking **** 4582</SelectItem>
                      <SelectItem value="savings">Savings **** 9037</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Deposit</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="active">Active Deposits</TabsTrigger>
          <TabsTrigger value="matured">Matured Deposits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDeposits.map(deposit => (
              <DepositCard 
                key={deposit.id}
                deposit={deposit}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="matured" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matured Deposits History</CardTitle>
              <CardDescription>
                Certificates that have reached their maturity date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Maturity Date</TableHead>
                    <TableHead className="text-right">Final Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maturedDeposits.map(deposit => (
                    <TableRow key={deposit.id}>
                      <TableCell>
                        <div className="font-medium">{deposit.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {deposit.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        {deposit.term} months<br />
                        <span className="text-sm text-muted-foreground">
                          {deposit.interestRate}% APY
                        </span>
                      </TableCell>
                      <TableCell>{format(deposit.maturityDate as Date, 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">{formatCurrency(deposit.finalReturn as number)}</div>
                        <div className="text-sm text-muted-foreground">
                          Initial: {formatCurrency(deposit.depositAmount)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface DepositCardProps {
  deposit: {
    id: string;
    name: string;
    depositAmount: number;
    interestRate: number;
    openDate: Date;
    maturityDate: Date | null;
    term: number | null;
    status: string;
    projectedReturn: number | null;
    type: string;
  };
  formatCurrency: (amount: number | null) => string;
}

const DepositCard = ({ deposit, formatCurrency }: DepositCardProps) => {
  const { toast } = useToast();
  
  const handleDetails = () => {
    toast({
      title: "Deposit Details",
      description: "Detailed view coming soon.",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {deposit.type === 'CD' ? (
              <PiggyBank className="h-5 w-5 text-bank-primary" />
            ) : (
              <Clock className="h-5 w-5 text-bank-primary" />
            )}
            <CardTitle>{deposit.name}</CardTitle>
          </div>
          <Badge variant="outline" className="capitalize">{deposit.status}</Badge>
        </div>
        <CardDescription>
          Opened on {format(deposit.openDate, 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">Principal</span>
            <span className="font-medium">{formatCurrency(deposit.depositAmount)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">Interest Rate</span>
            <span className="font-medium">{deposit.interestRate}% APY</span>
          </div>
          
          {deposit.term && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Term</span>
              <span className="font-medium">{deposit.term} months</span>
            </div>
          )}
          
          {deposit.maturityDate && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Matures On</span>
              <span className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(deposit.maturityDate, 'MMM d, yyyy')}
              </span>
            </div>
          )}
          
          {deposit.projectedReturn && (
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-medium text-muted-foreground">Projected Value</span>
              <span className="font-medium text-green-600">{formatCurrency(deposit.projectedReturn)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full" onClick={handleDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Missing lucide-react icon definition for DollarSign
const DollarSign = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default DepositsPage;
