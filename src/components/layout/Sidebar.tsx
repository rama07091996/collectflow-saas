'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  GitBranch,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/mock-auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Invoices & Debtors', href: '/invoices', icon: Receipt, badge: '3 Overdue' },
  { label: 'Debtor Contacts Directory', href: '/customers', icon: ShieldCheck, badge: '15 Contacts' },
  { label: 'AR Follow-Up Cadence', href: '/workflows', icon: GitBranch },
  { label: 'Integrations & Sync', href: '/integrations', icon: Layers, badge: 'Live' },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const sidebarContent = (
    <div className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              CollectFlow <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">AI</span>
            </span>
            <span className="text-[11px] text-slate-400">Autonomous AR Engine</span>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onCloseMobile?.()}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-emerald-600/15 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Pro Banner */}
        <div className="pt-6 mt-6 border-t border-slate-800 px-2">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart DSO Accelerator</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your average days to pay dropped by <strong className="text-white">14.2 days</strong> this month.
            </p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-4/5 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer System Status & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px]">Webhook Engine</span>
          </div>
          <Link href="/" className="hover:text-slate-200 flex items-center gap-1 text-[11px]">
            <span>Home</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/50 transition-all active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex h-screen shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          {/* Slide-out Drawer */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl animate-in slide-in-from-left duration-200 z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
