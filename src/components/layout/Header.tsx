'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import {
  Menu,
  RotateCcw,
  Building2,
  CheckCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const { currentUser, allUsers, currentOrg, switchUser, logout } = useAuth();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast('Demo database reset to initial seed values.', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 600);
      }
    } catch (err) {
      toast('Failed to reset demo data.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Mobile Hamburger Menu & Organization Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors active:scale-95"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span className="truncate max-w-[120px] sm:max-w-none">{currentOrg.name}</span>
          <span className="hidden sm:inline-block text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
            {currentOrg.plan}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Data Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetData}
          isLoading={isResetting}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 hidden sm:flex"
          title="Restore seed data to fresh state"
        >
          Reset Demo
        </Button>

        {/* User Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {currentUser.name}
                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {currentUser.role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in"
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Switch Demo Persona
              </div>
              <div className="mt-1 space-y-1">
                {allUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setIsUserMenuOpen(false);
                        toast(`Switched persona to ${user.name} (${user.role})`, 'info');
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        isSelected ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{user.role}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>

              {/* Log Out Action */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    toast('Logging out of CollectFlow workspace...', 'info');
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
