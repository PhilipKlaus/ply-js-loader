export class PlyProperty {
  private itsData: Array<number> = new Array();
  private itsName: string;
  private itsType: string;
  private itsListLenType: string | undefined;

  constructor(name: string, scalarType: string, listType?: string) {
    this.itsName = name;
    this.itsType = scalarType;
    this.itsListLenType = listType;
  }

  public getName(): string {
    return this.itsName;
  }

  public getType(): string {
    return this.itsType;
  }

  public getListLenType(): string | undefined {
    return this.itsListLenType;
  }

  public getData(): Array<number> {
    return this.itsData;
  }

  public getDataCopy(): Array<number> {
    return [...this.itsData];
  }

  public setData(data: Array<number>) {
    this.itsData = data;
  }

  public isListProperty(): boolean {
    return this.itsListLenType != undefined;
  }
}
