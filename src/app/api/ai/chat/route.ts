import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAIService, ClaudeModel } from '@/lib/claude-ai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt || '';
    const model = (body.model as ClaudeModel) || 'claude-3-5-sonnet-20241022';

    if (!prompt.trim()) {
      return NextResponse.json({ success: false, error: 'Prompt cannot be empty' }, { status: 400 });
    }

    const reply = await ClaudeAIService.queryClaude(prompt, model);

    return NextResponse.json({
      success: true,
      data: reply,
      modelUsed: model,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
