'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  TrendingUp,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { allUsers, switchUser } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    toast('Welcome back! Logging into CollectFlow workspace...', 'success');
    setIsLoading(false);
    router.push('/dashboard');
  };

  const handleQuickDemoLogin = (userId: string, name: string, role: string) => {
    switchUser(userId);
    toast(`Authenticated as ${name} (${role})`, 'success');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
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
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Autonomous Accounts Receivable & Recovery Engine
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-950/80 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10 space-y-6">
          {/* Quick 1-Click Demo Accounts Switcher */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Instant Demo Login
              </span>
              <span className="text-[10px] text-slate-400">Select Role:</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(u.id, u.name, u.role)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-4 text-[11px] font-semibold uppercase text-slate-500">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Email / Password Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Work Email Address"
              type="email"
              placeholder="you@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-slate-500" />}
              className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-emerald-400 hover:text-emerald-300">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 shadow-lg shadow-emerald-500/20"
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(allUsers[0].id, allUsers[0].name, allUsers[0].role)}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google SSO</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(allUsers[1].id, allUsers[1].name, allUsers[1].role)}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Don't have an organization account?{' '}
            <Link href="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Start 14-day free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
