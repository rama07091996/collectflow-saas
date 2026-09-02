'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TrendingUp, Mail, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('ramamkrishna.anandrk@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [resetData, setResetData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        toast('Password reset link generated and dispatched!', 'success');
        setResetData(data);
      } else {
        throw new Error(data.error || 'Failed to dispatch reset email');
      }
    } catch (err: any) {
      toast(err.message || 'Error requesting password reset', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            CollectFlow <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">Security</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your registered account email to receive a secure 1-hour reset token
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-950/90 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10 space-y-5">
          {!resetData ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Account Email Address"
                type="email"
                placeholder="ramamkrishna.anandrk@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-500" />}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                leftIcon={<KeyRound className="w-4 h-4" />}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2.5 shadow-lg shadow-emerald-500/20"
              >
                Send Password Reset Email
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Email Dispatched!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  A cryptographic reset link valid for <strong>1 hour</strong> has been sent to <strong>{email}</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs space-y-1.5">
                <span className="text-[10px] text-slate-500 block">Click link below to proceed:</span>
                <a
                  href={resetData.resetUrl}
                  className="text-xs text-emerald-400 hover:underline font-mono break-all block"
                >
                  {resetData.resetUrl}
                </a>
              </div>
            </div>
          )}

          <div className="text-center pt-2 border-t border-slate-800">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
