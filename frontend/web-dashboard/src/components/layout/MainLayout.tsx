'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Map, 
  Activity, 
  Settings, 
  Brain, 
  Shield,
  Calendar,
  ArrowUp,
  FileText
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Header } from './Header';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  requiredRole?: string[];
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = !!useAuthStore((s) => s.accessToken);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      href: '/dashboard',
    },
    {
      id: 'users',
      label: 'User Management',
      icon: <Users className="h-4 w-4" />,
      href: '/dashboard/users',
      requiredRole: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'onboarding',
      label: 'Onboarding',
      icon: <Shield className="h-4 w-4" />,
      href: '/dashboard/users/onboarding',
      requiredRole: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'departments',
      label: 'Departments',
      icon: <Map className="h-4 w-4" />,
      href: '/departments',
      requiredRole: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'rooms',
      label: 'Room Management',
      icon: <Map className="h-4 w-4" />,
      href: '/rooms',
      requiredRole: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <Activity className="h-4 w-4" />,
      href: '/attendance',
      requiredRole: ['FACULTY', 'STUDENT'],
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: <Calendar className="h-4 w-4" />,
      href: '/timetable',
      requiredRole: ['ADMIN', 'SUPER_ADMIN', 'FACULTY'],
    },
    {
      id: 'analytics',
      label: 'AI Analytics',
      icon: <Brain className="h-4 w-4" />,
      href: '/analytics',
      requiredRole: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'student-promotion',
      label: 'Student Promotion',
      icon: <ArrowUp className="h-4 w-4" />,
      href: '/dashboard/users/promotion',
      requiredRole: ['ADMIN', 'SUPER_ADMIN'],
    },
    {
      id: 'attendance-reports',
      label: 'Attendance Reports',
      icon: <FileText className="h-4 w-4" />,
      href: '/dashboard/attendance/reports',
      requiredRole: ['ADMIN', 'SUPER_ADMIN', 'FACULTY'],
    },
    {
      id: 'cr-lr',
      label: 'CR/LR Assignments',
      icon: <Users className="h-4 w-4" />,
      href: '/dashboard/faculty/cr-lr',
      requiredRole: ['FACULTY'],
    },
  ];

  const filteredNavigation = navigationItems.filter(item => {
    if (!item.requiredRole) return true;
    if (!user) return false;
    
    const userRole = user.role.replace('ROLE_', '');
    return item.requiredRole.some(role => role.replace('ROLE_', '') === userRole);
  });

  if (!isMounted || !isAuthenticated || !user) {
    return <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">Loading System...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — Light Theme Surface */}
      <aside className="w-66 bg-white border-r border-slate-200 h-screen shadow-xl shadow-sky-900/5 z-20 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.4)]">
              <span className="text-white text-sm font-bold">SA</span>
            </div>
            <span className="font-semibold text-lg text-slate-900 tracking-tight">Smart Admin</span>
          </div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">
            Navigation
          </h2>
        </div>
        
        <nav className="px-4 pb-6">
          <ul className="space-y-1.5">
            {filteredNavigation.map((item) => (
              <motion.li
                key={item.id}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  onMouseEnter={() => {
                    // 🏎️ PERFORMANCE: Pre-warm lightweight metadata only on hover
                    // Avoid pre-warming heavy analytics on free tier to prevent CPU spikes
                    if (item.id === 'departments' || item.id === 'users') {
                      import('@/services/userManagement.service').then(s => {
                        s.userManagementService.getDepartments().catch(() => {});
                      });
                    }
                  }}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 w-full group',
                    'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <div className="p-1.5 rounded-lg group-hover:text-primary transition-colors">
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm tracking-wide">{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Status Bar */}
        <div className="mt-auto p-6 border-t border-slate-200">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 text-xs font-bold text-slate-700 uppercase italic tracking-tighter">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate uppercase tracking-wider">{user.name}</p>
                <p className="text-[10px] text-primary font-bold truncate tracking-widest">{user.role}</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content — Light Surface Base */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <Header />
        
        <main className="flex-1 p-0 relative">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-400/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          {children}
        </main>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(203, 213, 225, 1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(14, 165, 233, 0.5);
        }
      `}</style>
    </div>
  );
}

export default MainLayout;
