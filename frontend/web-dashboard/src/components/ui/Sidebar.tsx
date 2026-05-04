"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  Activity, 
  Brain, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Calendar
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/authStore";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  requiredRole?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: LayoutDashboard 
  },
  { 
    name: "User Management", 
    href: "/dashboard/users", 
    requiredRole: ["ADMIN", "SUPER_ADMIN"],
    icon: Users 
  },
  { 
    name: "Onboarding", 
    href: "/dashboard/users/onboarding", 
    requiredRole: ["ADMIN", "SUPER_ADMIN"],
    icon: Shield 
  },
  { 
    name: "Departments", 
    href: "/departments", 
    requiredRole: ["ADMIN", "SUPER_ADMIN"],
    icon: Map 
  },
  { 
    name: "Room Management", 
    href: "/rooms", 
    requiredRole: ["ADMIN", "SUPER_ADMIN", "FACULTY"],
    icon: Map 
  },
  { 
    name: "Attendance", 
    href: "/attendance", 
    requiredRole: ["ADMIN", "SUPER_ADMIN", "FACULTY"],
    icon: Activity 
  },
  { 
    name: "Timetable", 
    href: "/timetable", 
    requiredRole: ["ADMIN", "SUPER_ADMIN", "FACULTY"],
    icon: Calendar
  },
  { 
    name: "AI Analytics", 
    href: "/analytics", 
    requiredRole: ["ADMIN", "SUPER_ADMIN"],
    icon: Brain 
  },
  { 
    name: "Settings", 
    href: "/settings", 
    icon: Settings 
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);

  const filteredNavigation = NAV_ITEMS.filter(item => {
    if (!user) return false;
    
    // Safety: Always hide Attendance for students
    if (user.role.includes('STUDENT') && item.name === 'Attendance') return false;

    if (!item.requiredRole) return true;
    
    const userRole = user.role.replace('ROLE_', '');
    return item.requiredRole.some(role => role.replace('ROLE_', '') === userRole);
  });

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-white border-r border-slate-200 flex flex-col relative shrink-0 z-20 shadow-xl shadow-sky-900/5"
    >
      <div className="flex items-center justify-between p-6 h-20">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 font-semibold text-lg tracking-wide text-slate-900"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.4)]">
              <span className="text-white text-sm">SA</span>
            </div>
            Smart Admin
          </motion.div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors absolute right-4"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 rounded-xl border-primary border opacity-50 pointer-events-none" 
                  />
                )}
                <Icon size={20} className={cn(isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-900")} />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Status Bar */}
      {!isCollapsed && user && (
        <div className="p-4 mt-auto border-t border-slate-200 bg-slate-50/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-300">
              {(user.name || 'U').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
