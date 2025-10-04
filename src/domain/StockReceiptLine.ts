import { v4 as uuidv4 } from 'uuid';
import { StockCondition } from './StockReceiptHeader.js';

export interface IStockReceiptLineProps {
  id?: string;
  receiptId: string;
  productId: string;
  productName: string;
  productCode: string;
  productAreaM2?: number;
  requiresExpiry: boolean;
  requiresSerial: boolean;
  handlingNotes?: string;
  quantity: number;
  uom: string;
  serialNumbers?: string[];
  blockId: string;
  blockAddress: string;
  blockAreaM2?: number;
  condition: StockCondition;
  expiryDate?: Date;
  productItemsSnapshot?: Array<{ product_item_id: string; itemName: string; itemCode: string }>;
  createdAt?: Date;
}

export class StockReceiptLine {
  public readonly id: string;
  public readonly receiptId: string;
  public readonly productId: string;
  public readonly productName: string;
  public readonly productCode: string;
  public readonly productAreaM2: number | undefined;
  public readonly requiresExpiry: boolean;
  public readonly requiresSerial: boolean;
  public readonly handlingNotes: string | undefined;
  public readonly quantity: number;
  public readonly uom: string;
  public readonly serialNumbers: string[] | undefined;
  public readonly blockId: string;
  public readonly blockAddress: string;
  public readonly blockAreaM2: number | undefined;
  public readonly condition: StockCondition;
  public readonly expiryDate: Date | undefined;
  public readonly productItemsSnapshot: Array<{ product_item_id: string; itemName: string; itemCode: string }> | undefined;
  public readonly createdAt: Date;

  constructor(props: IStockReceiptLineProps) {
    this.id = props.id || uuidv4();
    this.receiptId = props.receiptId;
    this.productId = props.productId;
    this.productName = props.productName;
    this.productCode = props.productCode;
    this.productAreaM2 = props.productAreaM2;
    this.requiresExpiry = props.requiresExpiry;
    this.requiresSerial = props.requiresSerial;
    this.handlingNotes = props.handlingNotes;
    this.quantity = props.quantity;
    this.uom = props.uom;
    this.serialNumbers = props.serialNumbers;
    this.blockId = props.blockId;
    this.blockAddress = props.blockAddress;
    this.blockAreaM2 = props.blockAreaM2;
    this.condition = props.condition;
    this.expiryDate = props.expiryDate;
    this.productItemsSnapshot = props.productItemsSnapshot;
    this.createdAt = props.createdAt || new Date();
  }
}
