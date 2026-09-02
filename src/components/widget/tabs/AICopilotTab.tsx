'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AIChatMessage } from '@/lib/ai-assistant';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import { Send, Sparkles, ChevronRight, Cpu, Bot } from 'lucide-react';
import { WidgetTabProps } from '../types';

export function AICopilotTab({ onSwitchTab }: WidgetTabProps) {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [selectedModel, setSelectedModel] = useState<'claude-3-5-sonnet-20241022' | 'claude-3-haiku-20240307'>('claude-3-5-sonnet-20241022');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      timestamp: 'Just now',
      content: `👋 Hi **${currentUser.name}**!\n\nI am **Claude 3.5 Sonnet**, your Autonomous AR Copilot.\n\nAsk me anything about overdue debtor accounts, request custom dunning emails, or review cashflow forecasts!`,
      suggestedActions: [
        { label: '🚨 Who owes us the most money?', actionType: 'NUDGE_ALL_OVERDUE' },
        { label: '🤖 Run Auto-Pilot Follow-Up', actionType: 'RUN_AUTOPILOT' },
        { label: '✉️ Draft Overdue Reminder Letter', actionType: 'SEND_REMINDER' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        body: JSON.stringify({ prompt: textToSend, model: selectedModel }),
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Claude AI Engine Selector Bar */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Cpu className="w-3 h-3 text-emerald-400" />
          <span>Model Engine:</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              setSelectedModel('claude-3-5-sonnet-20241022');
              toast('Switched to Claude 3.5 Sonnet (Free/Smart)', 'info');
            }}
            className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
              selectedModel === 'claude-3-5-sonnet-20241022'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Claude 3.5 Sonnet
          </button>
          <button
            onClick={() => {
              setSelectedModel('claude-3-haiku-20240307');
              toast('Switched to Claude 3 Haiku (Fast)', 'info');
            }}
            className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
              selectedModel === 'claude-3-haiku-20240307'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Claude Haiku
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-xl leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.content}

              {/* Suggested Action Buttons */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (action.actionType === 'RUN_AUTOPILOT') {
                          onSwitchTab?.('actions');
                        } else if (action.actionType === 'NUDGE_ALL_OVERDUE') {
                          handleSendMessage('Who owes us the most money right now?');
                        } else {
                          handleSendMessage('Draft a formal overdue reminder letter for Apex Logistics');
                        }
                      }}
                      className="w-full text-left py-1.5 px-2.5 rounded-lg bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 text-[11px] font-semibold text-emerald-300 transition-all flex items-center justify-between group"
                    >
                      <span>{action.label}</span>
                      <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 w-20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form with Touch-Friendly Send Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask Claude 3.5 AI Copilot..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isTyping}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 rounded-lg font-bold transition-all min-w-[38px] flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
