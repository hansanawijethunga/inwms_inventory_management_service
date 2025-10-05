import { StockReceiptHeader } from '../StockReceiptHeader.js';
import { StockReceiptLine } from '../StockReceiptLine.js';

export interface IStockReceiptRepository {
  saveHeader(header: StockReceiptHeader, sqlOrTx?: any): Promise<void>;
  saveLine(line: StockReceiptLine, sqlOrTx?: any): Promise<void>;
  findHeaderById(id: string, sqlOrTx?: any): Promise<StockReceiptHeader | null>;
  findLinesByReceiptId(receiptId: string, sqlOrTx?: any): Promise<StockReceiptLine[]>;
  findByShipmentId?(shipmentId: string, sqlOrTx?: any): Promise<StockReceiptHeader[]>;
  findByLotNumber?(lotNumber: string, sqlOrTx?: any): Promise<StockReceiptHeader[]>;
}
