'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AIChatWidget } from '@/components/ai/AIChatWidget';
import {
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  GitBranch,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_BOTTOM_TABS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Invoices', href: '/invoices', icon: Receipt },
  { label: 'Contacts', href: '/customers', icon: ShieldCheck },
  { label: 'Cadence', href: '/workflows', icon: GitBranch },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 relative">
      {/* Responsive Sidebar (Desktop Fixed + Mobile Slide-Out Drawer) */}
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileNavOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Phones & Small Tablets) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 z-40 flex items-center justify-around py-2 px-1 safe-bottom">
        {MOBILE_BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors',
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-400' : 'text-slate-400')} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Floating Claude AI & Modular Power Hub */}
      <AIChatWidget />
    </div>
  );
}
