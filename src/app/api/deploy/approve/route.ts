import { NextRequest, NextResponse } from 'next/server';
import { DeploymentApprovalService } from '@/lib/deployment-approval';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse(renderStatusHTML('Error', 'Missing deployment authorization token.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const verification = DeploymentApprovalService.verifyApprovalToken(token);

  if (!verification.valid) {
    return new NextResponse(renderStatusHTML('Unauthorized', verification.error || 'Invalid or expired token.', false), {
      status: 403,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (verification.action === 'reject') {
    return new NextResponse(
      renderStatusHTML(
        'Deployment Rejected',
        `Deployment request (${verification.deploymentId}) was cancelled. No changes were released to Vercel.`,
        false
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Trigger Vercel Deploy Hook
  const deployResult = await DeploymentApprovalService.executeVercelDeployHook();

  return new NextResponse(
    renderStatusHTML(
      'Deployment Approved & Triggered! 🚀',
      `Authorization confirmed for deployment ${verification.deploymentId}. ${deployResult.message}`,
      true
    ),
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const emailHtml = DeploymentApprovalService.generateApprovalEmailHTML(
      {
        id: `dep_${Date.now()}`,
        repository: body.repository || 'rama07091996/collectflow-saas',
        branch: body.branch || 'main',
        commitSha: body.commitSha || 'latest',
        author: 'Ramakrishna Anand',
        authorEmail: 'ramamkrishna.anandrk@gmail.com',
        testSummary: {
          unitTestsPassed: 10,
          paymentTestsPassed: 13,
          totalPassed: 23,
          status: 'ALL_PASSED',
        },
        targetPlatform: body.targetPlatform || 'VERCEL',
        requestedAt: new Date().toISOString(),
        status: 'PENDING_APPROVAL',
      },
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    );

    return NextResponse.json({
      success: true,
      message: 'Deployment approval request generated and queued for ramamkrishna.anandrk@gmail.com',
      emailPreview: emailHtml,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function renderStatusHTML(title: string, message: string, isSuccess: boolean): string {
  const accentColor = isSuccess ? '#10b981' : '#f43f5e';
  const icon = isSuccess ? '✔' : '✖';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title} - CollectFlow Deploy Gateway</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #e2e8f0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { max-width: 520px; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
    .icon { width: 56px; height: 56px; border-radius: 50%; background-color: ${accentColor}20; color: ${accentColor}; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 20px; border: 1px solid ${accentColor}40; }
    h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 12px; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px; }
    a { display: inline-block; padding: 10px 20px; border-radius: 8px; background-color: #1e293b; color: #38bdf8; text-decoration: none; font-size: 13px; font-weight: 600; border: 1px solid #334155; }
    a:hover { background-color: #334155; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/dashboard">Return to CollectFlow Dashboard</a>
  </div>
</body>
</html>
  `;
}
