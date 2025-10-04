import type { Request, Response } from 'express';
import { InventoryBalanceService } from '../services/InventoryBalanceService.js';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';
import { InventoryBalance } from '../domain/InventoryBalance.js';

const inventoryBalanceService = new InventoryBalanceService(new InventoryBalanceRepository());

export class InventoryBalanceController {
  static async saveBalance(req: Request, res: Response) {
    try {
      const balance = new InventoryBalance(req.body);
      await inventoryBalanceService.saveBalance(balance);
      res.status(201).json({ message: 'Balance saved' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getBalanceByKey(req: Request, res: Response) {
    try {
      const { companyId, productId, blockId, condition, expiryDate } = req.query;
      const result = await inventoryBalanceService.getBalanceByKey(
        String(companyId),
        String(productId),
        String(blockId),
        String(condition),
        expiryDate ? new Date(String(expiryDate)) : undefined
      );
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      // Optional filters: companyId, productId, blockId, condition, expiryDate
      const filters = req.query;
      const balances = await inventoryBalanceService.listBalances(filters);
      res.json(balances);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
