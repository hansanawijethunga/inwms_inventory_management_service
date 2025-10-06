import type { Request, Response } from 'express';
import { BlockSpaceService } from '../services/BlockSpaceService.js';

const blockSpaceService = new BlockSpaceService();

export class BlockSpaceController {
  static async getAvailableSpace(req: Request, res: Response) {
    try {
      const { companyId } = req.query;
      const result = await blockSpaceService.getAvailableSpace({ companyId: companyId as string });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
