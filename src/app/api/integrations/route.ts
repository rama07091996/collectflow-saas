import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export async function GET() {
  try {
    const integrations = store.getIntegrations();
    return NextResponse.json({ success: true, data: integrations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, provider } = body;

    if (action === 'toggle') {
      const connect = body.connect === true;
      const updated = store.toggleIntegration(provider, connect);
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === 'sync') {
      const result = store.syncIntegration(provider);
      return NextResponse.json({
        success: true,
        message: `Sync completed for ${provider}`,
        log: result.log,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
