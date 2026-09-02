import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';
import { DashboardStatsResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/dashboard/stats
 * Returns aggregated financial and collections metrics for executive overview.
 */
export async function GET(request: NextRequest): Promise<NextResponse<DashboardStatsResponse | { success: false; error: string }>> {
  try {
    const orgId = request.nextUrl.searchParams.get('orgId') || undefined;
    const stats = store.getDashboardStats(orgId);
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error calculating stats.' },
      { status: 500 }
    );
  }
}
