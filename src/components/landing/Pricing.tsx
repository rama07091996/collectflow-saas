'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Sparkles, Building2, User, ArrowRight, ShieldCheck } from 'lucide-react';

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-slate-900/60 border-t border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent US Enterprise Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple, Scalable B2B Accounts Receivable Plans
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            Accelerate overdue invoice recovery with autonomous Claude 3.5 AI dunning sequences, Stripe 1-click ACH, and 2FA multi-factor security.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1: $100 / User / Month */}
          <div className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-2xl relative group">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Per-Seat License
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Professional User</h3>
                <p className="text-xs text-slate-400 mt-1">For growing finance teams, controllers, and specialists.</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white">$100</span>
                <span className="text-sm font-semibold text-slate-400">/ User / Month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5-Step Autonomous Tone-Calibrated AR Cadence</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Stripe 1-Click ACH & Credit Card Payment Links</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2FA Multi-Factor TOTP & Backup Recovery Codes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>QuickBooks & Xero 2-Way Sync Engine</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-6">
              <Link
                href="/register"
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all group-hover:bg-emerald-600 group-hover:text-slate-950"
              >
                <span>Get Started with $100/User</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Plan 2: $999 / Organization / Month */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/80 transition-all flex flex-col justify-between shadow-2xl relative group">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wide uppercase shadow-md">
              Most Popular Enterprise
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Unlimited Organization
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Full Enterprise Organization</h3>
                <p className="text-xs text-slate-400 mt-1">Unlimited team seats, custom dunning, & Claude 3.5 Copilot.</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-white">$999</span>
                <span className="text-sm font-semibold text-slate-400">/ Organization / Month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Unlimited Team Users & Controllers Included</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Free Claude 3.5 Sonnet Autonomous AR Engine</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>HMAC-SHA256 Cryptographic Payment JWT Tokens</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gated CI/CD Deployment with Email Tokens</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority 24/7 US Engineering & Treasury Support</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-6">
              <Link
                href="/register"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
              >
                <span>Launch $999/Org Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
