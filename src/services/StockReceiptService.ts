import { StockReceiptHeader } from '../domain/StockReceiptHeader.js';
import { StockReceiptLine } from '../domain/StockReceiptLine.js';
import type { IStockReceiptRepository } from '../domain/interfaces/IStockReceiptRepository.js';

export class StockReceiptService {
  constructor(private readonly repository: IStockReceiptRepository) {}

  async createReceipt(header: StockReceiptHeader, lines: StockReceiptLine[]): Promise<void> {
    // Save header
    await this.repository.saveHeader(header);
    // Save all lines
    for (const line of lines) {
      await this.repository.saveLine(line);
    }
  }

  async getReceiptById(id: string): Promise<{ header: StockReceiptHeader | null; lines: StockReceiptLine[] }> {
    const header = await this.repository.findHeaderById(id);
    const lines = await this.repository.findLinesByReceiptId(id);
    return { header, lines };
  }
}
