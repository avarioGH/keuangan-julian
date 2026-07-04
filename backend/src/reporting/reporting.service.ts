import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface RequestExportDto {
  companyId: string;
  userId: string;
  reportType: string; // 'INVENTORY_LEDGER', 'PROFIT_LOSS', etc
  format: 'PDF' | 'EXCEL' | 'CSV';
  filters: any; // JSON config from frontend (dates, warehouses, etc)
}

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Queue Engine Placeholder for Async Exports.
   * Saat user menekan tombol "Export", API tidak akan nge-block dan menunggu PDF di-generate.
   * API akan mengembalikan status HTTP 202 (Accepted) dan memutar worker di Background.
   */
  async requestAsyncExport(data: RequestExportDto) {
    // 1. Catat ke Log dengan status PENDING
    const log = await this.prisma.reportExportLog.create({
      data: {
        company_id: data.companyId,
        report_type: data.reportType,
        format: data.format,
        status: 'PENDING',
        requested_by: data.userId,
      }
    });

    // 2. [TODO] Push ke Redis / BullMQ Queue (contoh: await this.exportQueue.add('generate-report', { logId: log.id, filters: data.filters }))
    this.logger.log(`Export Job Queued: [${log.id}] ${data.reportType} to ${data.format}`);

    // Untuk demo arsitektur, kita simulasikan delay proses tanpa BullMQ
    this.simulateBackgroundJob(log.id, data.companyId, data.format);

    return {
      message: 'Export request accepted and is processing in the background.',
      trackingId: log.id
    };
  }

  /**
   * Worker Simulasi
   * Dalam arsitektur asli, fungsi ini akan berada di file Worker terpisah yang listen ke BullMQ
   */
  private async simulateBackgroundJob(logId: string, companyId: string, format: string) {
    try {
      // Ubah status jadi PROCESSING
      await this.prisma.reportExportLog.update({
        where: { id: logId },
        data: { status: 'PROCESSING' }
      });

      // Simulasi waktu proses report yang berat (Data Streaming / PDF Generation)
      await new Promise(resolve => setTimeout(resolve, 5000)); 

      // Simulasi upload ke Cloudflare R2 / AWS S3
      const mockFileUrl = `https://storage.erp.local/reports/${companyId}/${logId}.${format.toLowerCase()}`;

      // Update jadi COMPLETED
      await this.prisma.reportExportLog.update({
        where: { id: logId },
        data: { 
          status: 'COMPLETED',
          file_url: mockFileUrl,
          completed_at: new Date()
        }
      });

      this.logger.log(`Export Job Completed: [${logId}] URL: ${mockFileUrl}`);
      // [TODO] Tembak WebSockets / SSE ke Frontend agar muncul notif "Download Ready"

    } catch (error) {
      await this.prisma.reportExportLog.update({
        where: { id: logId },
        data: { 
          status: 'FAILED',
          error_msg: error.message,
          completed_at: new Date()
        }
      });
    }
  }
}
