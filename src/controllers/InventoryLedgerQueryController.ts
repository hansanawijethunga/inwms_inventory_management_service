import type { Request, Response } from 'express';
import { InventoryLedgerRepository } from '../repositories/InventoryLedgerRepository.js';

const ledgerRepo = new InventoryLedgerRepository();

export class InventoryLedgerQueryController {
  static async list(req: Request, res: Response) {
    try {
      // Optional filters: companyId, productId, type, dateFrom, dateTo
      const filters = req.query;
      const entries = await ledgerRepo.findAllByFilter(filters);
      res.json(entries);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
