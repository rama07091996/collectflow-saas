'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { JWTAuthService } from '@/lib/jwt-auth';
import { ShieldCheck, KeyRound, Copy } from 'lucide-react';
import { WidgetTabProps } from '../types';

export function SecurityJWTTab({}: WidgetTabProps) {
  const { currentUser, twoFactorConfig } = useAuth();
  const { toast } = useToast();
  const [quickJwtToken, setQuickJwtToken] = useState('');

  const handleGenerateQuickJWT = () => {
    const token = JWTAuthService.generatePaymentAuthToken({
      invoiceId: 'inv_01',
      invoiceNumber: 'INV-2024-001',
      amount: 4200.0,
      customerId: currentUser.id,
      authorizedBy: currentUser.name,
      role: currentUser.role,
    });
    setQuickJwtToken(token);
    navigator.clipboard.writeText(token);
    toast('HMAC-SHA256 JWT Token generated & copied to clipboard.', 'success');
  };

  return (
    <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="font-bold text-white text-xs">2FA Protection Active</div>
            <div className="text-[10px] text-slate-400">TOTP Authenticator & SMS OTP</div>
          </div>
        </div>
        <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
          SECURED
        </span>
      </div>

      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-white flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-purple-400" />
          <span>Payment JWT Token Generator</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Issue HMAC-SHA256 signed payment token for high-value payouts.
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateQuickJWT}
          leftIcon={<Copy className="w-3 h-3" />}
          className="w-full text-xs font-semibold"
        >
          Sign & Copy Payment JWT
        </Button>

        {quickJwtToken && (
          <div className="p-2 bg-slate-950 rounded text-[9px] font-mono text-purple-300 break-all select-all border border-slate-800">
            {quickJwtToken}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
        <div className="text-xs font-bold text-slate-300">Active Backup Recovery Code:</div>
        <code className="text-xs text-emerald-400 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800 block text-center font-bold tracking-wider">
          {twoFactorConfig.backupCodes[0]}
        </code>
      </div>
    </div>
  );
}
