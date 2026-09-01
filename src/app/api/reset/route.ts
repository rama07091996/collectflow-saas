import { NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export async function POST() {
  try {
    store.reset();
    return NextResponse.json({
      success: true,
      message: 'Demo state successfully reset to initial seed values.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
