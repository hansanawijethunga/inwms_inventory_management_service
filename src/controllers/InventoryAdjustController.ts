import type { Request, Response } from 'express';

import { InventoryLedgerType, InventoryLedger } from '../domain/InventoryLedger.js';
import { InventoryBalance } from '../domain/InventoryBalance.js';
import { InventoryLedgerRepository } from '../repositories/InventoryLedgerRepository.js';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';
import { StockReceiptRepository } from '../repositories/StockReceiptRepository.js';
import { BlockOccupancyRepository } from '../repositories/BlockOccupancyRepository.js';
import sql from '../infrastructure/db.js';

const ledgerRepo = new InventoryLedgerRepository();
const balanceRepo = new InventoryBalanceRepository();
const receiptRepo = new StockReceiptRepository();
const blockOccRepo = new BlockOccupancyRepository();

export class InventoryAdjustController {
  /**
   * Adjust inventory at the line level.
   * Payload: { adjustments: [{ stockReceiptLineId, newQuantity, reason }] }
   */
  static async adjustLine(req: Request, res: Response) {
    const { adjustments } = req.body;
    if (!Array.isArray(adjustments) || adjustments.length === 0) {
      res.status(400).json({ error: 'No adjustments provided' });
      return;
    }
    try {
      await sql.begin(async (tx) => {
        for (const adj of adjustments) {
          const { stockReceiptLineId, newQuantity, reason } = adj;
          if (!stockReceiptLineId || typeof newQuantity !== 'number') {
            throw new Error('stockReceiptLineId and newQuantity are required');
          }
          // Find the StockReceiptLine using repository
          const line = await receiptRepo.findLineById(stockReceiptLineId, tx);
          if (!line) throw new Error('StockReceiptLine not found');
          const oldQuantity = Number(line.quantity);
          const delta = newQuantity - oldQuantity;
          if (delta === 0) continue; // No change

          // Update StockReceiptLine using repository
          await receiptRepo.updateLineQuantity(stockReceiptLineId, newQuantity, tx);

          // Update InventoryBalance
          // Fetch header to get companyId and companyLegalName
          const header = await receiptRepo.findHeaderById(line.receiptId, tx);
          if (!header) throw new Error('StockReceiptHeader not found');
          const balance = await balanceRepo.findByKey(
            header.companyId,
            line.productId,
            line.blockId,
            line.condition,
            line.expiryDate,
            tx
          );
          if (!balance) throw new Error('InventoryBalance not found');
          const newOnHand = Number(balance.onHand) + delta;
          const newAvailable = Number(balance.available) + delta;
          const updatedBalance = new InventoryBalance({
            ...balance,
            onHand: newOnHand,
            available: newAvailable,
            lastUpdatedAt: new Date(),
            expiryDate: balance.expiryDate ?? new Date(0), // fallback to epoch if missing
            reserved: balance.reserved ?? 0
          });
          await balanceRepo.save(updatedBalance, tx);

          // Update BlockOccupancy (if area is tracked)
          if (line.blockAreaM2) {
            const occ = await blockOccRepo.findByBlockAndCompany(line.blockId, header.companyId, tx);
            if (occ) {
              // Log previous and current quantity
              console.log(`[BlockOccupancy] Previous quantity: ${oldQuantity}`);
              console.log(`[BlockOccupancy] Current quantity: ${newQuantity}`);
              if (!line.productAreaM2) {
                console.warn('[BlockOccupancy] productAreaM2 is not set on StockReceiptLine. Skipping area adjustment.');
                return;
              }
              const areaPerUnit = Number(line.productAreaM2);
              console.log(`[BlockOccupancy] Area per single product: ${areaPerUnit}`);
              let newOccupied = areaPerUnit * newQuantity;
              if (newOccupied < 0) newOccupied = 0;
              let newRemaining = Number(occ.blockAreaM2 || 0) - newOccupied;
              if (newRemaining < 0) newRemaining = 0;
              await blockOccRepo.save(
                { ...occ, occupiedAreaM2: newOccupied, remainingAreaM2: newRemaining, lastUpdatedAt: new Date() },
                tx
              );
            }
          }

          // Add InventoryLedger entry
          const ledger = new InventoryLedger({
            type: InventoryLedgerType.ADJUST,
            receiptLineId: stockReceiptLineId,
            companyId: header.companyId,
            companyLegalName: header.companyLegalName || '',
            productId: line.productId,
            productName: line.productName || '',
            productCode: line.productCode || '',
            blockId: line.blockId,
            blockAddress: line.blockAddress || '',
            condition: line.condition,
            quantity: delta,
            uom: line.uom,
            expiryDate: line.expiryDate ?? new Date(0),
            notes: reason,
            createdAt: new Date()
          });
          await ledgerRepo.save(ledger, tx);
        }
      });
      res.status(201).json({ message: 'Line-level adjustment processed' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
