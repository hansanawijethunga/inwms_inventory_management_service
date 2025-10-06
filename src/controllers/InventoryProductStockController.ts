import type { Request, Response } from 'express';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';

const balanceRepo = new InventoryBalanceRepository();

export class InventoryProductStockController {
  static async getByProductId(req: Request, res: Response) {
    try {
      const { companyId, productId } = req.params;
      if (!companyId || !productId) {
        res.status(400).json({ error: 'companyId and productId are required' });
        return;
      }
      const balances = await balanceRepo.findAllByFilter({ companyId, productId });
      res.json(balances);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
