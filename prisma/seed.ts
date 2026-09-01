import { PrismaClient } from '@prisma/client';
import {
  SEED_USERS,
  SEED_CUSTOMERS,
  SEED_INVOICES,
  SEED_WORKFLOW,
  SEED_INTEGRATIONS,
} from '../src/lib/db/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting CollectFlow Database Seeding (15 Diverse Sample Records)...');

  // 1. Create Organization
  const org = await prisma.organization.upsert({
    where: { slug: 'apex-growth-media' },
    update: {},
    create: {
      id: 'org_apex',
      name: 'Apex Growth Media',
      slug: 'apex-growth-media',
      currency: 'USD',
      timezone: 'America/New_York',
      taxId: 'US-94-8192831',
    },
  });
  console.log(`✓ Seeded Organization: ${org.name}`);

  // 2. Create Users
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as any,
        avatarUrl: user.avatarUrl,
        organizationId: org.id,
      },
    });
  }
  console.log(`✓ Seeded ${SEED_USERS.length} Demo Users`);

  // 3. Create Customers
  for (const cust of SEED_CUSTOMERS) {
    await prisma.customer.upsert({
      where: { id: cust.id },
      update: {},
      create: {
        id: cust.id,
        organizationId: org.id,
        name: cust.name,
        companyName: cust.companyName,
        email: cust.email,
        phone: cust.phone,
        address: cust.address,
        creditLimit: cust.creditLimit,
        paymentTermsDays: cust.paymentTermsDays,
        riskScore: cust.riskScore,
        riskLevel: cust.riskLevel as any,
        totalOutstanding: cust.totalOutstanding,
        totalPaid: cust.totalPaid,
      },
    });
  }
  console.log(`✓ Seeded ${SEED_CUSTOMERS.length} Debtor Companies`);

  // 4. Create Invoices, Line Items & Communication Audit Logs
  for (const inv of SEED_INVOICES) {
    const createdInvoice = await prisma.invoice.upsert({
      where: { invoiceNumber: inv.invoiceNumber },
      update: {},
      create: {
        id: inv.id,
        organizationId: org.id,
        customerId: inv.customerId,
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        amountPaid: inv.amountPaid,
        amountDue: inv.amountDue,
        currency: inv.currency,
        issueDate: new Date(inv.issueDate),
        dueDate: new Date(inv.dueDate),
        paidDate: inv.paidDate ? new Date(inv.paidDate) : null,
        status: inv.status as any,
        paymentLinkUrl: inv.paymentLinkUrl,
        notes: inv.notes,
        remindersSentCount: inv.remindersSentCount,
        lastReminderAt: inv.lastReminderAt ? new Date(inv.lastReminderAt) : null,
      },
    });

    // Seed Items
    if (inv.items && inv.items.length > 0) {
      for (const item of inv.items) {
        await prisma.invoiceItem.create({
          data: {
            id: item.id,
            invoiceId: createdInvoice.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
          },
        }).catch(() => {});
      }
    }

    // Seed Communication Logs
    if (inv.communications && inv.communications.length > 0) {
      for (const comm of inv.communications) {
        await prisma.communicationLog.create({
          data: {
            id: comm.id,
            invoiceId: createdInvoice.id,
            customerId: inv.customerId,
            type: comm.type as any,
            subject: comm.subject,
            body: comm.body,
            channel: comm.channel,
            status: comm.status as any,
            sentAt: new Date(comm.sentAt),
            openedAt: comm.openedAt ? new Date(comm.openedAt) : null,
            clickedAt: comm.clickedAt ? new Date(comm.clickedAt) : null,
          },
        }).catch(() => {});
      }
    }
  }
  console.log(`✓ Seeded ${SEED_INVOICES.length} Sample Invoices with Line Items & Timelines`);

  // 5. Seed Cadence Workflow
  const wf = await prisma.workflow.upsert({
    where: { id: SEED_WORKFLOW.id },
    update: {},
    create: {
      id: SEED_WORKFLOW.id,
      organizationId: org.id,
      name: SEED_WORKFLOW.name,
      description: SEED_WORKFLOW.description,
      isActive: SEED_WORKFLOW.isActive,
      isDefault: SEED_WORKFLOW.isDefault,
    },
  });

  for (const step of SEED_WORKFLOW.steps) {
    await prisma.workflowStep.create({
      data: {
        id: step.id,
        workflowId: wf.id,
        stepOrder: step.stepOrder,
        timing: step.timing as any,
        offsetDays: step.offsetDays,
        channel: step.channel,
        templateSubject: step.templateSubject,
        templateBody: step.templateBody,
        isAutomated: step.isAutomated,
        requireApproval: step.requireApproval,
      },
    }).catch(() => {});
  }
  console.log(`✓ Seeded 5-Step AR Recovery Follow-Up Sequence`);

  // 6. Seed Integrations
  for (const int of SEED_INTEGRATIONS) {
    await prisma.integration.upsert({
      where: {
        organizationId_provider: {
          organizationId: org.id,
          provider: int.provider as any,
        },
      },
      update: {},
      create: {
        id: int.id,
        organizationId: org.id,
        provider: int.provider as any,
        status: int.status as any,
        accountName: int.accountName,
        lastSyncAt: int.lastSyncAt ? new Date(int.lastSyncAt) : null,
        syncFrequency: int.syncFrequency,
        syncLog: int.syncLog,
      },
    });
  }
  console.log(`✓ Seeded Accounting & Payment Integrations (Stripe, QuickBooks)`);

  console.log('\n🎉 CollectFlow database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
