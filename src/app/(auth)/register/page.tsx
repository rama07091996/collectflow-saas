'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  TrendingUp,
  Mail,
  Lock,
  Building2,
  User,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    toast('Organization account created! Launching your 14-day trial...', 'success');
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            CollectFlow <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">B2B</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Start your 14-day free trial
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          No credit card required • Instant automated cadence setup
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-950/80 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4 text-slate-500" />}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
              required
            />

            <Input
              label="Agency / Company Name"
              placeholder="Apex Growth Media"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4 text-slate-500" />}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
              required
            />

            <Input
              label="Work Email Address"
              type="email"
              placeholder="sarah@apexmedia.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
              required
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
              required
            />

            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Full access to 5-step automated AR cadence</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Stripe & QuickBooks 2-way sync enabled</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 shadow-lg shadow-emerald-500/20"
            >
              Launch Free Trial Workspace
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
