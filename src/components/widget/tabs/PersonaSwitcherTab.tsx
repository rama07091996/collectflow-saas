'use client';

import React from 'react';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2 } from 'lucide-react';
import { WidgetTabProps } from '../types';

export function PersonaSwitcherTab({}: WidgetTabProps) {
  const { currentUser, allUsers, switchUser } = useAuth();
  const { toast } = useToast();

  return (
    <div className="flex-1 p-4 space-y-2.5 overflow-y-auto text-xs">
      <div className="text-xs text-slate-400 font-medium mb-1">
        Switch Active Demo User Persona:
      </div>

      <div className="space-y-1.5">
        {allUsers.map((u) => {
          const isSelected = u.id === currentUser.id;
          return (
            <button
              key={u.id}
              onClick={() => {
                switchUser(u.id);
                toast(`Switched persona to ${u.name} (${u.role})`, 'info');
              }}
              className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-white'
                  : 'bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold text-white">{u.name}</div>
                  <div className="text-[10px] text-slate-400">{u.role}</div>
                </div>
              </div>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
