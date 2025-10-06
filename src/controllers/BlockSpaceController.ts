import type { Request, Response } from 'express';
import { BlockSpaceService } from '../services/BlockSpaceService.js';

const blockSpaceService = new BlockSpaceService();

export class BlockSpaceController {
  static async getAvailableSpace(req: Request, res: Response) {
    try {
      const { companyId, expand } = req.query;
      let expandBool = false;
      if (typeof expand === 'string') {
        expandBool = expand === 'true' || expand === '1';
      } else if (typeof expand === 'boolean') {
        expandBool = expand;
      } else if (typeof expand === 'number') {
        expandBool = expand === 1;
      }
      const result = await blockSpaceService.getAvailableSpace({
        companyId: companyId as string,
        expand: expandBool
      });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
