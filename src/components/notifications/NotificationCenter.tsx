
import React from 'react';
import { X, Bell, CircleCheck, AlertCircle, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'pending';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationCenterProps {
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Fund Transfer Successful',
    message: '₹10,000 successfully transferred to Rahul Sharma.',
    time: '5 mins ago',
    isRead: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Low Account Balance',
    message: 'Your savings account balance is below the minimum threshold.',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Statement Generated',
    message: 'Your monthly account statement for March is ready.',
    time: 'Yesterday',
    isRead: true
  },
  {
    id: '4',
    type: 'pending',
    title: 'Cheque Book Request',
    message: 'Your request for a new cheque book is under processing.',
    time: '2 days ago',
    isRead: true
  }
];

export const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <div className="absolute right-0 top-16 w-96 max-w-full bg-white dark:bg-card shadow-lg rounded-bl-lg z-50 animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-bank-primary" />
          <h3 className="font-medium">Notifications</h3>
          <span className="bg-bank-danger text-white text-xs px-2 py-0.5 rounded-full">
            {mockNotifications.filter(n => !n.isRead).length}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {mockNotifications.length > 0 ? (
          <div>
            {mockNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No new notifications</p>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t dark:border-gray-700 text-center">
        <Button variant="ghost" size="sm" className="text-bank-primary text-sm">
          Mark all as read
        </Button>
        <Button variant="ghost" size="sm" className="text-bank-primary text-sm">
          View all notifications
        </Button>
      </div>
    </div>
  );
};
