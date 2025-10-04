import { BlockOccupancy } from '../domain/BlockOccupancy.js';
import type { IBlockOccupancyRepository } from '../domain/interfaces/IBlockOccupancyRepository.js';

export class BlockOccupancyService {
  constructor(private readonly repository: IBlockOccupancyRepository) {}

  async saveOccupancy(occupancy: BlockOccupancy): Promise<void> {
    // Validate required fields
    if (!occupancy.blockId || !occupancy.companyId) {
      throw new Error('Missing required occupancy fields');
    }
    // Prevent negative or over-occupied area
    if (occupancy.occupiedAreaM2 < 0) {
      throw new Error('Occupied area cannot be negative');
    }
    if (occupancy.blockAreaM2 !== undefined && occupancy.occupiedAreaM2 > occupancy.blockAreaM2) {
      throw new Error('Occupied area cannot exceed block area');
    }
    if (occupancy.remainingAreaM2 < 0) {
      throw new Error('Remaining area cannot be negative');
    }
    await this.repository.save(occupancy);
  }

  async getOccupancy(blockId: string, companyId: string): Promise<BlockOccupancy | null> {
    return this.repository.findByBlockAndCompany(blockId, companyId);
  }

  async getAllOccupanciesByCompany(companyId: string): Promise<BlockOccupancy[]> {
    return this.repository.findAllByCompany(companyId);
  }
}
