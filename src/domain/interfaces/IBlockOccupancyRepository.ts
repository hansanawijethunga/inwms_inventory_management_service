import { BlockOccupancy } from '../BlockOccupancy.js';

export interface IBlockOccupancyRepository {
  save(occupancy: BlockOccupancy, sqlOrTx?: any): Promise<void>;
  findByBlockAndCompany(blockId: string, companyId: string, sqlOrTx?: any): Promise<BlockOccupancy | null>;
  findAllByCompany(companyId: string, sqlOrTx?: any): Promise<BlockOccupancy[]>;
}
