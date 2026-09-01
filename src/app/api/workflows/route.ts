import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';
import { Workflow } from '@/lib/types';

export async function GET() {
  try {
    const workflow = store.getWorkflow();
    return NextResponse.json({ success: true, data: workflow });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Workflow = await request.json();
    const updated = store.updateWorkflow(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
