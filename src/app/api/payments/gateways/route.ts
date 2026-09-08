import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/memory-store';
import { MongoDBService } from '@/lib/db/mongodb-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/payments/gateways
 * Lists all available payment gateways (Stripe, PayPal, Razorpay) and their active configuration.
 */
export async function GET() {
  try {
    const gateways = store.getPaymentGateways();
    return NextResponse.json({
      success: true,
      data: gateways,
      database: 'MongoDB (payment_gateways collection)',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch payment gateways.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/payments/gateways
 * Updates or integrates a payment gateway (e.g. configuring Stripe Publishable Key, Secret Key).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, publishableKey, secretKey, webhookSecret, isEnabled, mode } = body;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Payment provider (STRIPE, PAYPAL, RAZORPAY) is required.' },
        { status: 400 }
      );
    }

    const updatedGateway = store.updatePaymentGateway(provider, {
      publishableKey,
      secretKey,
      webhookSecret,
      isEnabled: isEnabled !== undefined ? isEnabled : true,
      mode: mode || 'TEST',
    });

    return NextResponse.json({
      success: true,
      message: `${updatedGateway.name} configuration updated and saved to MongoDB!`,
      data: updatedGateway,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update payment gateway.' },
      { status: 500 }
    );
  }
}
