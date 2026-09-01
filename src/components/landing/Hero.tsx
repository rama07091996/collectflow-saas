import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  DollarSign,
} from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 border-b border-slate-200">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-100/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Autonomous AR & Cashflow Acceleration Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
            Get Paid <span className="text-emerald-600 underline decoration-emerald-300 underline-offset-8">14 Days Faster</span> Without Awkward Client Emails.
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Connect QuickBooks or Stripe in 60 seconds. CollectFlow automatically tracks overdue accounts, dispatches tone-calibrated reminders, and embeds 1-click instant payment links.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 font-bold px-8 py-3.5 shadow-lg shadow-emerald-600/25"
              >
                Start 14-Day Free Trial
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold px-7 py-3.5"
              >
                Explore Live Demo Sandbox
              </Button>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero setup fees</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Connects to Stripe & QuickBooks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SOC2 Type II & Bank-grade security</span>
            </div>
          </div>
        </div>

        {/* Product UI Interactive Mock Showcase */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-slate-900 p-2 sm:p-4 shadow-2xl border border-slate-800">
          <div className="rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden">
            {/* Window header */}
            <div className="h-10 bg-slate-900/90 px-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                collectflow.io/app/dashboard
              </span>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Demo</span>
              </div>
            </div>

            {/* Mock Dashboard Preview Body */}
            <div className="p-6 bg-slate-900 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/60">
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Overdue Recovered</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">$96,200.00</div>
                <div className="text-xs text-emerald-500 font-medium mt-1">+22.4% cash acceleration</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/60">
                <div className="text-xs text-slate-400 font-semibold uppercase">Average Days to Pay</div>
                <div className="text-2xl font-bold text-white mt-1">21.4 Days</div>
                <div className="text-xs text-slate-400 mt-1">Down from 38 days baseline</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/60">
                <div className="text-xs text-slate-400 font-semibold uppercase">Active Follow-Up Cadence</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">5-Step Sequence</div>
                <div className="text-xs text-indigo-300 mt-1">Smart Tone Escalation Engine</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
