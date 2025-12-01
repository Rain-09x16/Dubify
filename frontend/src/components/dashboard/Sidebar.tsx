'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils/cn';
import {
  Home,
  MessageSquare,
  Search,
  Shield,
  MapPin,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard home',
  },
  {
    name: 'AI Chat',
    href: '/dashboard/chat',
    icon: MessageSquare,
    badge: 'AI',
    description: 'Chat with AI assistant',
  },
  {
    name: 'Search',
    href: '/dashboard/search',
    icon: Search,
    description: 'Semantic search',
  },
  {
    name: 'Safety Check',
    href: '/dashboard/safety',
    icon: Shield,
    description: 'Area safety analyzer',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col bg-card border-r border-border shadow-sm transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center border-b border-border shrink-0 px-5 py-5',
          isCollapsed ? 'flex-col gap-3' : 'justify-between'
        )}
      >
        {!isCollapsed ? (
          <>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 transition-opacity duration-300"
            >
              <div className="relative">
                <MapPin className="h-7 w-7 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight text-foreground">
                  Dubify
                </span>
                <span className="text-xs text-muted-foreground font-medium">AI Powered</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {/* <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                  },
                }}
              /> */}
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-secondary transition-all duration-300 shrink-0"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="flex items-center mb-3">
              <div className="relative">
                <MapPin className="h-7 w-7 text-primary" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
              </div>
            </Link>

            {/* <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8',
                },
              }}
            /> */}

            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-secondary transition-all duration-300 rotate-180"
              aria-label="Expand sidebar"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  'group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-primary/10 text-foreground font-medium shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  isCollapsed && 'justify-center px-0'
                )}
              >
                {/* Active indicator */}
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-9 bg-primary rounded-r-full" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'flex items-center justify-center transition-all duration-300',
                    !isCollapsed && isActive && 'ml-2',
                    !isCollapsed && !isActive && 'ml-0',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Label */}
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="text-sm truncate">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full shrink-0 ml-2">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-white border border-[#1A73E8]/20 text-[#1F2937] text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-50 shadow-xl">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-[#6B7280] mt-0.5">
                        {item.description}
                      </div>
                    )}
                    {/* Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-white" />
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          'px-3 py-4 border-t border-border shrink-0',
          isCollapsed && 'px-2'
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-xl bg-primary p-4 text-primary-foreground shadow-lg transition-all duration-300',
            isCollapsed && 'p-3'
          )}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

          {!isCollapsed ? (
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <p className="text-sm font-semibold">Powered by AI</p>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                Gemini • Qdrant
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs opacity-90">All systems operational</span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex justify-center">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
