import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface CreateJournalDto {
  companyId: string;
  journalNo: string;
  referenceType: string;
  referenceId?: string;
  journalDate: Date;
  description?: string;
  userId: string;
  items: {
    accountId: string;
    debit: number;
    credit: number;
    description?: string;
  }[];
}

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Validasi Tutup Buku (Period Closing)
   * Mengembalikan Error (Hard Block) jika tanggal transaksi berada di periode yang sudah ditutup.
   */
  async validatePeriodIsOpen(companyId: string, date: Date, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const period = await prismaClient.accountingPeriod.findUnique({
      where: {
        company_id_month_year: {
          company_id: companyId,
          month: month,
          year: year,
        }
      }
    });

    if (period && period.status === 'CLOSED') {
      throw new BadRequestException(`Transactions are locked. The accounting period for ${month}/${year} is CLOSED.`);
    }

    // Cek juga Fiscal Year
    const fiscalYear = await prismaClient.fiscalYear.findUnique({
      where: {
        company_id_year: {
          company_id: companyId,
          year: year,
        }
      }
    });

    if (fiscalYear && fiscalYear.status === 'CLOSED') {
      throw new BadRequestException(`Transactions are locked. The fiscal year ${year} is CLOSED.`);
    }

    return true;
  }

  /**
   * Auto Journal Engine
   * Fungsi sentral untuk mencatat semua transaksi ERP menjadi entri jurnal.
   */
  async createJournalEntry(data: CreateJournalDto, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;

    // 1. Validasi Period Closing
    await this.validatePeriodIsOpen(data.companyId, data.journalDate, prismaClient);

    // 2. Validasi Keseimbangan Jurnal (Double Entry)
    const totalDebit = data.items.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = data.items.reduce((sum, item) => sum + item.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) { // Toleransi desimal tipis
      throw new BadRequestException(`Journal is unbalanced! Debit: ${totalDebit}, Credit: ${totalCredit}`);
    }

    // 3. Simpan Header Jurnal
    const journal = await prismaClient.journalEntry.create({
      data: {
        company_id: data.companyId,
        journal_no: data.journalNo,
        reference_type: data.referenceType,
        reference_id: data.referenceId,
        journal_date: data.journalDate,
        description: data.description,
        status: 'Posted', // Asumsikan auto-journal langsung posted
        created_by: data.userId,
        approved_by: data.userId,
        approved_at: new Date(),
        
        items: {
          create: data.items.map(item => ({
            account_id: item.accountId,
            debit: item.debit,
            credit: item.credit,
            description: item.description,
          }))
        }
      },
      include: { items: true }
    });

    // 4. Audit Log
    await prismaClient.auditLog.create({
      data: {
        company_id: data.companyId,
        user_id: data.userId,
        action: 'AUTO_JOURNAL_CREATED',
        entity: 'JournalEntry',
        entity_id: journal.id,
      }
    });

    return journal;
  }

  /**
   * Reverse Journal Engine
   * Membalik jurnal yang sudah salah tanpa menghapus data historisnya.
   */
  async reverseJournal(originalJournalId: string, reason: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const original = await tx.journalEntry.findUnique({
        where: { id: originalJournalId },
        include: { items: true }
      });

      if (!original) throw new BadRequestException('Journal not found');
      if (original.status === 'Closed') throw new BadRequestException('Cannot reverse a closed journal');

      // 1. Validasi Closing Period pada tanggal jurnal asli
      await this.validatePeriodIsOpen(original.company_id, original.journal_date, tx);

      // 2. Buat Jurnal Pembalik (Tukar Debit jadi Credit)
      const reversedJournal = await tx.journalEntry.create({
        data: {
          company_id: original.company_id,
          journal_no: `REV-${original.journal_no}`,
          reference_type: 'REVERSAL',
          reference_id: original.id,
          journal_date: new Date(), // Jurnal pembalik diakui hari ini
          description: `Reversal of ${original.journal_no}: ${reason}`,
          status: 'Posted',
          created_by: userId,
          approved_by: userId,
          approved_at: new Date(),
          items: {
            create: original.items.map(item => ({
              account_id: item.account_id,
              debit: item.credit, // SWAP
              credit: item.debit, // SWAP
              description: `Reversal: ${item.description}`,
            }))
          }
        }
      });

      // 3. Tandai Jurnal Asli sebagai Reversed dan Catat di JournalReversal
      await tx.journalEntry.update({
        where: { id: original.id },
        data: { status: 'Reversed' }
      });

      await tx.journalReversal.create({
        data: {
          company_id: original.company_id,
          original_journal_id: original.id,
          reverse_journal_id: reversedJournal.id,
          reason: reason,
          created_by: userId,
        }
      });

      return reversedJournal;
    });
  }
}
