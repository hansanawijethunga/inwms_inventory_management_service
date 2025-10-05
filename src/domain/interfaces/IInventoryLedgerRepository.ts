import { InventoryLedger } from '../InventoryLedger.js';

export interface IInventoryLedgerRepository {
  save(ledger: InventoryLedger, sqlOrTx?: any): Promise<void>;
  findById(id: string, sqlOrTx?: any): Promise<InventoryLedger | null>;
  findByReceiptLineId(receiptLineId: string, sqlOrTx?: any): Promise<InventoryLedger[]>;
  findAllByFilter(filter: any, sqlOrTx?: any): Promise<InventoryLedger[]>;
}
