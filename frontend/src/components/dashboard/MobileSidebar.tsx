'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  MessageSquare,
  Search,
  Shield,
  MapPin,
  X,
  Sparkles,
} from 'lucide-react';
import { useEffect } from 'react';

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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2937]/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#F9FAFB] shadow-2xl transform transition-transform duration-300 ease-out z-10',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A73E8]/20 bg-[#F9FAFB]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative">
              <MapPin className="h-7 w-7 text-[#1A73E8]" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-[#1A73E8] rounded-full animate-pulse shadow-lg shadow-[#1A73E8]/50" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight text-[#1F2937]">
                Dubify
              </span>
              <span className="text-xs text-[#6B7280] font-medium">
                AI Powered
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-[#1A73E8]/10 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-14rem)]">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    'group relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-[#1A73E8]/10 text-[#1F2937] font-medium shadow-sm scale-[1.02]'
                      : 'text-[#6B7280] hover:bg-[#1A73E8]/5 hover:text-[#1F2937] hover:scale-[1.01]'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#1A73E8] rounded-r-full shadow-lg shadow-[#1A73E8]/50" />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'flex items-center justify-center shrink-0',
                      isActive && 'ml-1',
                      isActive
                        ? 'text-[#1A73E8]'
                        : 'text-[#6B7280] group-hover:text-[#1A73E8]'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Label and Badge */}
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-[#6B7280] mt-0.5 truncate">
                          {item.description}
                        </span>
                      )}
                    </div>
                    {item.badge && (
                      <span className="px-2.5 py-1 text-xs font-bold bg-[#1A73E8] text-white rounded-full shadow-sm shrink-0 ml-2">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-[#1A73E8]/20 bg-[#F9FAFB]">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1A73E8] to-[#1A73E8] p-4 text-white shadow-lg">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <p className="text-sm font-semibold">Powered by AI</p>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                Gemini • Qdrant
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/90">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
