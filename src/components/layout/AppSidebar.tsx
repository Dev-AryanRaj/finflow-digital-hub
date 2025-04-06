
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  BarChart3, 
  Wallet, 
  Clock, 
  FileText, 
  HelpCircle, 
  User, 
  Settings,
  LogOut
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { useUser } from '@/contexts/UserContext';
import Logo from '@/components/common/Logo';

const customerLinks = [
  { title: 'Dashboard', path: '/', icon: Home },
  { title: 'Accounts', path: '/accounts', icon: Wallet },
  { title: 'Transactions', path: '/transactions', icon: CreditCard },
  { title: 'Deposits', path: '/deposits', icon: Clock },
  { title: 'Bill Payments', path: '/bills', icon: FileText },
  { title: 'Support', path: '/support', icon: HelpCircle },
];

const tellerLinks = [
  { title: 'Dashboard', path: '/', icon: Home },
  { title: 'Customer Profiles', path: '/customers', icon: User },
  { title: 'Transactions', path: '/transactions', icon: CreditCard },
  { title: 'Approvals', path: '/approvals', icon: FileText },
  { title: 'Analytics', path: '/analytics', icon: BarChart3 },
];

const AppSidebar = () => {
  const { user } = useUser();
  
  // Determine which links to show based on user role
  const navigationLinks = user?.role === 'TELLER' ? tellerLinks : customerLinks;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationLinks.map((link) => (
                <SidebarMenuItem key={link.path}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={link.path}
                      className={({ isActive }) => 
                        isActive ? 'bank-nav-item bank-nav-item-active' : 'bank-nav-item'
                      }
                      end={link.path === '/'}
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/settings" className="bank-nav-item">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink to="/logout" className="bank-nav-item">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
