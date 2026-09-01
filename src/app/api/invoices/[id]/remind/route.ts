import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = store.sendReminder(params.id, body.customNote);

    return NextResponse.json({
      success: true,
      message: `Reminder email successfully dispatched to ${result.invoice.customer?.email || 'customer'}.`,
      data: result.invoice,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
