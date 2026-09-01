import { NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export async function GET() {
  try {
    const metrics = store.getDashboardMetrics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
