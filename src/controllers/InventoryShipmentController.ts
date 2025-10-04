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

export class InventoryShipmentController {
  static async receiveBulk(req: Request, res: Response) {
    try {
      // Expecting: [{ header, lines }] grouped by lot_number
      const { shipments } = req.body;
      if (!Array.isArray(shipments) || shipments.length === 0) {
        res.status(400).json({ error: 'No shipments provided' });
        return;
      }
      for (const shipment of shipments) {
        const headerObj = new StockReceiptHeader(shipment.header);
        const lineObjs = shipment.lines.map((l: any) => new StockReceiptLine(l));
        await stockReceiptService.createReceipt(headerObj, lineObjs);
      }
      res.status(201).json({ message: 'Bulk stock receipts processed' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
