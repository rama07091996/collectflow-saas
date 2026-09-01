import { NextRequest, NextResponse } from 'next/server';
import { AIAssistantService } from '@/lib/ai-assistant';

export async function POST() {
  try {
    const result = AIAssistantService.runAutoPilotEngine();

    return NextResponse.json({
      success: true,
      message: result.summary,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
