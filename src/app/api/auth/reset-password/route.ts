import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Token and new password are required.' }, { status: 400 });
    }

    const res = store.resetPassword(token, newPassword);

    return NextResponse.json({
      success: true,
      message: res.message,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
