export enum InventoryLedgerType {
  RECEIVE = 'RECEIVE',
  REMOVE = 'REMOVE',
  ADJUST = 'ADJUST',
}

export enum StockCondition {
  Good = 'Good',
  Damaged = 'Damaged',
  Expired = 'Expired',
}

export interface IInventoryLedgerProps {
  id?: string;
  timestamp?: Date;
  type: InventoryLedgerType;
  receiptLineId?: string;
  shipmentId?: string;
  shipmentNumber?: string;
  lotNumber?: string;
  companyId: string;
  companyLegalName: string;
  productId: string;
  productName: string;
  productCode: string;
  productAreaM2?: number;
  requiresExpiry?: boolean;
  requiresSerial?: boolean;
  handlingNotes?: string;
  blockId: string;
  blockAddress: string;
  blockAreaM2?: number;
  condition: StockCondition;
  quantity: number;
  uom: string;
  serialNumbers?: string[];
  inventoryDate?: Date;
  expiryDate?: Date;
  productItemsSnapshot?: Array<{ product_item_id: string; itemName: string; itemCode: string }>;
  notes?: string;
  reason?: string;
  createdBy?: string;
  createdAt?: Date;
  idempotencyKey?: string;
}

export class InventoryLedger {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly type: InventoryLedgerType;
  public readonly receiptLineId: string | undefined;
  public readonly shipmentId: string | undefined;
  public readonly shipmentNumber: string | undefined;
  public readonly lotNumber: string | undefined;
  public readonly companyId: string;
  public readonly companyLegalName: string;
  public readonly productId: string;
  public readonly productName: string;
  public readonly productCode: string;
  public readonly productAreaM2: number | undefined;
  public readonly requiresExpiry: boolean | undefined;
  public readonly requiresSerial: boolean | undefined;
  public readonly handlingNotes: string | undefined;
  public readonly blockId: string;
  public readonly blockAddress: string;
  public readonly blockAreaM2: number | undefined;
  public readonly condition: StockCondition;
  public readonly quantity: number;
  public readonly uom: string;
  public readonly serialNumbers: string[] | undefined;
  public readonly inventoryDate: Date | undefined;
  public readonly expiryDate: Date | undefined;
  public readonly productItemsSnapshot: Array<{ product_item_id: string; itemName: string; itemCode: string }> | undefined;
  public readonly notes: string | undefined;
  public readonly reason: string | undefined;
  public readonly createdBy: string | undefined;
  public readonly createdAt: Date;
  public readonly idempotencyKey: string | undefined;

  constructor(props: IInventoryLedgerProps) {
    this.id = props.id || crypto.randomUUID();
    this.timestamp = props.timestamp || new Date();
    this.type = props.type;
    this.receiptLineId = props.receiptLineId;
    this.shipmentId = props.shipmentId;
    this.shipmentNumber = props.shipmentNumber;
    this.lotNumber = props.lotNumber;
    this.companyId = props.companyId;
    this.companyLegalName = props.companyLegalName;
    this.productId = props.productId;
    this.productName = props.productName;
    this.productCode = props.productCode;
    this.productAreaM2 = props.productAreaM2;
    this.requiresExpiry = props.requiresExpiry;
    this.requiresSerial = props.requiresSerial;
    this.handlingNotes = props.handlingNotes;
    this.blockId = props.blockId;
    this.blockAddress = props.blockAddress;
    this.blockAreaM2 = props.blockAreaM2;
    this.condition = props.condition;
    this.quantity = props.quantity;
    this.uom = props.uom;
    this.serialNumbers = props.serialNumbers;
    this.inventoryDate = props.inventoryDate;
    this.expiryDate = props.expiryDate;
    this.productItemsSnapshot = props.productItemsSnapshot;
    this.notes = props.notes;
    this.reason = props.reason;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt || new Date();
    this.idempotencyKey = props.idempotencyKey;
  }
}
