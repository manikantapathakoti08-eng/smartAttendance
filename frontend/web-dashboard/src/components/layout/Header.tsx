'use client';

import React from 'react';
import { User, LogOut, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/stores/authContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <header className={cn(
      'glass-header px-6 py-4 sticky top-0 z-30',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/settings">
            <Button variant="glass" size="sm" className="text-slate-700 hover:text-primary transition-colors">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Smart Attendance
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="glass"
            size="sm"
            className="relative text-slate-700 hover:text-slate-900"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">
                {user.role.replace('_', ' ')}
              </p>
            </div>
            
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-400 to-primary flex items-center justify-center shadow-md shadow-sky-500/20">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="glass"
            size="sm"
            onClick={handleLogout}
            className="text-slate-600 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
