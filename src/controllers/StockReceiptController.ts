import type { Request, Response } from 'express';
import { StockReceiptService } from '../services/StockReceiptService.js';
import { StockReceiptRepository } from '../repositories/StockReceiptRepository.js';
import { InventoryLedgerRepository } from '../repositories/InventoryLedgerRepository.js';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';
import { BlockOccupancyRepository } from '../repositories/BlockOccupancyRepository.js';
import { StockReceiptHeader } from '../domain/StockReceiptHeader.js';
import { StockReceiptLine } from '../domain/StockReceiptLine.js';

const stockReceiptService = new StockReceiptService(
  new StockReceiptRepository(),
  new InventoryLedgerRepository(),
  new InventoryBalanceRepository(),
  new BlockOccupancyRepository()
);

export class StockReceiptController {
  static async createReceipt(req: Request, res: Response) {
    try {
      const { header, lines } = req.body;
      const headerObj = new StockReceiptHeader(header);
      const lineObjs = lines.map((l: any) => new StockReceiptLine(l));
      await stockReceiptService.createReceipt(headerObj, lineObjs);
      res.status(201).json({ message: 'Stock receipt created' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getReceiptById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Missing id parameter' });
        return;
      }
      const result = await stockReceiptService.getReceiptById(String(id));
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
