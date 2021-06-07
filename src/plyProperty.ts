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

  public readAscii(value: string) {
    this.itsData.push(Number(value));
  }

  public readBinary(
    dataView: DataView,
    byteOffset: number,
    littleEndian: boolean
  ) {
    const parsed = this.extractBinary(
      this.scalarType,
      dataView,
      byteOffset,
      littleEndian
    );
    this.itsData.push(parsed);
  }

  public extractListLength(dataView: DataView, byteOffset: number): number {
    if (this.listType) {
      return this.extractBinary(this.listType, dataView, byteOffset, true);
    }
    throw Error("Property is not a list");
  }

  public isListProperty(): boolean {
    return this.listType != undefined;
  }

  // ------------ Private methods ------------

  private extractBinary(
    type: string,
    dataView: DataView,
    byteOffset: number,
    littleEndian: boolean = true
  ) {
    switch (type) {
      case "char":
        return dataView.getInt8(byteOffset);
      case "uchar":
        return dataView.getUint8(byteOffset);
      case "short":
        return dataView.getInt16(byteOffset, littleEndian);
      case "ushort":
        return dataView.getUint16(byteOffset, littleEndian);
      case "int":
        return dataView.getInt32(byteOffset, littleEndian);
      case "uint":
        return dataView.getUint32(byteOffset, littleEndian);
      case "float":
        return dataView.getFloat32(byteOffset, littleEndian);
      case "double":
        return dataView.getFloat64(byteOffset, littleEndian);
      default:
        throw Error(`The PLY standard does not support type ${type}`);
    }
  }
}
