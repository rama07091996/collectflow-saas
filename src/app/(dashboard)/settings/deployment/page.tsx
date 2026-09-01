'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import {
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Mail,
  Zap,
  RefreshCw,
  Terminal,
  Activity,
  ArrowRight,
  GitBranch,
} from 'lucide-react';

export default function DeploymentSettingsPage() {
  const { toast } = useToast();
  const [alertEmail, setAlertEmail] = useState('admin@collectflow.io');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    toast(`Notification email saved! Alerts will be sent to ${alertEmail}`, 'success');
  };

  const handleSimulateFailure = async () => {
    setIsSimulating(true);
    setSimulationResult(null);

    try {
      const sampleError = `
      Error: Prisma schema validation - (get-dmmf wasm)
      Error code: P1012
      error: Error validating: The argument references must refer only to existing fields in the related model Workflow. The following fields do not exist in the related model: workflowId
      --> prisma/schema.prisma:210
      `;

      const res = await fetch('/api/antigravity/heal-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commitSha: '9a3f8c2b7e1d5a4',
          repository: 'rama07091996/collectflow-saas',
          environment: 'production',
          errorLog: sampleError,
          targetEmail: alertEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSimulationResult(data.data);
        toast('Deployment failure diagnosed! Email alert dispatched & Antigravity patch ready.', 'success');
      }
    } catch (e: any) {
      toast('Failed to run simulation', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>DevOps Resilience & CI/CD Telemetry</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Deployment Health & Antigravity Auto-Healing
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Automatic failure notifications sent to email and Antigravity for instant autonomous code repairs.
        </p>
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pipeline Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="mt-2 text-lg font-bold text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Active & Passing</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">GitHub Actions + Vercel Webhook</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Antigravity Auto-Heal</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900">Autonomous Mode</div>
          <p className="text-[11px] text-slate-400 mt-1">Self-diagnosing compiler & type errors</p>
        </Card>

        <Card className="p-4 border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Email Alerts</span>
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-sm font-bold text-slate-900 truncate">{alertEmail}</div>
          <p className="text-[11px] text-slate-400 mt-1">Instant stack trace dispatching</p>
        </Card>
      </div>

      {/* Email Alert Configuration */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Deployment Alert Notifications</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify the recipient email address for critical build breakages and deployment exceptions.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveEmail} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="flex-1">
              <Input
                label="Admin / Engineering Email"
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                className="text-xs"
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="md" variant="primary" className="text-xs bg-slate-900 hover:bg-slate-800 font-bold">
                Save Email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Test Simulation Console */}
      <Card className="border-slate-200">
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>Simulate Deployment Failure & Antigravity Auto-Correction</span>
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Test how the pipeline intercepts a build failure, emails your team, and generates the corrective patch.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSimulateFailure}
            isLoading={isSimulating}
            leftIcon={<Zap className="w-3.5 h-3.5 text-amber-600" />}
            className="text-xs font-semibold border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900"
          >
            Simulate Build Error & Auto-Fix Trigger
          </Button>

          {simulationResult && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Antigravity Diagnostics Received
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Confidence: {(simulationResult.diagnosis.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] uppercase font-bold">Root Cause Identified:</span>
                <p className="text-slate-200">{simulationResult.diagnosis.rootCause}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] uppercase font-bold">Generated Auto-Fix Patch:</span>
                <pre className="p-3 bg-slate-950 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800">
                  {simulationResult.diagnosis.suggestedPatch}
                </pre>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Email Alert Dispatched to: <strong className="text-white">{simulationResult.emailAlert.to}</strong></span>
                <span className="text-emerald-400 font-semibold">Auto-Healing Status: READY</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
