import { v4 as uuidv4 } from 'uuid';

export interface IInventoryBalanceProps {
  id?: string;
  companyId: string;
  productId: string;
  productName: string;
  productCode: string;
  blockId: string;
  blockAddress: string;
  condition: string;
  expiryDate?: Date;
  onHand: number;
  reserved?: number;
  available: number;
  uom: string;
  lastUpdatedAt?: Date;
}

export class InventoryBalance {
  public readonly id: string;
  public readonly companyId: string;
  public readonly productId: string;
  public readonly productName: string;
  public readonly productCode: string;
  public readonly blockId: string;
  public readonly blockAddress: string;
  public readonly condition: string;
  public readonly expiryDate: Date | undefined;
  public readonly onHand: number;
  public readonly reserved: number | undefined;
  public readonly available: number;
  public readonly uom: string;
  public readonly lastUpdatedAt: Date;

  constructor(props: IInventoryBalanceProps) {
    this.id = props.id || uuidv4();
    this.companyId = props.companyId;
    this.productId = props.productId;
    this.productName = props.productName;
    this.productCode = props.productCode;
    this.blockId = props.blockId;
    this.blockAddress = props.blockAddress;
    this.condition = props.condition;
    this.expiryDate = props.expiryDate;
    this.onHand = props.onHand;
    this.reserved = props.reserved;
    this.available = props.available;
    this.uom = props.uom;
    this.lastUpdatedAt = props.lastUpdatedAt || new Date();
  }
}
