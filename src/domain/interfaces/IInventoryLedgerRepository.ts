import { InventoryLedger } from '../InventoryLedger.js';

export interface IInventoryLedgerRepository {
  save(ledger: InventoryLedger): Promise<void>;
  findById(id: string): Promise<InventoryLedger | null>;
  findByReceiptLineId(receiptLineId: string): Promise<InventoryLedger[]>;
  findAllByFilter(filter: any): Promise<InventoryLedger[]>;
}
