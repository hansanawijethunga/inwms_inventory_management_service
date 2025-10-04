import type { Request, Response } from 'express';
import { BlockOccupancyService } from '../services/BlockOccupancyService.js';
import { BlockOccupancyRepository } from '../repositories/BlockOccupancyRepository.js';
import { BlockOccupancy } from '../domain/BlockOccupancy.js';

const blockOccupancyService = new BlockOccupancyService(new BlockOccupancyRepository());

export class BlockOccupancyController {
  static async saveOccupancy(req: Request, res: Response) {
    try {
      const occupancy = new BlockOccupancy(req.body);
      await blockOccupancyService.saveOccupancy(occupancy);
      res.status(201).json({ message: 'Occupancy saved' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getOccupancy(req: Request, res: Response) {
    try {
      const { blockId, companyId } = req.query;
      const result = await blockOccupancyService.getOccupancy(String(blockId), String(companyId));
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
