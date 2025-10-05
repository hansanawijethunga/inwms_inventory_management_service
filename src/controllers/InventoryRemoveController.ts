import type { Request, Response } from 'express';
import { InventoryLedgerType, InventoryLedger } from '../domain/InventoryLedger.js';
import { InventoryBalance } from '../domain/InventoryBalance.js';
import { InventoryLedgerRepository } from '../repositories/InventoryLedgerRepository.js';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';
import { BlockOccupancy } from '../domain/BlockOccupancy.js';
import { BlockOccupancyRepository } from '../repositories/BlockOccupancyRepository.js';
import { Product } from '../domain/Product.js';
import { StockReceiptRepository } from '../repositories/StockReceiptRepository.js';
import { StockReceiptLine } from '../domain/StockReceiptLine.js';
const blockOccupancyRepo = new BlockOccupancyRepository();
const stockReceiptRepo = new StockReceiptRepository();

const ledgerRepo = new InventoryLedgerRepository();
const balanceRepo = new InventoryBalanceRepository();

export class InventoryRemoveController {
  static async bulkRemove(req: Request, res: Response) {
    try {
      // Expecting: [{ companyId, productId, blockId, condition, quantity, reason }]
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
          removal.condition
        );
        if (!balance || balance.onHand < removal.quantity) {
          throw new Error('Insufficient stock for removal');
        }
        // --- Find product area from StockReceiptLine using lotNumber ---
        let productAreaM2 = 1;
        if (removal.lotNumber) {
          const headers = await stockReceiptRepo.findByLotNumber(removal.lotNumber);
          // Filter by companyId and sort by createdAt ascending (earliest first)
          const filteredHeaders = headers.filter(h => h.companyId === removal.companyId);
          filteredHeaders.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          const header = filteredHeaders[0];
          if (header) {
             console.log('Header Id:', header.id);
            const lines = await stockReceiptRepo.findLinesByReceiptId(header.id);
            // Find line for productId, quantity > 0, earliest
            const matchingLines = lines.filter(l => l.productId === removal.productId && l.quantity > 0);
            matchingLines.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());           
            const line = matchingLines[0];
            if (line && line.productAreaM2) {
              productAreaM2 = Number(line.productAreaM2);
              // Create a new StockReceiptLine with updated quantity (immutability)
              const lineProps: any = {
                id: line.id,
                receiptId: line.receiptId,
                productId: line.productId,
                productName: line.productName,
                productCode: line.productCode,
                productAreaM2: line.productAreaM2 ?? undefined,
                requiresExpiry: line.requiresExpiry,
                requiresSerial: line.requiresSerial,
                quantity: line.quantity - removal.quantity,
                uom: line.uom,
                serialNumbers: line.serialNumbers ?? undefined,
                blockId: line.blockId,
                blockAddress: line.blockAddress,
                blockAreaM2: line.blockAreaM2 ?? undefined,
                condition: line.condition,
                expiryDate: line.expiryDate ?? undefined,
                productItemsSnapshot: line.productItemsSnapshot ?? undefined,
                createdAt: line.createdAt
              };
              if (line.handlingNotes !== undefined) lineProps.handlingNotes = line.handlingNotes;
              const updatedLine = new StockReceiptLine(lineProps);
              await stockReceiptRepo.saveLine(updatedLine);
            }
          }
        }
        // --- Block Occupancy Update ---
        const prevOccupancy = await blockOccupancyRepo.findByBlockAndCompany(removal.blockId, removal.companyId);
        const qty = Number(removal.quantity);
        console.log('Product Area M2 for removal:', productAreaM2);
        const areaToRelease = productAreaM2 * qty;
        let newOccupied: number;
        let newRemaining: number;
        if (prevOccupancy) {
          newOccupied = Number(prevOccupancy.occupiedAreaM2 || 0) - areaToRelease;
          newRemaining = Number(prevOccupancy.remainingAreaM2 || 0) + areaToRelease;
        } else {
          newOccupied = 0;
          newRemaining = 0;
        }
        if (prevOccupancy) {
          const occupancyProps: any = {
            ...prevOccupancy,
            occupiedAreaM2: newOccupied,
            remainingAreaM2: newRemaining,
            lastUpdatedAt: new Date()
          };
          const updatedOccupancy = new BlockOccupancy(occupancyProps);
          await blockOccupancyRepo.save(updatedOccupancy);
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
          uom: balance.uom, // use uom from balance, not from payload
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
