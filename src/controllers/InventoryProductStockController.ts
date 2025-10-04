import type { Request, Response } from 'express';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';

const balanceRepo = new InventoryBalanceRepository();

export class InventoryProductStockController {
  static async getByProductId(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      if (!productId) {
        res.status(400).json({ error: 'productId is required' });
        return;
      }
      const balances = await balanceRepo.findAllByFilter({ productId });
      res.json(balances);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
