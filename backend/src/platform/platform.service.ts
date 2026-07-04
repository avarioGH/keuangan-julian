import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Tenant Middleware Validation (Dipanggil di Global Guard)
   * Memastikan bahwa Tenant aktif dan Subscription belum kedaluwarsa.
   */
  async validateTenantSubscription(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { subscription: true }
    });

    if (!tenant) {
      throw new ForbiddenException('Tenant not found.');
    }

    if (tenant.status !== 'ACTIVE') {
      throw new ForbiddenException(`Tenant is currently ${tenant.status}`);
    }

    const sub = tenant.subscription;
    if (!sub) {
      throw new ForbiddenException('No active subscription found for this Tenant.');
    }

    if (new Date() > sub.end_date) {
      // Auto Update Status ke EXPIRED
      await this.prisma.tenantSubscription.update({
        where: { id: sub.id },
        data: { status: 'EXPIRED' }
      });
      throw new ForbiddenException('Your subscription has expired. Please renew to continue using the ERP.');
    }

    return true;
  }

  /**
   * AI Service Wrapper (Agnostic Gateway)
   * Menyembunyikan kompleksitas vendor AI dari modul ERP lainnya.
   */
  async generateAiInsight(prompt: string, contextData: any, tenantId: string) {
    // 1. Cek Kuota AI Tenant
    // [TODO] Implement pengurangan AI Credits per request
    this.logger.log(`Generating AI Insight for Tenant: ${tenantId}`);

    // 2. Tembak ke Provider (OpenAI / Anthropic)
    // Di sinilah HTTP Request ke vendor dieksekusi.
    // Untuk demo arsitektur, kita gunakan simulasi respons:
    const mockResponse = `Based on the context data, we recommend reducing the safety stock for Product A by 15% due to a downward trend in Q3.`;

    return {
      success: true,
      provider: 'OpenAI-GPT4', // atau 'Local-LLaMA'
      insight: mockResponse
    };
  }
}
