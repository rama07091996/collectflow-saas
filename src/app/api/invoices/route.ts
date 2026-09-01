import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const invoices = store.getInvoices({ status, search });
    const customers = store.getCustomers();

    return NextResponse.json({
      success: true,
      data: invoices,
      customers,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.customerId || !body.amount || !body.dueDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: customerId, amount, dueDate' },
        { status: 400 }
      );
    }

    const newInvoice = store.createInvoice({
      customerId: body.customerId,
      invoiceNumber: body.invoiceNumber,
      amount: Number(body.amount),
      issueDate: body.issueDate || new Date().toISOString(),
      dueDate: body.dueDate,
      notes: body.notes,
      items: body.items,
    });

    return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
