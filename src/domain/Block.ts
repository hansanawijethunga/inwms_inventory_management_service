export interface IBlockProps {
  blockId: string;
  address: string;
  areaM2?: number;
}

export class Block {
  public readonly blockId: string;
  public readonly address: string;
  public readonly areaM2: number | undefined;

  constructor(props: IBlockProps) {
    this.blockId = props.blockId;
    this.address = props.address;
    this.areaM2 = props.areaM2;
  }
}
