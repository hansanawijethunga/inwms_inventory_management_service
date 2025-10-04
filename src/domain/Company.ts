export interface ICompanyProps {
  companyId: string;
  legalName: string;
}

export class Company {
  public readonly companyId: string;
  public readonly legalName: string;

  constructor(props: ICompanyProps) {
    this.companyId = props.companyId;
    this.legalName = props.legalName;
  }
}
