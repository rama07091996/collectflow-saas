import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return new NextResponse(renderApprovalHTML('Error', 'Missing authorization approval token.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    if (payload.exp < Date.now()) {
      return new NextResponse(renderApprovalHTML('Expired', 'This approval link has expired.', false), {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const { user } = store.approveUser(payload.userId);

    return new NextResponse(
      renderApprovalHTML(
        'User Approved! 🎉',
        `Account for <strong>${user.name}</strong> (${user.email}) under plan <strong>${user.plan}</strong> is now APPROVED and active.`,
        true
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (err: any) {
    return new NextResponse(renderApprovalHTML('Approval Error', err.message || 'Invalid token.', false), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function renderApprovalHTML(title: string, message: string, isSuccess: boolean): string {
  const accentColor = isSuccess ? '#10b981' : '#f43f5e';
  const icon = isSuccess ? '✔' : '✖';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title} - CollectFlow Admin Portal</title>
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
    <a href="/login">Proceed to Login Portal</a>
  </div>
</body>
</html>
  `;
}
