'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import {
  Bell,
  RefreshCw,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { currentUser, allUsers, currentOrg, switchUser } = useAuth();
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
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20">
      {/* Left: Organization Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>{currentOrg.name}</span>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
            {currentOrg.plan}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Reset Demo Data Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetData}
          isLoading={isResetting}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs font-medium text-slate-600 hover:text-slate-900"
          title="Restore seed data to fresh state"
        >
          Reset Demo Data
        </Button>

        {/* User Persona Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'}
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
              <div className="text-[10px] text-slate-500">{currentUser.email}</div>
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
