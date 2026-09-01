'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
            CollectFlow <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">B2B</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#calculator" className="hover:text-slate-900 transition-colors">
            ROI Calculator
          </a>
          <a href="#testimonials" className="hover:text-slate-900 transition-colors">
            Case Studies
          </a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Log In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-300 hidden sm:inline-flex"
            >
              Live Demo App
            </Button>
          </Link>
          <Link href="/register">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
