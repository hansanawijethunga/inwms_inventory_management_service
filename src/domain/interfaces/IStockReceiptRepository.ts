import { StockReceiptHeader } from '../StockReceiptHeader.js';
import { StockReceiptLine } from '../StockReceiptLine.js';

export interface IStockReceiptRepository {
  saveHeader(header: StockReceiptHeader): Promise<void>;
  saveLine(line: StockReceiptLine): Promise<void>;
  findHeaderById(id: string): Promise<StockReceiptHeader | null>;
  findLinesByReceiptId(receiptId: string): Promise<StockReceiptLine[]>;
}
