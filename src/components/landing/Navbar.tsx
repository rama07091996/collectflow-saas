'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Sparkles, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  return (
    <div className="sticky top-0 z-50">
      {/* Top Banner: Signup & Pricing Announcement */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>
          <strong>New US Pricing:</strong> $100/User & $999/Org Enterprise Plans.
        </span>
        <Link
          href="/register"
          className="underline font-bold text-amber-300 hover:text-white inline-flex items-center gap-1 ml-1.5"
        >
          <span>Sign Up Free Now</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
              CollectFlow <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">HTTPS</span>
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">
              ROI Calculator
            </a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">
              Pricing ($100/User)
            </a>
            <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
              Case Studies
            </a>
          </nav>

          {/* Action CTAs - SIGN UP AT THE TOP */}
          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-850"
              >
                Sign In
              </Button>
            </Link>

            <Link href="/dashboard" className="hidden sm:inline-block">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold text-slate-300 hover:text-white border-slate-700 bg-slate-900 hover:bg-slate-800"
              >
                Live Demo
              </Button>
            </Link>

            {/* Prominent High-Visibility Signup Button at the top */}
            <Link href="/register">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30 py-2 px-3.5"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
