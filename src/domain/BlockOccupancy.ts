export interface IBlockOccupancyProps {
  blockId: string;
  blockAddress: string;
  blockAreaM2?: number;
  companyId: string;
  occupiedAreaM2: number;
  remainingAreaM2: number;
  lastUpdatedAt?: Date;
}

export class BlockOccupancy {
  public readonly blockId: string;
  public readonly blockAddress: string;
  public readonly blockAreaM2: number | undefined;
  public readonly companyId: string;
  public readonly occupiedAreaM2: number;
  public readonly remainingAreaM2: number;
  public readonly lastUpdatedAt: Date;

  constructor(props: IBlockOccupancyProps) {
    this.blockId = props.blockId;
    this.blockAddress = props.blockAddress;
    this.blockAreaM2 = props.blockAreaM2;
    this.companyId = props.companyId;
    this.occupiedAreaM2 = props.occupiedAreaM2;
    this.remainingAreaM2 = props.remainingAreaM2;
    this.lastUpdatedAt = props.lastUpdatedAt || new Date();
  }
}
