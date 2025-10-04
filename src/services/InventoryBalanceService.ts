import { InventoryBalance } from '../domain/InventoryBalance.js';
import type { IInventoryBalanceRepository } from '../domain/interfaces/IInventoryBalanceRepository.js';

export class InventoryBalanceService {
  constructor(private readonly repository: IInventoryBalanceRepository) {}

  async saveBalance(balance: InventoryBalance): Promise<void> {
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
}
