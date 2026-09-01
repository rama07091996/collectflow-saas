'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { allUsers, switchUser } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = (userId: string, name: string, role: string) => {
    switchUser(userId);
    toast(`Authenticated as ${name} (${role})`, 'success');
    onClose();
    router.push('/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    toast('Authenticated successfully!', 'success');
    setIsLoading(false);
    onClose();
    router.push('/dashboard');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign in to CollectFlow"
      description="Access your automated collections dashboard and debtor accounts."
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Quick Demo Selector */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Instant Demo Sign In
            </span>
            <span className="text-[10px] text-slate-400">Click to switch:</span>
          </div>
          <div className="space-y-1.5">
            {allUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u.id, u.name, u.role)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-500">{u.role}</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[10px] font-bold uppercase text-slate-400">
            Or enter credentials
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@agency.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-xs"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-xs"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-xs py-2"
          >
            Log In
          </Button>
        </form>
      </div>
    </Modal>
  );
};
