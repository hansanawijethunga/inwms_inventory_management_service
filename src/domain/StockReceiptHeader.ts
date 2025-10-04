export enum StockCondition {
  Good = 'Good',
  Damaged = 'Damaged',
  Expired = 'Expired',
}
import { v4 as uuidv4 } from 'uuid';

export interface IStockReceiptHeaderProps {
  id?: string;
  shipmentId: string;
  shipmentNumber: string;
  lotNumber: string;
  inventoryDate: Date;
  companyId: string;
  companyLegalName: string;
  notes?: string;
  createdBy?: string;
  createdAt?: Date;
}

export class StockReceiptHeader {
  public readonly id: string;
  public readonly shipmentId: string;
  public readonly shipmentNumber: string;
  public readonly lotNumber: string;
  public readonly inventoryDate: Date;
  public readonly companyId: string;
  public readonly companyLegalName: string;
  public readonly notes: string | undefined;
  public readonly createdBy: string | undefined;
  public readonly createdAt: Date;

  constructor(props: IStockReceiptHeaderProps) {
    this.id = props.id || uuidv4();
    this.shipmentId = props.shipmentId;
    this.shipmentNumber = props.shipmentNumber;
    this.lotNumber = props.lotNumber;
    this.inventoryDate = props.inventoryDate;
    this.companyId = props.companyId;
    this.companyLegalName = props.companyLegalName;
    this.notes = props.notes;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt || new Date();
  }
}
