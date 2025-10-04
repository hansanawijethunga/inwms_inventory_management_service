import { BlockOccupancy } from '../BlockOccupancy.js';

export interface IBlockOccupancyRepository {
  save(occupancy: BlockOccupancy): Promise<void>;
  findByBlockAndCompany(blockId: string, companyId: string): Promise<BlockOccupancy | null>;
  findAllByCompany(companyId: string): Promise<BlockOccupancy[]>;
}
