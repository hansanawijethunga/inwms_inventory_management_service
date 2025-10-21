import type { Request, Response } from 'express';
import { StockReceiptRepository } from '../repositories/StockReceiptRepository.js';

const receiptRepo = new StockReceiptRepository();

export class InventoryShipmentQueryController {
  static async getByShipmentId(req: Request, res: Response) {
    try {
      const { companyId, shipment_id } = req.params;
      if (!companyId || !shipment_id) {
        res.status(400).json({ error: 'companyId and shipment_id are required' });
        return;
      }
      const receipts = await receiptRepo.findByShipmentIdAndCompany(shipment_id, companyId);
      res.json(receipts);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getReceiptsWithStockByCompany(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        res.status(400).json({ error: 'companyId is required' });
        return;
      }
      const results = await receiptRepo.findHeadersWithPositiveLinesByCompany(companyId);
      res.json(results);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
