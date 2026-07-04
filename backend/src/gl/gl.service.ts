import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface CreateJournalDto {
  companyId: string;
  entryDate: Date;
  referenceType: string;
  referenceId: string;
  description?: string;
  items: {
    accountId: string;
    debit: number;
    credit: number;
  }[];
}

@Injectable()
export class GlService {
  
  /**
   * Helper function to create Journal Entry within an existing Prisma Transaction.
   * Ensuring 100% ACID compliance across modules.
   */
  async createJournalEntryWithinTx(tx: Prisma.TransactionClient, data: CreateJournalDto) {
    // 1. Validate Balance (Debit must equal Credit)
    const totalDebit = data.items.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = data.items.reduce((sum, item) => sum + item.credit, 0);

    if (totalDebit !== totalCredit) {
      throw new Error(`Journal Entry is unbalanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
    }

    // 2. Create Journal Header
    const journal = await tx.journalEntry.create({
      data: {
        company_id: data.companyId,
        journal_no: `JNL-${Date.now()}`,
        journal_date: data.entryDate,
        reference_type: data.referenceType,
        reference_id: data.referenceId,
        description: data.description,
        status: 'Posted',
        created_by: 'SYSTEM'
      }
    });

    // 3. Create Journal Items
    for (const item of data.items) {
      if (item.debit > 0 || item.credit > 0) {
        await tx.journalEntryItem.create({
          data: {
            journal_entry_id: journal.id,
            account_id: item.accountId,
            debit: item.debit,
            credit: item.credit,
          }
        });
      }
    }

    return journal;
  }
}
