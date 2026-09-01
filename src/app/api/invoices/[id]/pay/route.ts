import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = store.simulatePayment(params.id, body.amount);

    return NextResponse.json({
      success: true,
      message: `Simulated payment processed successfully. Invoice is now marked as ${result.invoice.status}.`,
      data: result.invoice,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
