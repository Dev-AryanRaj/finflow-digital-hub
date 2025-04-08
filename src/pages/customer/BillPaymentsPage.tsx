
import React, { useState } from 'react';
import { Receipt, Clock, FileText, Plus, User, Search, CheckCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Mock bill providers
const billProviders = [
  { id: 1, name: 'Energy Co.', category: 'Utilities', icon: '⚡' },
  { id: 2, name: 'Water Services', category: 'Utilities', icon: '💧' },
  { id: 3, name: 'Internet Plus', category: 'Internet', icon: '🌐' },
  { id: 4, name: 'Mobile Connect', category: 'Mobile', icon: '📱' },
  { id: 5, name: 'Cable Vision', category: 'TV', icon: '📺' },
  { id: 6, name: 'Insurance Group', category: 'Insurance', icon: '🛡️' },
  { id: 7, name: 'Credit Card Co.', category: 'Finance', icon: '💳' },
  { id: 8, name: 'Home Mortgage', category: 'Finance', icon: '🏠' },
];

// Mock upcoming bills
const upcomingBills = [
  { id: 1, provider: 'Energy Co.', amount: 89.50, dueDate: '2025-04-15', icon: '⚡', status: 'Upcoming' },
  { id: 2, provider: 'Water Services', amount: 45.75, dueDate: '2025-04-18', icon: '💧', status: 'Upcoming' },
  { id: 3, provider: 'Internet Plus', amount: 65.00, dueDate: '2025-04-20', icon: '🌐', status: 'Upcoming' },
  { id: 4, provider: 'Mobile Connect', amount: 85.99, dueDate: '2025-04-25', icon: '📱', status: 'Upcoming' },
];

// Mock bill payment history
const paymentHistory = [
  { id: 1, provider: 'Energy Co.', amount: 92.30, date: '2025-03-15', icon: '⚡', status: 'Paid' },
  { id: 2, provider: 'Water Services', amount: 43.75, date: '2025-03-18', icon: '💧', status: 'Paid' },
  { id: 3, provider: 'Internet Plus', amount: 65.00, date: '2025-03-20', icon: '🌐', status: 'Paid' },
  { id: 4, provider: 'Credit Card Co.', amount: 250.00, date: '2025-03-25', icon: '💳', status: 'Paid' },
];

// Mock accounts
const accounts = [
  { id: 1, name: 'Checking Account', accountNumber: '****1234', balance: 4250.75 },
  { id: 2, name: 'Savings Account', accountNumber: '****5678', balance: 12500.50 },
];

const BillPaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();
  const [paymentAmount, setPaymentAmount] = useState('');
  const { toast } = useToast();

  // Filter bill providers based on search term
  const filteredProviders = billProviders.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Function to handle bill payment
  const handlePayBill = () => {
    if (!selectedProvider || !selectedAccount || !paymentAmount) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment Successful",
      description: `You have successfully paid ${formatCurrency(parseFloat(paymentAmount))} to ${selectedProvider}`,
      variant: "default",
    });

    // Reset form fields
    setSelectedProvider(undefined);
    setSelectedAccount(undefined);
    setPaymentAmount('');
    setNewPaymentOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bill Payments</h1>
        <Dialog open={newPaymentOpen} onOpenChange={setNewPaymentOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Payment</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make a Payment</DialogTitle>
              <DialogDescription>
                Enter payment details below to pay a bill.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="provider">Select Bill Provider</Label>
                <Select onValueChange={setSelectedProvider} value={selectedProvider}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select a bill provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {billProviders.map(provider => (
                      <SelectItem key={provider.id} value={provider.name}>
                        <span className="mr-2">{provider.icon}</span> {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account">Pay From</Label>
                <Select onValueChange={setSelectedAccount} value={selectedAccount}>
                  <SelectTrigger id="account">
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.name}>
                        {account.name} ({account.accountNumber}) - {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewPaymentOpen(false)}>Cancel</Button>
              <Button onClick={handlePayBill}>Make Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Your Bills</CardTitle>
          <CardDescription>View upcoming bills, make payments, and track payment history.</CardDescription>
          <div className="flex items-center mt-3">
            <Input
              className="max-w-sm"
              placeholder="Search bills or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="upcoming"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming" className="gap-2">
                <Clock className="h-4 w-4" />
                <span>Upcoming Bills</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <Receipt className="h-4 w-4" />
                <span>Payment History</span>
              </TabsTrigger>
              <TabsTrigger value="providers" className="gap-2">
                <FileText className="h-4 w-4" />
                <span>Bill Providers</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {upcomingBills.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No upcoming bills found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{bill.icon}</span>
                            <span>{bill.provider}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(bill.amount)}</TableCell>
                        <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">
                            {bill.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => {
                            setSelectedProvider(bill.provider);
                            setPaymentAmount(bill.amount.toString());
                            setNewPaymentOpen(true);
                          }}>
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              {paymentHistory.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No payment history found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{payment.icon}</span>
                            <span>{payment.provider}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="providers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProviders.map((provider) => (
                  <Card key={provider.id} className="bank-card bank-card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{provider.icon}</span>
                        <Badge variant="secondary">{provider.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedProvider(provider.name);
                          setNewPaymentOpen(true);
                        }}
                      >
                        Make a Payment
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillPaymentsPage;
