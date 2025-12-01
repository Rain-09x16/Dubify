'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileSidebar } from '@/components/dashboard/MobileSidebar';
import { SidebarProvider, useSidebar } from '@/components/dashboard/SidebarContext';
import { UserButton } from '@clerk/nextjs';
import { MapPin, Menu } from 'lucide-react';
import { useState } from 'react';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#F9FAFB]" data-sidebar-collapsed={isCollapsed}>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="hover:bg-secondary h-8 w-8"
            >
              <Menu className="h-4 w-4 text-foreground" />
            </Button>

            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
              </div>
              <span className="font-bold text-sm text-foreground hidden sm:inline">
                Dubai Navigator
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
              Demo Mode
            </div>

            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Home
              </Button>
            </Link>

            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out" data-sidebar-collapsed={isCollapsed}>
          {/* Desktop Top Bar */}
          <div className="hidden lg:block sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium shadow-sm">
                  <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                  Demo Mode
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-xs h-8">
                    Back to Home
                  </Button>
                </Link>

                <div className="h-4 w-px bg-border" />

                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5 max-w-7xl h-[calc(100%-3.5rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
