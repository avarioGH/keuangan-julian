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
    this.logger.log(`Generating AI Insight for Tenant: ${tenantId}`);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in environment variables.");
      }
      
      const systemInstruction = "You are Avario AI, an advanced business intelligence assistant for an ERP system. Provide concise, actionable business insights based on the user prompt.";
      
      const payload = {
        contents: [{
          parts: [{ text: `${systemInstruction}\n\nContext Data (if any): ${JSON.stringify(contextData)}\n\nUser Question: ${prompt}` }]
        }]
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API Error: ${errText}`);
      }

      const data = await res.json();
      const insight = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I am sorry, I could not generate an insight at this time.';

      return {
        success: true,
        provider: 'Gemini-1.5-Flash',
        insight: insight
      };
    } catch (e: any) {
      this.logger.error(`AI Error: ${e.message}`);
      return {
        success: false,
        provider: 'Gemini',
        insight: 'Sorry, the AI service is currently unavailable. Please try again later.'
      };
    }
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
