import { BlockOccupancyRepository } from '../repositories/BlockOccupancyRepository.js';

export class BlockSpaceService {
  constructor(private readonly repo = new BlockOccupancyRepository()) {}

  async getAvailableSpace(filter: { companyId?: string }) {
    return this.repo.getAvailableSpace(filter);
  }
}
