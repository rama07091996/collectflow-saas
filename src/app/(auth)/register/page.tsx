'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  TrendingUp,
  Mail,
  Lock,
  Building2,
  User,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Check,
  CreditCard,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function RegisterPage() {
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'$100/User' | '$999/Organization'>('$100/User');
  const [payNowWithStripe, setPayNowWithStripe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [approvalInfo, setApprovalInfo] = useState<any>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Register user credentials in database
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          companyName,
          email,
          password,
          plan: selectedPlan,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit registration');
      }

      // 2. If user chose Pay Now via Stripe, process checkout & store payment in MongoDB
      if (payNowWithStripe) {
        const payRes = await fetch('/api/payments/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'SIGNUP_PLAN',
            plan: selectedPlan,
            userEmail: email,
            userName: fullName,
            paymentMethod: 'STRIPE_CHECKOUT',
          }),
        });

        const payData = await payRes.json();
        if (payData.success) {
          setPaymentReceipt(payData.data);
          toast(`Payment of $${payData.data.amount} USD processed and saved to MongoDB!`, 'success');
        }
      }

      toast('Registration and credentials stored in DB!', 'success');
      setApprovalInfo(data.data);
      setIsSubmitted(true);
    } catch (err: any) {
      toast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const planPrice = selectedPlan === '$999/Organization' ? 999 : 100;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-2xl text-white tracking-tight">
            CollectFlow <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">US</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Create Your Workspace Account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Integrated with Stripe Gateway & MongoDB Cloud Database
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-950/90 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10 space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Plan Selection Tier Cards ($100/User vs $999/Organization) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Subscription Plan Tier:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedPlan('$100/User')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === '$100/User'
                        ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">Per-User Plan</span>
                      {selectedPlan === '$100/User' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-lg font-black text-white mt-1">$100<span className="text-[10px] font-normal text-slate-400">/User/mo</span></div>
                    <div className="text-[10px] text-slate-400 mt-1">Autonomous dunning & live dashboard</div>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('$999/Organization')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPlan === '$999/Organization'
                        ? 'bg-emerald-950/50 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">Enterprise Plan</span>
                      {selectedPlan === '$999/Organization' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-lg font-black text-white mt-1">$999<span className="text-[10px] font-normal text-slate-400">/Org/mo</span></div>
                    <div className="text-[10px] text-slate-400 mt-1">Unlimited team seats & Claude 3.5 Copilot</div>
                  </div>
                </div>
              </div>

              <Input
                label="Full Name"
                placeholder="Ramakrishna Anand"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-slate-500" />}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
                required
              />

              <Input
                label="Agency / Organization Name"
                placeholder="CollectFlow Enterprise US"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Building2 className="w-4 h-4 text-slate-500" />}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-xs"
                required
              />

              <Input
                label="Work Email Address"
                type="email"
                placeholder="user@enterprise.com"
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

              {/* Payment Gateway Activation Option */}
              <div className="p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-500/30 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={payNowWithStripe}
                    onChange={(e) => setPayNowWithStripe(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Activate & Pay via Stripe Gateway (${planPrice} USD)</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Process payment via Stripe Card/ACH checkout and save transaction record to MongoDB.
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin-Gated Security & MongoDB Storage</span>
                </div>
                <p className="text-slate-400">
                  All accounts and payment receipts are stored securely in MongoDB and verified before access.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                leftIcon={payNowWithStripe ? <CreditCard className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 shadow-lg shadow-emerald-500/20"
              >
                {payNowWithStripe ? `Pay $${planPrice} & Complete Registration` : 'Submit Registration for Free Trial'}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Registration & Payment Complete!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Your account for <strong className="text-emerald-400">{email}</strong> and payment details have been saved in MongoDB.
                </p>
              </div>

              {/* Payment Receipt Banner if Paid */}
              {paymentReceipt && (
                <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-left text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Stripe Payment Confirmed</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">${paymentReceipt.amount} USD</span>
                  </div>
                  <div className="text-[10px] text-slate-400 space-y-0.5">
                    <div>Payment Intent: <code className="text-slate-300">{paymentReceipt.paymentIntentId}</code></div>
                    <div>Database: <span className="text-emerald-400 font-semibold">{paymentReceipt.database}</span></div>
                  </div>
                </div>
              )}

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs space-y-2">
                <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Activation Notice:</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  An activation notice was dispatched to Admin (<code>ramamkrishna.anandrk@gmail.com</code>).
                </p>

                {approvalInfo?.adminApprovalUrl && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-1">Instant 1-Click Admin Approval Link:</span>
                    <a
                      href={approvalInfo.adminApprovalUrl}
                      className="text-[11px] text-emerald-400 hover:underline font-mono break-all"
                    >
                      {approvalInfo.adminApprovalUrl}
                    </a>
                  </div>
                )}
              </div>

              <Link
                href="/login"
                className="inline-block w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Return to Sign In Portal
              </Link>
            </div>
          )}

          <p className="text-center text-xs text-slate-400">
            Already have an active account?{' '}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
