'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIChatMessage } from '@/lib/ai-assistant';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  Mail,
  ShieldCheck,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export function AIChatWidget() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      timestamp: 'Just now',
      content: `👋 Hello! I am your **CollectFlow AR Copilot**.\n\nI continuously monitor debtor accounts, calculate bad-debt risks, and automatically dispatch tone-calibrated reminder emails.\n\nHow can I help you accelerate cash collection today?`,
      suggestedActions: [
        { label: '🚨 Who owes us the most?', actionType: 'NUDGE_ALL_OVERDUE' },
        { label: '🤖 Auto-Send Overdue Reminders', actionType: 'RUN_AUTOPILOT' },
        { label: '✉️ Draft Reminder for Apex Logistics', actionType: 'SEND_REMINDER' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMessage: AIChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputPrompt('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend }),
      });
      const data = await res.json();

      if (data.success && data.data) {
        setMessages((prev) => [...prev, data.data]);
      } else {
        throw new Error(data.error || 'Failed to process request');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          timestamp: 'Just now',
          content: `⚠️ Sorry, I encountered an error: ${err.message}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = async (action: any) => {
    if (action.actionType === 'RUN_AUTOPILOT') {
      toast('Running Autonomous AR Engine...', 'info');
      try {
        const res = await fetch('/api/ai/autopilot', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          toast(data.message, 'success');
          setMessages((prev) => [
            ...prev,
            {
              id: `auto_${Date.now()}`,
              role: 'assistant',
              timestamp: 'Just now',
              content: `✅ **Autonomous Auto-Pilot Run Complete**!\n\n${data.message}\n\nAll debtors have received their calibrated reminder emails with live 1-click Stripe payment links.`,
            },
          ]);
        }
      } catch (e: any) {
        toast('Failed to run autopilot', 'error');
      }
    } else if (action.actionType === 'NUDGE_ALL_OVERDUE') {
      handleSendMessage('Who owes us the most money right now?');
    } else if (action.actionType === 'SEND_REMINDER') {
      handleSendMessage('Draft a follow-up reminder email for our overdue clients');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-full shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 transition-all group border border-emerald-400/30"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-tight">AI Collections Copilot</span>
        </button>
      )}

      {/* Expanded Chat Drawer / Widget */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  CollectFlow AI Copilot
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.2 rounded border border-emerald-500/30">
                    Active
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">Autonomous Dunning & AR Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.content}

                  {/* Suggested Action Buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                        Suggested Actions:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action)}
                            className="w-full text-left py-1.5 px-2.5 rounded-lg bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 transition-all flex items-center justify-between group"
                          >
                            <span>{action.label}</span>
                            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-800 border border-slate-700 w-24">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSendMessage('Who owes us the most money?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              🚨 Top Debtors
            </button>
            <button
              onClick={() => handleSendMessage('Draft an overdue reminder email')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              ✉️ Draft Reminder
            </button>
            <button
              onClick={() => handleSendMessage('What is our cash collection forecast?')}
              className="shrink-0 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              📈 Cash Forecast
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI Copilot to check dues, draft emails..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!inputPrompt.trim() || isTyping}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-3 py-2 rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
