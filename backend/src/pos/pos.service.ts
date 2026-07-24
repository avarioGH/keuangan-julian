import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PosService {
  constructor(private prisma: PrismaService) {}

  async processCheckout(data: any) {
    const { companyId, userId, warehouseId, customerId, paymentMethod, items, subtotal, tax, total } = data;

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Sales Order (Receipt)
      const soNo = `POS-${Date.now()}`;
      const salesOrder = await tx.salesOrder.create({
        data: {
          company_id: companyId,
          order_number: soNo,
          customer_id: customerId,
          order_date: new Date(),
          status: 'COMPLETED',
          total_amount: total,
          payment_status: 'PAID',
          payment_method: paymentMethod || 'CASH',
        }
      });

      // 2. Loop Items
      for (const item of items) {
        // Create Sales Order Item
        await tx.salesOrderItem.create({
          data: {
            sales_order_id: salesOrder.id,
            product_id: item.productId,
            qty: item.qty,
            unit_price: item.price,
            subtotal: item.qty * item.price,
          }
        });

        if (warehouseId) {
          // Deduct Stock
          const currentStock = await tx.warehouseStock.findUnique({
            where: {
              company_id_warehouse_id_product_id: {
                company_id: companyId,
                warehouse_id: warehouseId,
                product_id: item.productId,
              }
            }
          });

          if (currentStock) {
            await tx.warehouseStock.update({
              where: { id: currentStock.id },
              data: {
                current_stock: currentStock.current_stock - item.qty,
                available_stock: currentStock.available_stock - item.qty,
              }
            });
          }
        }
      }

      // 3. Finance Transaction (Add Revenue)
      const cashAccount = await tx.cashAccount.findFirst({
        where: { company_id: companyId }
      });

      if (cashAccount) {
        await tx.financeTransaction.create({
          data: {
            company_id: companyId,
            cash_account_id: cashAccount.id,
            transaction_no: `TRX-${Date.now()}`,
            transaction_type: 'Income',
            transaction_date: new Date(),
            total_amount: total,
            reference_type: 'POS',
            reference_id: salesOrder.id,
            description: `Penjualan POS #${soNo}`,
            status: 'COMPLETED',
            created_by: userId,
          }
        });

        // Update Cash Balance
        await tx.cashAccount.update({
          where: { id: cashAccount.id },
          data: {
            current_balance: {
              increment: total
            }
          }
        });
      }

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          company_id: companyId,
          user_id: userId,
          action: 'CREATE',
          entity: 'POS_Transaction',
          entity_id: salesOrder.id,
          after_data: { details: `Kasir memproses transaksi ${soNo} senilai ${total}` }
        }
      });

      return salesOrder;
    });
  }
}
