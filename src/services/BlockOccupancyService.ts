import { BlockOccupancy } from '../domain/BlockOccupancy.js';
import type { IBlockOccupancyRepository } from '../domain/interfaces/IBlockOccupancyRepository.js';

export class BlockOccupancyService {
  constructor(private readonly repository: IBlockOccupancyRepository) {}

  async saveOccupancy(occupancy: BlockOccupancy): Promise<void> {
    await this.repository.save(occupancy);
  }

  async getOccupancy(blockId: string, companyId: string): Promise<BlockOccupancy | null> {
    return this.repository.findByBlockAndCompany(blockId, companyId);
  }

  async getAllOccupanciesByCompany(companyId: string): Promise<BlockOccupancy[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
