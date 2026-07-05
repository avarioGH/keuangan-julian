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
      provider: 'OpenAI-GPT4',
      insight: mockResponse
    };
  }

  // --- Settings ---
  async getSettings(companyId: string) {
    let setting = await this.prisma.companySetting.findUnique({
      where: { company_id: companyId }
    });
    let company = await this.prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!setting) {
      setting = await this.prisma.companySetting.create({
        data: { company_id: companyId }
      });
    }

    return {
      companyName: company?.name || "",
      currency: setting.currency,
      timezone: setting.timezone,
      invoicePrefix: setting.invoice_prefix
    };
  }

  async updateSettings(companyId: string, data: any) {
    await this.prisma.company.update({
      where: { id: companyId },
      data: { name: data.companyName }
    });

    return this.prisma.companySetting.upsert({
      where: { company_id: companyId },
      update: {
        currency: data.currency,
        timezone: data.timezone,
        invoice_prefix: data.invoicePrefix
      },
      create: {
        company_id: companyId,
        currency: data.currency,
        timezone: data.timezone,
        invoice_prefix: data.invoicePrefix
      }
    });
  }

  // --- API Keys ---
  async getApiKeys(companyId: string) {
    // For single-tenant ERP, we'll just fetch all tokens (or link them to a default tenant)
    const company = await this.prisma.company.findUnique({ where: { id: companyId }});
    if (!company?.tenant_id) return [];
    
    return this.prisma.apiToken.findMany({
      where: { tenant_id: company.tenant_id },
      orderBy: { created_at: 'desc' }
    });
  }

  async createApiKey(companyId: string, data: any) {
    let company = await this.prisma.company.findUnique({ where: { id: companyId }});
    let tenantId = company?.tenant_id;
    
    if (!tenantId) {
      const tenant = await this.prisma.tenant.create({
        data: { name: company?.name || 'Default Tenant', status: 'ACTIVE' }
      });
      tenantId = tenant.id;
      await this.prisma.company.update({ where: { id: companyId }, data: { tenant_id: tenantId }});
    }

    const tokenString = 'avario_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    return this.prisma.apiToken.create({
      data: {
        tenant_id: tenantId,
        name: data.name,
        token_hash: tokenString, // In real world, hash this and return raw once. For demo, we store raw.
        scopes: data.scopes || 'all'
      }
    });
  }
}
