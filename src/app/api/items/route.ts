import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';
import {
  GetItemsResponse,
  CreateItemRequest,
  CreateItemResponse,
} from '@/lib/types';

/**
 * GET /api/items
 * Returns paginated, searchable, filterable invoice/debtor records with pagination metadata.
 * Query Parameters:
 *  - page: number (default: 1)
 *  - limit: number (default: 10)
 *  - status: ALL | OVERDUE | PENDING | PAID | PARTIALLY_PAID | IN_DISPUTE | ESCALATED | DRAFT
 *  - search: string (matches invoice number, customer name, company, email, notes)
 *  - sortBy: dueDate | amount | amountDue | invoiceNumber | issueDate
 *  - sortOrder: asc | desc
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<GetItemsResponse | { success: false; error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 10;
    const status = searchParams.get('status') || 'ALL';
    const search = searchParams.get('search') || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'dueDate';
    const sortOrder = (searchParams.get('sortOrder') as any) || 'desc';

    const response = store.getItems({
      page,
      limit,
      status,
      search,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch items.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/items
 * Creates a new invoice record, attaches line items, generates 1-click payment portal URL,
 * updates debtor outstanding ledger, and enrolls record into automated follow-up cadence.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateItemResponse | { success: false; error: string }>> {
  try {
    const body: CreateItemRequest = await request.json();

    // Validation
    if (!body.customerId || !body.amount || !body.dueDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: customerId, amount, and dueDate are required.',
        },
        { status: 400 }
      );
    }

    if (Number(body.amount) <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed: amount must be a positive number.',
        },
        { status: 400 }
      );
    }

    const newInvoice = store.createItem({
      customerId: body.customerId,
      invoiceNumber: body.invoiceNumber,
      amount: Number(body.amount),
      issueDate: body.issueDate || new Date().toISOString(),
      dueDate: body.dueDate,
      notes: body.notes,
      items: body.items,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Invoice ${newInvoice.invoiceNumber} created and enrolled into automated cadence.`,
        data: newInvoice,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error creating invoice.' },
      { status: 500 }
    );
  }
}
