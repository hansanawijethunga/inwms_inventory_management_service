import type { Request, Response } from 'express';
import { StockReceiptRepository } from '../repositories/StockReceiptRepository.js';

const receiptRepo = new StockReceiptRepository();

export class InventoryLotQueryController {
  static async getByLotNumber(req: Request, res: Response) {
    try {
      const { lot_number } = req.params;
      if (!lot_number) {
        res.status(400).json({ error: 'lot_number is required' });
        return;
      }
      const receipts = await receiptRepo.findByLotNumber(lot_number);
      res.json(receipts);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
