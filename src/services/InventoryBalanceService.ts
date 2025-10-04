import { InventoryBalance } from '../domain/InventoryBalance.js';
import type { IInventoryBalanceRepository } from '../domain/interfaces/IInventoryBalanceRepository.js';

export class InventoryBalanceService {
  constructor(private readonly repository: IInventoryBalanceRepository) {}

  async saveBalance(balance: InventoryBalance): Promise<void> {
    // Validate required fields
    if (!balance.companyId || !balance.productId || !balance.blockId || !balance.condition) {
      throw new Error('Missing required balance fields');
    }
    // Prevent negative onHand
    if (balance.onHand < 0) {
      throw new Error('Inventory onHand cannot be negative');
    }
    // Ensure available is not negative
    if (balance.available < 0) {
      throw new Error('Available inventory cannot be negative');
    }
    await this.repository.save(balance);
  }

  async getBalanceByKey(
    companyId: string,
    productId: string,
    blockId: string,
    condition: string,
    expiryDate?: Date
  ): Promise<InventoryBalance | null> {
    return this.repository.findByKey(companyId, productId, blockId, condition, expiryDate);
  }

  async getBalancesByFilter(filter: any): Promise<InventoryBalance[]> {
    return this.repository.findAllByFilter(filter);
  }

  async listBalances(filter: any): Promise<InventoryBalance[]> {
    return this.repository.findAllByFilter(filter);
  }
}
