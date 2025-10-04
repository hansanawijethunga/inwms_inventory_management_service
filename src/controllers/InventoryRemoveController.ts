import type { Request, Response } from 'express';
import { InventoryLedgerType, InventoryLedger } from '../domain/InventoryLedger.js';
import { InventoryBalance } from '../domain/InventoryBalance.js';
import { InventoryLedgerRepository } from '../repositories/InventoryLedgerRepository.js';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';

const ledgerRepo = new InventoryLedgerRepository();
const balanceRepo = new InventoryBalanceRepository();

export class InventoryRemoveController {
  static async bulkRemove(req: Request, res: Response) {
    try {
      // Expecting: [{ companyId, productId, blockId, condition, expiryDate, quantity, uom, reason }]
      const { removals } = req.body;
      if (!Array.isArray(removals) || removals.length === 0) {
        res.status(400).json({ error: 'No removals provided' });
        return;
      }
      for (const removal of removals) {
        // Find current balance
        const balance = await balanceRepo.findByKey(
          removal.companyId,
          removal.productId,
          removal.blockId,
          removal.condition,
          removal.expiryDate
        );
        if (!balance || balance.onHand < removal.quantity) {
          throw new Error('Insufficient stock for removal');
        }
        // Update balance
        const newOnHand = balance.onHand - removal.quantity;
        const newAvailable = balance.available - removal.quantity;
        const balanceProps: any = {
          ...balance,
          onHand: newOnHand,
          available: newAvailable,
          lastUpdatedAt: new Date()
        };
        if (balance.expiryDate !== undefined) balanceProps.expiryDate = balance.expiryDate;
        const updatedBalance = new InventoryBalance(balanceProps);
        await balanceRepo.save(updatedBalance);
        // Record ledger entry
        const ledger = new InventoryLedger({
          type: InventoryLedgerType.REMOVE,
          companyId: removal.companyId,
          companyLegalName: balance.companyId, // or lookup company name
          productId: removal.productId,
          productName: balance.productName,
          productCode: balance.productCode,
          blockId: removal.blockId,
          blockAddress: balance.blockAddress,
          condition: removal.condition,
          quantity: -removal.quantity,
          uom: removal.uom,
          expiryDate: removal.expiryDate,
          notes: removal.reason,
          createdAt: new Date()
        });
        await ledgerRepo.save(ledger);
      }
      res.status(201).json({ message: 'Bulk removal processed' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
