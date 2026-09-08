import clientPromise from '@/lib/mongodb';
import { Customer, Invoice, Workflow, User, PaymentRecord, PaymentGatewayConfig } from '@/lib/types';
import { Db } from 'mongodb';

export class MongoDBService {
  private static dbName = process.env.MONGODB_DB_NAME || 'collectflow';

  public static async getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(this.dbName);
  }

  // -------------------------------------------------------------
  // USERS COLLECTION
  // -------------------------------------------------------------
  public static async findUserByEmail(email: string): Promise<any | null> {
    try {
      const db = await this.getDb();
      return await db.collection('users').findOne({ email: email.toLowerCase() });
    } catch {
      return null;
    }
  }

  public static async insertUser(user: any): Promise<any> {
    try {
      const db = await this.getDb();
      return await db.collection('users').insertOne({
        ...user,
        email: user.email.toLowerCase(),
        createdAt: user.createdAt || new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('MongoDB insertUser standby:', err.message);
      return null;
    }
  }

  // -------------------------------------------------------------
  // INVOICES COLLECTION
  // -------------------------------------------------------------
  public static async findInvoices(query: any = {}): Promise<Invoice[]> {
    try {
      const db = await this.getDb();
      const docs = await db.collection('invoices').find(query).toArray();
      return docs as unknown as Invoice[];
    } catch {
      return [];
    }
  }

  public static async insertInvoice(invoice: Invoice): Promise<any> {
    try {
      const db = await this.getDb();
      return await db.collection('invoices').insertOne({ ...invoice });
    } catch (err: any) {
      console.warn('MongoDB insertInvoice standby:', err.message);
      return null;
    }
  }

  // -------------------------------------------------------------
  // CUSTOMERS COLLECTION
  // -------------------------------------------------------------
  public static async findCustomers(query: any = {}): Promise<Customer[]> {
    try {
      const db = await this.getDb();
      const docs = await db.collection('customers').find(query).toArray();
      return docs as unknown as Customer[];
    } catch {
      return [];
    }
  }

  public static async insertCustomer(customer: Customer): Promise<any> {
    try {
      const db = await this.getDb();
      return await db.collection('customers').insertOne({ ...customer });
    } catch (err: any) {
      console.warn('MongoDB insertCustomer standby:', err.message);
      return null;
    }
  }

  // -------------------------------------------------------------
  // PAYMENTS COLLECTION (MongoDB Payment Storage)
  // -------------------------------------------------------------
  public static async insertPayment(payment: PaymentRecord): Promise<any> {
    try {
      const db = await this.getDb();
      const result = await db.collection('payments').insertOne({
        ...payment,
        createdAt: payment.createdAt || new Date().toISOString(),
      });
      return result;
    } catch (err: any) {
      console.warn('MongoDB insertPayment standby:', err.message);
      return null;
    }
  }

  public static async findPayments(query: any = {}): Promise<PaymentRecord[]> {
    try {
      const db = await this.getDb();
      const docs = await db
        .collection('payments')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      return docs as unknown as PaymentRecord[];
    } catch {
      return [];
    }
  }

  public static async findPaymentById(id: string): Promise<PaymentRecord | null> {
    try {
      const db = await this.getDb();
      const doc = await db.collection('payments').findOne({ id });
      return doc as unknown as PaymentRecord | null;
    } catch {
      return null;
    }
  }

  // -------------------------------------------------------------
  // PAYMENT GATEWAYS CONFIGURATION
  // -------------------------------------------------------------
  public static async getPaymentGateways(): Promise<PaymentGatewayConfig[]> {
    try {
      const db = await this.getDb();
      const docs = await db.collection('payment_gateways').find({}).toArray();
      return docs as unknown as PaymentGatewayConfig[];
    } catch {
      return [];
    }
  }

  public static async savePaymentGateway(config: PaymentGatewayConfig): Promise<any> {
    try {
      const db = await this.getDb();
      return await db.collection('payment_gateways').updateOne(
        { provider: config.provider },
        { $set: { ...config, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (err: any) {
      console.warn('MongoDB savePaymentGateway standby:', err.message);
      return null;
    }
  }
}
