import type { Request, Response } from 'express';
import { InventoryLedgerType, InventoryLedger } from '../domain/InventoryLedger.js';
import { InventoryBalance } from '../domain/InventoryBalance.js';
import { InventoryLedgerRepository } from '../repositories/InventoryLedgerRepository.js';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';

const ledgerRepo = new InventoryLedgerRepository();
const balanceRepo = new InventoryBalanceRepository();

export class InventoryAdjustController {
  static async bulkAdjust(req: Request, res: Response) {
    try {
      // Expecting: [{ companyId, productId, blockId, condition, expiryDate, quantity, uom, reason }]
      const { adjustments } = req.body;
      if (!Array.isArray(adjustments) || adjustments.length === 0) {
        res.status(400).json({ error: 'No adjustments provided' });
        return;
      }
      for (const adj of adjustments) {
        // Find current balance
        const balance = await balanceRepo.findByKey(
          adj.companyId,
          adj.productId,
          adj.blockId,
          adj.condition,
          adj.expiryDate
        );
        const newOnHand = (balance?.onHand || 0) + adj.quantity;
        const newAvailable = (balance?.available || 0) + adj.quantity;
        const balanceProps: any = {
          ...(balance || {}),
          companyId: adj.companyId,
          productId: adj.productId,
          onHand: newOnHand,
          available: newAvailable,
          lastUpdatedAt: new Date()
        };
        if (adj.expiryDate !== undefined) balanceProps.expiryDate = adj.expiryDate;
        const updatedBalance = new InventoryBalance(balanceProps);
        await balanceRepo.save(updatedBalance);
        // Record ledger entry
        const ledger = new InventoryLedger({
          type: InventoryLedgerType.ADJUST,
          companyId: adj.companyId,
          companyLegalName: balance?.companyId || '', // or lookup company name
          productId: adj.productId,
          productName: balance?.productName || '',
          productCode: balance?.productCode || '',
          blockId: adj.blockId,
          blockAddress: balance?.blockAddress || '',
          condition: adj.condition,
          quantity: adj.quantity,
          uom: adj.uom,
          expiryDate: adj.expiryDate,
          notes: adj.reason,
          createdAt: new Date()
        });
        await ledgerRepo.save(ledger);
      }
      res.status(201).json({ message: 'Bulk adjustment processed' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
