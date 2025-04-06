
import React from 'react';
import { ArrowRight, ArrowUp, ArrowDown, Plus, Timer, CreditCard, Banknote, CircleDollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const accountOverview = {
  savingsBalance: '₹120,455.76',
  currentBalance: '₹35,240.50',
  fixedDeposits: '₹250,000.00',
  recurringDeposits: '₹45,000.00'
};

const recentTransactions = [
  { id: 1, description: 'Paytm Transfer', amount: '₹5,000', type: 'debit', date: 'April 2', icon: <ArrowUp className="h-4 w-4 text-red-500" /> },
  { id: 2, description: 'HDFC Mortgage', amount: '₹12,300', type: 'debit', date: 'April 1', icon: <ArrowUp className="h-4 w-4 text-red-500" /> },
  { id: 3, description: 'Salary Deposit', amount: '₹75,000', type: 'credit', date: 'March 31', icon: <ArrowDown className="h-4 w-4 text-green-500" /> },
  { id: 4, description: 'Amazon Purchase', amount: '₹3,520', type: 'debit', date: 'March 29', icon: <ArrowUp className="h-4 w-4 text-red-500" /> }
];

const spendingData = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 2780 },
  { name: 'May', amount: 1890 },
  { name: 'Jun', amount: 2390 },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Good afternoon, John</h1>
          <p className="text-muted-foreground">Here's an overview of your accounts</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>
      
      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">Savings Account</CardTitle>
              <CircleDollarSign className="h-5 w-5 text-bank-primary" />
            </div>
            <CardDescription>Primary</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{accountOverview.savingsBalance}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="p-0 h-auto text-bank-primary">
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">Current Account</CardTitle>
              <Banknote className="h-5 w-5 text-bank-accent" />
            </div>
            <CardDescription>Business</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{accountOverview.currentBalance}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="p-0 h-auto text-bank-primary">
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">Fixed Deposits</CardTitle>
              <CreditCard className="h-5 w-5 text-bank-success" />
            </div>
            <CardDescription>3 active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{accountOverview.fixedDeposits}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="p-0 h-auto text-bank-primary">
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">Recurring Deposits</CardTitle>
              <Timer className="h-5 w-5 text-bank-warning" />
            </div>
            <CardDescription>2 active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{accountOverview.recurringDeposits}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="link" className="p-0 h-auto text-bank-primary">
              View Details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Transaction History and Spending Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={transaction.type === 'credit' ? 'text-green-600' : 'text-gray-800 dark:text-gray-300'}>
                    {transaction.type === 'credit' ? '+' : ''}{transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Spending Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
            <CardDescription>Your spending trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Bar dataKey="amount" fill="#0070BA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Payments and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Due within the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Electricity Bill</p>
                  <p className="text-sm text-gray-500">Due in 2 days</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹2,450</p>
                  <Button size="sm" variant="outline" className="mt-1">Pay Now</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Internet Bill</p>
                  <p className="text-sm text-gray-500">Due in 5 days</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹1,299</p>
                  <Button size="sm" variant="outline" className="mt-1">Pay Now</Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">View All Scheduled Payments</Button>
          </CardFooter>
        </Card>
        
        {/* Financial Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>Track your savings goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">New Car</p>
                  <p className="text-sm">₹250,000 / ₹600,000</p>
                </div>
                <Progress value={42} className="h-2" />
                <p className="text-xs text-right mt-1 text-gray-500">42% complete</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">Emergency Fund</p>
                  <p className="text-sm">₹150,000 / ₹200,000</p>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-right mt-1 text-gray-500">75% complete</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Goal
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
