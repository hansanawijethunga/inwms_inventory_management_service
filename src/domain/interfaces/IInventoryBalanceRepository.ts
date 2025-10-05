import { InventoryBalance } from '../InventoryBalance.js';

export interface IInventoryBalanceRepository {
  save(balance: InventoryBalance, sqlOrTx?: any): Promise<void>;
  findByKey(
    companyId: string,
    productId: string,
    blockId: string,
    condition: string,
    expiryDate?: Date,
    sqlOrTx?: any
  ): Promise<InventoryBalance | null>;
  findAllByFilter(filter: any, sqlOrTx?: any): Promise<InventoryBalance[]>;
}
