import { NextRequest, NextResponse } from 'next/server';
import { AIAssistantService } from '@/lib/ai-assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt || '';

    if (!prompt.trim()) {
      return NextResponse.json({ success: false, error: 'Prompt cannot be empty' }, { status: 400 });
    }

    const reply = AIAssistantService.processQuery(prompt);

    return NextResponse.json({
      success: true,
      data: reply,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
