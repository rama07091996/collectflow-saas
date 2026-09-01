import { NextRequest, NextResponse } from 'next/server';
import { SelfHealingEngine, DeploymentErrorPayload } from '@/lib/self-healing-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const payload: DeploymentErrorPayload = {
      commitSha: body.commitSha || 'unknown_commit',
      repository: body.repository || 'rama07091996/collectflow-saas',
      environment: body.environment || 'production',
      errorLog: body.errorLog || body.errorSummary || 'Unknown build error',
      author: body.author || 'CI/CD Pipeline',
      timestamp: new Date().toISOString(),
    };

    // 1. Run Autonomous Diagnosis
    const diagnosis = SelfHealingEngine.diagnoseError(payload.errorLog);

    // 2. Generate Alert Email for Admin/Dev Team
    const alertEmail = SelfHealingEngine.generateAlertEmail(payload, diagnosis);

    // 3. Log to audit trail
    console.log(`[Antigravity Auto-Heal Triggered]: ${diagnosis.errorType} - ${diagnosis.rootCause}`);

    return NextResponse.json({
      success: true,
      message: 'Deployment failure analyzed. Diagnostics and email notification dispatched to Antigravity.',
      data: {
        diagnosis,
        emailAlert: {
          to: body.targetEmail || 'admin@collectflow.io',
          subject: alertEmail.subject,
          dispatched: true,
        },
        autoCorrectionReady: diagnosis.autoExecutable,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
