'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  DollarSign,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  Building2,
  ChevronRight,
} from 'lucide-react';

const SCENES = [
  {
    id: 1,
    title: '1. Autonomous US Ledger Ingestion & Risk Scoring',
    subtitle: 'Real-time sync with QuickBooks, Stripe & Xero subledgers',
    badge: 'AR Ingestion',
    duration: 4500,
    accent: 'from-emerald-500 to-teal-600',
    content: {
      heading: 'US Market Receivables Breakdown',
      metrics: [
        { label: 'Total Invoiced', value: '$348,200', change: '+18.4%' },
        { label: 'Total At-Risk Overdue', value: '$77,850', change: '3 Accounts' },
        { label: 'Average Days to Pay (DSO)', value: '21.4 Days', change: '-14 Days' },
      ],
      highlight: 'AI continuously monitors 15 US debtor companies, detecting late payment anomalies.',
    },
  },
  {
    id: 2,
    title: '2. 5-Step Tone-Calibrated Automated Dunning Cadence',
    subtitle: 'Personalized email & SMS follow-ups dispatched before, on, and after due date',
    badge: 'Dunning Engine',
    duration: 5000,
    accent: 'from-amber-500 to-orange-600',
    content: {
      heading: 'Multi-Channel Cadence Sequence',
      steps: [
        { day: 'Day -3', action: 'Courtesy Due Date Reminder (Email)' },
        { day: 'Due Date', action: '1-Click Stripe Payment Link Dispatched' },
        { day: 'Day +7', action: 'Friendly Overdue Nudge' },
        { day: 'Day +14', action: '1.5% Late Assessment Fee Notice' },
        { day: 'Day +30', action: 'Executive Escalation & Demand Letter' },
      ],
      highlight: 'Cadence automatically pauses if debtor logs a legitimate milestone dispute.',
    },
  },
  {
    id: 3,
    title: '3. Stripe 1-Click ACH & Credit Card Instant Settlement',
    subtitle: 'Debtors settle invoices directly with zero login friction',
    badge: 'FinTech Checkout',
    duration: 4500,
    accent: 'from-blue-500 to-indigo-600',
    content: {
      heading: 'Stripe Enterprise Payment Gateway',
      details: [
        '✔ Supports US ACH Direct Debit, Visa, Mastercard, AMEX & Apple Pay',
        '✔ Real-time webhook reconciliation with HMAC-SHA256 signature verification',
        '✔ Cryptographic Payment JWT authorization tokens for high-value transfers',
      ],
      highlight: 'Accelerates cash collection velocity by 2.4x across US enterprise accounts.',
    },
  },
  {
    id: 4,
    title: '4. Free Claude 3.5 Sonnet Autonomous Financial Copilot',
    subtitle: 'Natural language delinquency audits, custom dunning letters, & cashflow forecasts',
    badge: 'Claude 3.5 AI',
    duration: 5000,
    accent: 'from-purple-500 to-pink-600',
    content: {
      heading: 'Claude 3.5 Sonnet Financial Intelligence',
      aiQuery: 'Prompt: "Who owes us the most money and draft a firm 30-day notice?"',
      aiReply: '🤖 Claude: Apex Logistics LLC ($18,500 overdue). Drafted executive dunning notice with 94.2% recovery probability.',
      highlight: 'Powered by Anthropic Claude 3.5 Sonnet & Claude Haiku with zero API cost.',
    },
  },
  {
    id: 5,
    title: '5. Transparent US Pricing & Gated Admin Security',
    subtitle: 'Per-user flexibility or unlimited enterprise organization licensing',
    badge: 'US Pricing',
    duration: 5000,
    accent: 'from-emerald-500 to-amber-500',
    content: {
      heading: 'Choose Your Plan Tier',
      plans: [
        { name: 'Professional Plan', price: '$100 / User / Month', desc: 'For growing finance teams & controllers' },
        { name: 'Enterprise Organization', price: '$999 / Org / Month', desc: 'Unlimited team seats & Claude 3.5 Copilot' },
      ],
      highlight: 'Includes 2FA Multi-Factor TOTP, Gated CI/CD Deployments, and 1-Click Admin Approvals.',
    },
  },
];

export function AIVideoShowcase() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const scene = SCENES[currentSceneIdx];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSceneIdx((s) => (s + 1) % SCENES.length);
            return 0;
          }
          return prev + (100 / (scene.duration / 100));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scene.duration]);

  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive AI Video Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How CollectFlow Automates US Accounts Receivable
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Watch our automated platform walkthrough showcasing autonomous dunning, Claude 3.5 AI, and Stripe settlement.
          </p>
        </div>

        {/* Video Frame Player */}
        <div className="max-w-4xl mx-auto bg-slate-900 border-2 border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Top Video Header Bar */}
          <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 font-mono ml-2">collectflow-us-platform.mp4</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                {scene.badge}
              </span>
            </div>
          </div>

          {/* Video Screen Content */}
          <div className="p-6 sm:p-10 min-h-[360px] bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-between relative">
            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Scene {scene.id} of {SCENES.length}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{scene.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">{scene.subtitle}</p>
              </div>

              {/* Dynamic Scene Visuals */}
              {scene.id === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-300">
                  {scene.content.metrics?.map((m, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-[11px] text-slate-400 font-medium">{m.label}</div>
                      <div className="text-xl font-bold text-white">{m.value}</div>
                      <div className="text-[10px] text-emerald-400 font-bold">{m.change}</div>
                    </div>
                  ))}
                </div>
              )}

              {scene.id === 2 && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  {scene.content.steps?.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
                      <span className="font-mono text-emerald-400 font-bold">{step.day}</span>
                      <span className="text-slate-300">{step.action}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  ))}
                </div>
              )}

              {scene.id === 3 && (
                <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-2.5 animate-in fade-in duration-300">
                  {scene.content.details?.map((detail, idx) => (
                    <div key={idx} className="text-xs text-slate-300 font-medium">
                      {detail}
                    </div>
                  ))}
                </div>
              )}

              {scene.id === 4 && (
                <div className="p-4 bg-slate-950/90 rounded-2xl border border-purple-500/30 space-y-2.5 animate-in fade-in duration-300">
                  <div className="text-xs text-slate-400 font-mono">{scene.content.aiQuery}</div>
                  <div className="text-xs text-purple-300 font-semibold p-2.5 bg-purple-950/40 rounded-xl border border-purple-500/20">
                    {scene.content.aiReply}
                  </div>
                </div>
              )}

              {scene.id === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-300">
                  {scene.content.plans?.map((plan, idx) => (
                    <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-xs font-bold text-emerald-400">{plan.name}</div>
                      <div className="text-lg font-black text-white">{plan.price}</div>
                      <div className="text-[11px] text-slate-400">{plan.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{scene.content.highlight}</span>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold transition-all shadow-md shadow-emerald-500/30"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
                </button>
                <button
                  onClick={() => {
                    setCurrentSceneIdx(0);
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs flex items-center gap-1"
                  title="Replay from start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Replay</span>
                </button>
              </div>

              {/* Scene Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {SCENES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setProgress(0);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSceneIdx
                        ? 'w-6 bg-emerald-400'
                        : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Animated Progress Timeline Bar */}
          <div className="w-full bg-slate-800 h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
