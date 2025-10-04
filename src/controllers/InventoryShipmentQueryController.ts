import type { Request, Response } from 'express';
import { StockReceiptRepository } from '../repositories/StockReceiptRepository.js';

const receiptRepo = new StockReceiptRepository();

export class InventoryShipmentQueryController {
  static async getByShipmentId(req: Request, res: Response) {
    try {
      const { shipment_id } = req.params;
      if (!shipment_id) {
        res.status(400).json({ error: 'shipment_id is required' });
        return;
      }
      const receipts = await receiptRepo.findByShipmentId(shipment_id);
      res.json(receipts);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
