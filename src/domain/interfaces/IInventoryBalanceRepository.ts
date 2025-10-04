import { InventoryBalance } from '../InventoryBalance.js';

export interface IInventoryBalanceRepository {
  save(balance: InventoryBalance): Promise<void>;
  findByKey(
    companyId: string,
    productId: string,
    blockId: string,
    condition: string,
    expiryDate?: Date
  ): Promise<InventoryBalance | null>;
  findAllByFilter(filter: any): Promise<InventoryBalance[]>;
}
