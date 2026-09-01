'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/mock-auth';
import { useToast } from '@/components/ui/Toast';
import { JWTAuthService } from '@/lib/jwt-auth';
import {
  Settings,
  Building2,
  Bell,
  Shield,
  Save,
  Check,
  KeyRound,
  Smartphone,
  Mail,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Download,
  Copy,
  LogOut,
  Lock,
  QrCode,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const { currentOrg, currentUser, twoFactorConfig, update2FA, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'jwt'>('security');

  // Org Settings
  const [orgName, setOrgName] = useState(currentOrg.name);
  const [currency, setCurrency] = useState(currentOrg.currency);
  const [lateFeePercent, setLateFeePercent] = useState('1.5');
  const [gracePeriodDays, setGracePeriodDays] = useState('3');
  const [isSaving, setIsSaving] = useState(false);

  // JWT Token Tester State
  const [testInvoiceId, setTestInvoiceId] = useState('inv_01');
  const [testAmount, setTestAmount] = useState('4200.00');
  const [generatedJWT, setGeneratedJWT] = useState('');
  const [jwtVerificationResult, setJwtVerificationResult] = useState<any>(null);

  // TOTP QR Modal state
  const [showQRModal, setShowQRModal] = useState(false);

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast('Organization settings saved successfully.', 'success');
    setIsSaving(false);
  };

  const handleRegenerateBackupCodes = () => {
    const newCodes = JWTAuthService.generateBackupCodes();
    update2FA({ backupCodes: newCodes });
    toast('New emergency backup recovery codes generated.', 'success');
  };

  const handleDownloadBackupCodes = () => {
    const content = `CollectFlow Enterprise - 2FA Emergency Backup Codes\nUser: ${currentUser.name} (${currentUser.email})\nGenerated: ${new Date().toISOString()}\n\n` +
      twoFactorConfig.backupCodes.map((c, i) => `${i + 1}. ${c}`).join('\n') +
      `\n\nKeep these codes safe. Each code can be used once to access your account if your 2FA device is lost.`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collectflow-backup-codes-${currentUser.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Backup codes downloaded as text file.', 'success');
  };

  const handleGenerateJWT = () => {
    const token = JWTAuthService.generatePaymentAuthToken({
      invoiceId: testInvoiceId,
      invoiceNumber: 'INV-2024-001',
      amount: parseFloat(testAmount) || 1000,
      customerId: currentUser.id,
      authorizedBy: currentUser.name,
      role: currentUser.role,
    });
    setGeneratedJWT(token);
    const verification = JWTAuthService.verifyPaymentAuthToken(token);
    setJwtVerificationResult(verification);
    toast('Cryptographic JWT Payment Token signed with HMAC-SHA256.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings & Security</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your workspace configuration, multi-factor authentication, and payment JWT tokens.
          </p>
        </div>

        {/* Global Log Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            toast('Logging out...', 'info');
            logout();
          }}
          leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
          className="text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
        >
          Log Out of Session
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'security'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>2FA & Multi-Factor Security</span>
        </button>

        <button
          onClick={() => setActiveTab('jwt')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'jwt'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Payment JWT & Auth Tokens</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Organization Profile & Policies</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: 2FA & MULTI-FACTOR SECURITY                            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* 2FA Master Status Card */}
          <Card className="p-6 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Multi-Factor Authentication (2FA) is Active</h3>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      SECURED
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Your account requires both your password and a secondary security factor (Authenticator App, SMS, or Backup Code) to log in.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQRModal(true)}
                leftIcon={<QrCode className="w-3.5 h-3.5" />}
                className="text-xs font-semibold shrink-0"
              >
                View TOTP Setup QR
              </Button>
            </div>
          </Card>

          {/* 2FA Methods List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Method 1: Authenticator App */}
            <Card className="p-5 space-y-3 border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    RECOMMENDED
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">Authenticator App (TOTP)</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Google Authenticator, Authy, or 1Password generating dynamic 6-digit codes.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                </span>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="text-xs text-slate-600 hover:text-emerald-600 font-medium underline"
                >
                  Configure
                </button>
              </div>
            </Card>

            {/* Method 2: SMS Verification */}
            <Card className="p-5 space-y-3 border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">SMS Phone Verification</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  One-time passcodes sent via SMS to +1 •••• •••• {twoFactorConfig.phoneLast4}.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                </span>
                <button
                  onClick={() => toast('Phone number updated for SMS OTP.', 'success')}
                  className="text-xs text-slate-600 hover:text-emerald-600 font-medium underline"
                >
                  Edit Number
                </button>
              </div>
            </Card>

            {/* Method 3: Email Backup Codes */}
            <Card className="p-5 space-y-3 border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Email Security Codes</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Secondary challenge dispatch to {twoFactorConfig.emailMasked}.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                </span>
                <button
                  onClick={() => toast('Backup email synced.', 'success')}
                  className="text-xs text-slate-600 hover:text-emerald-600 font-medium underline"
                >
                  Manage
                </button>
              </div>
            </Card>
          </div>

          {/* Emergency Backup Recovery Codes */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Emergency Backup Recovery Codes</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save these 8 one-time recovery codes to access your account if you ever lose your phone or authenticator app.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateBackupCodes}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadBackupCodes}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Download .TXT
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              {twoFactorConfig.backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="p-2 rounded bg-white border border-slate-200 text-center font-mono text-xs font-bold text-slate-800 tracking-wider flex items-center justify-between group hover:border-emerald-300 transition-colors"
                >
                  <span className="text-slate-400 text-[10px]">{index + 1}.</span>
                  <span>{code}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                      toast(`Copied code ${code}`, 'success');
                    }}
                    className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy code"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Sessions & Security Devices */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-slate-600" />
              <span>Active Signed-In Devices</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Authorized hardware tokens and current active web sessions.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    💻
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      Windows 11 PC • Chrome (Current Device)
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        THIS DEVICE
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      IP: 127.0.0.1 • Location: Localhost • Active now
                    </div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: PAYMENT JWT & AUTHENTICATION TOKENS                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'jwt' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Cryptographic Payment Authorization Token Engine</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              CollectFlow issues cryptographically signed HMAC-SHA256 JWT tokens to authorize high-value dunning actions, bank transfers, and Stripe settlements.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Target Invoice ID"
                value={testInvoiceId}
                onChange={(e) => setTestInvoiceId(e.target.value)}
                className="text-xs font-mono"
              />
              <Input
                label="Authorization Amount ($ USD)"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleGenerateJWT}
              leftIcon={<Lock className="w-3.5 h-3.5" />}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
            >
              Sign & Generate JWT Payment Token
            </Button>

            {generatedJWT && (
              <div className="mt-5 space-y-3 pt-5 border-t border-slate-200 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Signed JWT Token (HS256):
                  </label>
                  <div className="p-3 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs break-all select-all border border-slate-800">
                    {generatedJWT}
                  </div>
                </div>

                {jwtVerificationResult && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>HMAC-SHA256 Signature Validated (15-Minute Expiry)</span>
                    </div>
                    <pre className="text-[11px] font-mono text-slate-700 bg-white p-3 rounded border border-slate-200 overflow-x-auto">
                      {JSON.stringify(jwtVerificationResult.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: ORGANIZATION PROFILE & POLICIES                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveOrg} className="space-y-6 animate-in fade-in duration-150">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span>Organization Profile</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              This name appears on client payment portals and automated email headers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Legal / Trading Name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="text-xs font-medium"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Late Fee & Escalation Policies</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Configure automated late penalty calculations and grace period allowances.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Grace Period (Days Before Reminder)"
                type="number"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(e.target.value)}
                className="text-xs"
              />
              <Input
                label="Monthly Late Fee Interest Rate (%)"
                type="number"
                step="0.1"
                value={lateFeePercent}
                onChange={(e) => setLateFeePercent(e.target.value)}
                className="text-xs"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
            >
              Save Preferences
            </Button>
          </div>
        </form>
      )}

      {/* TOTP Setup QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Configure Authenticator App</span>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="w-44 h-44 mx-auto bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center p-2">
                {/* Visual Authenticator QR Representation */}
                <div className="w-full h-full bg-white p-2 rounded flex flex-col items-center justify-center border border-slate-300 space-y-1">
                  <div className="grid grid-cols-6 gap-1 w-28 h-28 p-1 bg-slate-900 rounded">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${
                          i % 2 === 0 || i % 7 === 0 ? 'bg-white' : 'bg-slate-900'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 font-bold">CollectFlow Authenticator</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-600">
                  Scan this QR code with Google Authenticator or enter manual secret key:
                </p>
                <div className="p-2 rounded bg-slate-100 font-mono text-xs font-bold text-slate-900 select-all border border-slate-200">
                  {twoFactorConfig.secretKey}
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setShowQRModal(false);
                toast('Authenticator app configuration verified.', 'success');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
            >
              Done & Verified
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
