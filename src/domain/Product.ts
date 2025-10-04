export interface IProductProps {
  productId: string;
  name: string;
  code: string;
  areaM2?: number;
  requiresExpiry: boolean;
  requiresSerial: boolean;
  handlingNotes?: string;
}

export class Product {
  public readonly productId: string;
  public readonly name: string;
  public readonly code: string;
  public readonly areaM2: number | undefined;
  public readonly requiresExpiry: boolean;
  public readonly requiresSerial: boolean;
  public readonly handlingNotes: string | undefined;

  constructor(props: IProductProps) {
    this.productId = props.productId;
    this.name = props.name;
    this.code = props.code;
    this.areaM2 = props.areaM2;
    this.requiresExpiry = props.requiresExpiry;
    this.requiresSerial = props.requiresSerial;
    this.handlingNotes = props.handlingNotes;
  }
}
