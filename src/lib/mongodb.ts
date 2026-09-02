import { MongoClient, ServerApiVersion, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URI_MONGODB_URI ||
  'mongodb://localhost:27017/collectflow';

/**
 * Connection pool management options optimized for Vercel Functions (Serverless)
 * Prevents connection leaks and connection spikes across serverless lambdas.
 */
const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: process.env.MONGODB_MAX_POOL_SIZE ? parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) : 10,
  minPoolSize: 0,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Attach database pool to Vercel Functions runtime lifecycle to cleanly
 * close and reclaim connections on serverless container freeze/shutdown.
 */
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  attachDatabasePool(client);

  global._mongoClientPromise = client.connect().catch((err) => {
    console.warn('MongoDB connection pool standby (URI:', uri, '):', err.message);
    return client;
  });
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
