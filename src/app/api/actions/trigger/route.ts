import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';
import {
  TriggerActionRequest,
  TriggerActionResponse,
} from '@/lib/types';

/**
 * POST /api/actions/trigger
 * Simulates triggering automated workflow actions on one or more invoices.
 * Supported actionTypes:
 *  - 'SEND_REMINDER': Sends an automated or custom tone-calibrated reminder.
 *  - 'NUDGE_ALL_OVERDUE': Batch nudges all active overdue and escalated invoices.
 *  - 'ESCALATE_DELINQUENT': Formally escalates high-delinquency invoices with legal/collections notices.
 *  - 'APPLY_LATE_FEE': Computes and appends a 1.5% late assessment fee to overdue balances.
 *  - 'PAUSE_CADENCE': Pauses active sequences (e.g. for disputed invoices).
 * 
 * Returns execution logs with timestamped audit entries.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<TriggerActionResponse | { success: false; error: string }>> {
  try {
    const body: TriggerActionRequest = await request.json();

    if (!body.actionType) {
      return NextResponse.json(
        { success: false, error: 'Validation failed: actionType is required.' },
        { status: 400 }
      );
    }

    const result = store.triggerAction(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error executing automated action.' },
      { status: 400 }
    );
  }
}
