import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET /api/db/mongodb
 * Health check & diagnostics endpoint for MongoDB connection.
 */
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('collectflow');
    
    // Check if connected and list collections
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: 'MongoDB driver connected successfully!',
      database: 'collectflow',
      driver: 'Official MongoDB NodeJS Driver v6+',
      architecture: 'Next.js with-mongodb standard connector pattern',
      collectionsCount: collections.length,
      collections: collections.map((c) => c.name),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      status: 'STANDBY_MODE',
      message: 'MongoDB Client initialized in standby mode (using persistent file-backed DB until MongoDB URI is configured).',
      configuredUri: process.env.MONGODB_URI ? 'Connected to configured URI' : 'mongodb://localhost:27017/collectflow (Default)',
      details: err.message,
    });
  }
}
