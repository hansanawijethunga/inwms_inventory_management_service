import type { Request, Response } from 'express';
import { InventoryLedgerService } from '../services/InventoryLedgerService.js';
import { InventoryLedgerRepository } from '../repositories/InventoryLedgerRepository.js';
import { InventoryLedger } from '../domain/InventoryLedger.js';

const inventoryLedgerService = new InventoryLedgerService(new InventoryLedgerRepository());

export class InventoryLedgerController {
  static async recordLedgerEntry(req: Request, res: Response) {
    try {
      const entry = new InventoryLedger(req.body);
      await inventoryLedgerService.recordLedgerEntry(entry);
      res.status(201).json({ message: 'Ledger entry recorded' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getLedgerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Missing id parameter' });
        return;
      }
      const result = await inventoryLedgerService.getLedgerById(String(id));
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
