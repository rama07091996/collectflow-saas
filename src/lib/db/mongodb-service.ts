import clientPromise from '@/lib/mongodb';
import { Customer, Invoice, Workflow, User } from '@/lib/types';
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
}
