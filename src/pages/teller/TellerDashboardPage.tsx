
import React from 'react';
import { Users, CreditCard, ClipboardCheck, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const transactionData = [
  { name: 'Mon', count: 34 },
  { name: 'Tue', count: 45 },
  { name: 'Wed', count: 31 },
  { name: 'Thu', count: 49 },
  { name: 'Fri', count: 62 },
  { name: 'Sat', count: 25 },
  { name: 'Sun', count: 18 },
];

const pendingApprovals = [
  {
    id: '1',
    type: 'Account Opening',
    customer: {
      name: 'Priya Sharma',
      avatar: 'https://i.pravatar.cc/150?u=priya.sharma@example.com'
    },
    submittedAt: '3 hours ago',
    priority: 'high'
  },
  {
    id: '2',
    type: 'Large Transfer',
    customer: {
      name: 'Vikram Mehta',
      avatar: 'https://i.pravatar.cc/150?u=vikram.mehta@example.com'
    },
    submittedAt: '5 hours ago',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'KYC Verification',
    customer: {
      name: 'Rajesh Kumar',
      avatar: 'https://i.pravatar.cc/150?u=rajesh.kumar@example.com'
    },
    submittedAt: '1 day ago',
    priority: 'low'
  }
];

const chatRequests = [
  {
    id: '1',
    customer: {
      name: 'Anjali Patel',
      avatar: 'https://i.pravatar.cc/150?u=anjali.patel@example.com'
    },
    topic: 'Account access issues',
    time: '5 minutes ago',
    status: 'urgent'
  },
  {
    id: '2',
    customer: {
      name: 'Sanjay Gupta',
      avatar: 'https://i.pravatar.cc/150?u=sanjay.gupta@example.com'
    },
    topic: 'Credit card query',
    time: '20 minutes ago',
    status: 'waiting'
  }
];

const TellerDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Teller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Admin. Here's what needs your attention today.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Users className="h-4 w-4 mr-2" />
            Customer Search
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">12</span>
              <ClipboardCheck className="h-8 w-8 text-bank-primary" />
            </div>
            <p className="text-xs text-red-500 mt-2">
              +4 since yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">KYC Verifications</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">8</span>
              <Users className="h-8 w-8 text-bank-accent" />
            </div>
            <p className="text-xs text-amber-500 mt-2">
              Same as yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Today's Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">245</span>
              <CreditCard className="h-8 w-8 text-bank-success" />
            </div>
            <p className="text-xs text-green-500 mt-2">
              +18% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card className="bank-card bank-card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Flagged Accounts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">2</span>
              <AlertCircle className="h-8 w-8 text-bank-danger" />
            </div>
            <p className="text-xs text-red-500 mt-2">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Transaction Activity</CardTitle>
            <CardDescription>Number of transactions processed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0070BA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Pending Approvals</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={approval.customer.avatar} />
                      <AvatarFallback>{approval.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{approval.customer.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">{approval.type}</p>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${approval.priority === 'high' ? 'border-red-500 text-red-500' : ''} 
                            ${approval.priority === 'medium' ? 'border-amber-500 text-amber-500' : ''}
                            ${approval.priority === 'low' ? 'border-green-500 text-green-500' : ''}
                          `}
                        >
                          {approval.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">{approval.submittedAt}</p>
                    <Button size="sm">Review</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer Chat Requests and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Chat Requests */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Customer Chat Requests</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chatRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={request.customer.avatar} />
                      <AvatarFallback>{request.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{request.customer.name}</p>
                      <p className="text-xs text-gray-500">{request.topic}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs text-gray-500">{request.time}</p>
                    </div>
                    <Button size="sm">
                      Respond <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <p className="text-sm text-gray-500">You have resolved 28 chats today</p>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
              +12% from yesterday
            </Badge>
          </CardFooter>
        </Card>
        
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Your Performance</CardTitle>
            <CardDescription>This week compared to your average</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Resolution Time</p>
                <p className="text-sm">3.2 min avg / 5 min target</p>
              </div>
              <Progress value={64} className="h-2" />
              <p className="text-xs text-right mt-1 text-green-600">36% faster than target</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Customer Satisfaction</p>
                <p className="text-sm">4.8/5.0</p>
              </div>
              <Progress value={96} className="h-2" />
              <p className="text-xs text-right mt-1 text-green-600">Top 5% of all tellers</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium">Tasks Completed</p>
                <p className="text-sm">85/90 tasks</p>
              </div>
              <Progress value={94} className="h-2" />
              <p className="text-xs text-right mt-1 text-amber-600">5 tasks pending</p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full">
              View Detailed Performance Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TellerDashboardPage;
