'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/mock-auth';
import { widgetRegistry } from './registry';
import { WidgetTabId } from './types';
import {
  Bot,
  Sparkles,
  Zap,
  DollarSign,
  ShieldCheck,
  Maximize2,
  Minimize2,
  X,
  ChevronDown,
} from 'lucide-react';

export function PowerHubWidget() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<WidgetTabId>('ai');
  const [isMinimized, setIsMinimized] = useState(false);

  const plugins = widgetRegistry.getAllPlugins();
  const activePlugin = widgetRegistry.getPlugin(activeTabId) || plugins[0];

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const ActiveComponent = activePlugin?.component;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. COMPACT LAUNCHER CAPSULE (COLLAPSED)                      */}
      {/* ------------------------------------------------------------- */}
      {!isOpen && (
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-full shadow-2xl hover:border-emerald-500/50 transition-all group">
          {/* Main AI Trigger */}
          <button
            onClick={() => {
              setActiveTabId('ai');
              setIsOpen(true);
            }}
            className="flex items-center gap-2 pl-3 pr-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all font-bold text-xs active:scale-95"
            title="Open Claude AI Copilot & Power Hub (Ctrl+K)"
          >
            <div className="relative">
              <Bot className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-300 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
            <span>Claude AI Hub</span>
            <kbd className="hidden sm:inline-block text-[9px] bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-400/30 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Quick Triggers Direct Icon */}
          <button
            onClick={() => {
              setActiveTabId('actions');
              setIsOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="Quick Action Triggers (1-Click Nudge)"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>

          {/* Quick Payment Links Direct Icon */}
          <button
            onClick={() => {
              setActiveTabId('payments');
              setIsOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="Generate 1-Click Stripe Link"
          >
            <DollarSign className="w-3.5 h-3.5" />
          </button>

          {/* Quick Security Direct Icon */}
          <button
            onClick={() => {
              setActiveTabId('security');
              setIsOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title="2FA & JWT Security Station"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>

          {/* Active Persona Direct Icon */}
          <button
            onClick={() => {
              setActiveTabId('personas');
              setIsOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center overflow-hidden transition-transform hover:scale-110 active:scale-95"
            title={`Active: ${currentUser.name} (${currentUser.role})`}
          >
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. EXPANDED MODULAR WIDGET HOST CONTAINER                     */}
      {/* Mobile Responsive: Full-width Bottom Sheet on Mobile          */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div
          className={`${
            isMinimized
              ? 'w-[320px] h-[64px]'
              : 'max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:w-full max-sm:h-[88vh] max-sm:rounded-t-3xl max-sm:rounded-b-none sm:w-[410px] md:w-[450px] sm:h-[590px] sm:rounded-2xl'
          } bg-slate-950/98 sm:bg-slate-950/95 backdrop-blur-2xl border border-slate-700/80 max-sm:border-b-0 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-200`}
        >
          {/* Mobile Drag Handle */}
          <div className="sm:hidden pt-2 pb-1 flex justify-center cursor-pointer" onClick={() => setIsOpen(false)}>
            <div className="w-12 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                  Claude AI Power Hub
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Claude 3.5
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hidden sm:flex w-6 h-6 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white items-center justify-center transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-6 sm:h-6 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors active:scale-90"
                title="Close"
              >
                <X className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Responsive Loosely Coupled Tab Bar */}
              <div className="flex border-b border-slate-800/80 bg-slate-900/50 p-1.5 sm:p-1 gap-1.5 sm:gap-1 text-[11px] overflow-x-auto no-scrollbar touch-pan-x">
                {plugins.map((plugin) => {
                  const Icon = plugin.icon;
                  const isSelected = activeTabId === plugin.id;
                  return (
                    <button
                      key={plugin.id}
                      onClick={() => setActiveTabId(plugin.id)}
                      title={plugin.tooltip}
                      className={`flex items-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-lg font-medium transition-all shrink-0 active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 sm:w-3 sm:h-3 ${isSelected ? 'text-white' : plugin.iconColor}`} />
                      <span>{plugin.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Plugin Component Render */}
              <div className="flex-1 flex flex-col overflow-hidden pb-safe">
                {ActiveComponent && (
                  <ActiveComponent
                    onClose={() => setIsOpen(false)}
                    onSwitchTab={(tabId) => setActiveTabId(tabId)}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
