import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, companyName, password, plan } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required.' }, { status: 400 });
    }

    const { user, approvalToken } = store.registerUser({
      name,
      email,
      companyName: companyName || 'New Venture LLC',
      password,
      plan: plan || '$100/User',
    });

    const approvalUrl = `https://collectflow.io/api/auth/approve?token=${approvalToken}`;

    return NextResponse.json({
      success: true,
      message: 'Signup credentials stored in database! Your account is submitted for Admin Approval.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          status: user.status,
        },
        adminApprovalUrl: approvalUrl,
        adminNotice: `Approval request dispatched to Organization Admin (ramamkrishna.anandrk@gmail.com).`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
