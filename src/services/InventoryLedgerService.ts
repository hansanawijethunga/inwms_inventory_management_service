import { InventoryLedger } from '../domain/InventoryLedger.js';
import type { IInventoryLedgerRepository } from '../domain/interfaces/IInventoryLedgerRepository.js';

export class InventoryLedgerService {
  constructor(private readonly repository: IInventoryLedgerRepository) {}

  async recordLedgerEntry(entry: InventoryLedger): Promise<void> {
    await this.repository.save(entry);
  }

  async getLedgerById(id: string): Promise<InventoryLedger | null> {
    return this.repository.findById(id);
  }

  async getLedgerByReceiptLineId(receiptLineId: string): Promise<InventoryLedger[]> {
    return this.repository.findByReceiptLineId(receiptLineId);
  }

  async getLedgerByFilter(filter: any): Promise<InventoryLedger[]> {
    return this.repository.findAllByFilter(filter);
  }
}
