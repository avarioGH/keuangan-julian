import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export interface TransactionItemDto {
  productId: string;
  qty: number;
  unitCost: number;
  batchNumber?: string;
  expiredDate?: Date;
  notes?: string;
}

export interface CreateInboundDto {
  companyId: string;
  warehouseId: string;
  transactionNo: string;
  transactionDate: Date;
  notes?: string;
  userId: string;
  items: TransactionItemDto[];
}

export interface CreateOutboundDto {
  companyId: string;
  warehouseId: string;
  transactionNo: string;
  transactionDate: Date;
  notes?: string;
  userId: string;
  items: TransactionItemDto[];
}

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async createInbound(data: CreateInboundDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create Transaction Header
      const transaction = await tx.inventoryTransaction.create({
        data: {
          company_id: data.companyId,
          warehouse_id: data.warehouseId,
          transaction_no: data.transactionNo,
          transaction_type: 'IN',
          status: 'Approved',
          transaction_date: data.transactionDate,
          notes: data.notes,
          created_by: data.userId,
        },
      });

      // 2. Loop through items
      for (const item of data.items) {
        const subtotal = item.qty * item.unitCost;

        // a. Create Transaction Item
        await tx.inventoryTransactionItem.create({
          data: {
            transaction_id: transaction.id,
            product_id: item.productId,
            qty: item.qty,
            unit_cost: item.unitCost,
            subtotal: subtotal,
            batch_number: item.batchNumber,
            expired_date: item.expiredDate,
            notes: item.notes,
          },
        });

        // b. Create Stock Movement
        await tx.stockMovement.create({
          data: {
            company_id: data.companyId,
            warehouse_id: data.warehouseId,
            product_id: item.productId,
            transaction_type: 'IN',
            transaction_id: transaction.id,
            movement_type: 'IN',
            qty_in: item.qty,
            qty_out: 0,
            unit_cost: item.unitCost,
            total_cost: subtotal,
            batch_number: item.batchNumber,
            expired_date: item.expiredDate,
            created_by: data.userId,
          },
        });

        // c. Update Warehouse Stock (Cache)
        const currentStock = await tx.warehouseStock.findUnique({
          where: {
            company_id_warehouse_id_product_id: {
              company_id: data.companyId,
              warehouse_id: data.warehouseId,
              product_id: item.productId,
            }
          }
        });

        if (currentStock) {
          await tx.warehouseStock.update({
            where: { id: currentStock.id },
            data: {
              current_stock: currentStock.current_stock + item.qty,
              available_stock: currentStock.available_stock + item.qty,
            }
          });
        } else {
          await tx.warehouseStock.create({
            data: {
              company_id: data.companyId,
              warehouse_id: data.warehouseId,
              product_id: item.productId,
              current_stock: item.qty,
              available_stock: item.qty,
              reserved_stock: 0,
            }
          });
        }
      }

      // 3. Audit Log
      await tx.auditLog.create({
        data: {
          company_id: data.companyId,
          user_id: data.userId,
          action: 'CREATE',
          entity: 'InventoryTransaction_Inbound',
          entity_id: transaction.id,
        }
      });

      return transaction;
    });
  }

  async createOutbound(data: CreateOutboundDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validasi Stok Terlebih Dahulu
      for (const item of data.items) {
        const currentStock = await tx.warehouseStock.findUnique({
          where: {
            company_id_warehouse_id_product_id: {
              company_id: data.companyId,
              warehouse_id: data.warehouseId,
              product_id: item.productId,
            }
          }
        });

        if (!currentStock || currentStock.available_stock < item.qty) {
          throw new BadRequestException(`Stock tidak mencukupi untuk product ${item.productId}`);
        }
      }

      // 2. Create Transaction Header
      const transaction = await tx.inventoryTransaction.create({
        data: {
          company_id: data.companyId,
          warehouse_id: data.warehouseId,
          transaction_no: data.transactionNo,
          transaction_type: 'OUT',
          status: 'Approved',
          transaction_date: data.transactionDate,
          notes: data.notes,
          created_by: data.userId,
        },
      });

      // 3. Loop through items
      for (const item of data.items) {
        const subtotal = item.qty * item.unitCost;

        // a. Create Transaction Item
        await tx.inventoryTransactionItem.create({
          data: {
            transaction_id: transaction.id,
            product_id: item.productId,
            qty: item.qty,
            unit_cost: item.unitCost,
            subtotal: subtotal,
            batch_number: item.batchNumber,
            expired_date: item.expiredDate,
            notes: item.notes,
          },
        });

        // b. Create Stock Movement
        await tx.stockMovement.create({
          data: {
            company_id: data.companyId,
            warehouse_id: data.warehouseId,
            product_id: item.productId,
            transaction_type: 'OUT',
            transaction_id: transaction.id,
            movement_type: 'OUT',
            qty_in: 0,
            qty_out: item.qty,
            unit_cost: item.unitCost,
            total_cost: subtotal,
            batch_number: item.batchNumber,
            expired_date: item.expiredDate,
            created_by: data.userId,
          },
        });

        // c. Update Warehouse Stock (Cache)
        const currentStock = await tx.warehouseStock.findUnique({
          where: {
            company_id_warehouse_id_product_id: {
              company_id: data.companyId,
              warehouse_id: data.warehouseId,
              product_id: item.productId,
            }
          }
        });

        await tx.warehouseStock.update({
          where: { id: currentStock!.id },
          data: {
            current_stock: currentStock!.current_stock - item.qty,
            available_stock: currentStock!.available_stock - item.qty,
          }
        });
      }

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          company_id: data.companyId,
          user_id: data.userId,
          action: 'CREATE',
          entity: 'InventoryTransaction_Outbound',
          entity_id: transaction.id,
        }
      });

      return transaction;
    });
  }
}
