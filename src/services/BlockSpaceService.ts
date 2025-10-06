
import { BlockOccupancyRepository } from '../repositories/BlockOccupancyRepository.js';
import { InventoryBalanceRepository } from '../repositories/InventoryBalanceRepository.js';

export class BlockSpaceService {
  constructor(
    private readonly blockRepo = new BlockOccupancyRepository(),
    private readonly balanceRepo = new InventoryBalanceRepository()
  ) {}

  async getAvailableSpace(filter: { companyId?: string; expand?: boolean }) {
    const blocks = await this.blockRepo.getAvailableSpace(filter);
    if (!filter.expand) {
      return blocks;
    }
    // For each block, get all products with available > 0
    const result = [];
    for (const block of blocks) {
      const balances = await this.balanceRepo.findAllByFilter({
        companyId: block.company_id,
        blockId: block.block_id
      });
      const products = balances
        .filter((b) => Number(b.available) > 0)
        .map((b) => ({
          productId: b.productId,
          productName: b.productName,
          productCode: b.productCode,
          condition: b.condition,
          expiryDate: b.expiryDate,
          onHand: b.onHand,
          reserved: b.reserved,
          available: b.available,
          uom: b.uom
        }));
      result.push({
        ...block,
        products
      });
    }
    return result;
  }
}
