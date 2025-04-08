
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { 
  SidebarTrigger, 
} from '@/components/ui/sidebar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { NotificationCenter } from '../notifications/NotificationCenter';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar = ({ theme, toggleTheme }: NavbarProps) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b bg-white dark:bg-card">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
          <span className="hidden md:inline-block text-lg font-medium">
            {user?.role === 'TELLER' ? 'Teller Dashboard' : 'FinFlow Banking'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="relative"
          >
            {theme === 'light' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center bg-bank-danger text-white">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-2 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileUrl} />
                  <AvatarFallback className="bg-bank-primary text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">{user?.name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as={Link} to="/settings">Profile</DropdownMenuItem>
              <DropdownMenuItem as={Link} to="/settings">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
    </header>
  );
};

export default Navbar;
