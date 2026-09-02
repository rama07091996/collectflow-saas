import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const { token, resetUrl } = store.createPasswordResetToken(email);

    return NextResponse.json({
      success: true,
      message: `Password reset email dispatched to ${email}! (Valid for 1 hour)`,
      resetUrl,
      emailPreview: `
Dear User,

We received a request to reset your CollectFlow account password.

Click the link below to set your new password:
👉 ${resetUrl}

If you did not request this, you can safely ignore this message.

CollectFlow Security Team
      `,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
