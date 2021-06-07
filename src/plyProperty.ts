export const ByteSizes: Map<string, number> = new Map([
  ["char", 1],
  ["uchar", 1],
  ["short", 2],
  ["ushort", 2],
  ["int", 4],
  ["uint4", 4],
  ["float", 4],
  ["double", 8],
]);

export class PlyProperty {
  public itsData: Array<number> = new Array();
  constructor(
    public name: string,
    public scalarType: string,
    public listType?: string
  ) {}

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
    return this.listType != undefined;
  }
}
