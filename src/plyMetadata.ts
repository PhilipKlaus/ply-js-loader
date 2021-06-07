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

  public get data() {
    return this.itsData;
  }

  public set data(newData: Array<number>) {
    this.itsData = newData;
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
        return 0;
      // do nothing
    }
  }

  public isListProperty(): boolean {
    return this.listType != undefined;
  }
}

export class PlyElement {
  private itsProperties: Map<string, PlyProperty>;
  constructor(public name: string, public amount: number) {
    this.itsProperties = new Map<string, PlyProperty>();
  }

  public addProperty(property: PlyProperty) {
    this.itsProperties.set(property.name, property);
  }

  public getProperty(propertyName: string): PlyProperty {
    const prop = this.itsProperties.get(propertyName);
    if (prop) {
      return prop;
    }
    throw new Error(`Property ${propertyName} not existing`);
  }

  public properyNames(): Array<string> {
    return Array.from(this.itsProperties.keys());
  }

  public hasProperty(property: string): boolean {
    return this.properyNames().includes(property);
  }

  public parseAscii(data: string) {
    const parts = data.split(" ");
    let i = 0;
    for (const [key, prop] of this.itsProperties.entries()) {
      if (prop.isListProperty()) {
        const list_len = Number(parts[i++]);
        for (let j = 0; j < list_len; ++j) {
          prop.readAscii(parts[i++]);
        }
      } else {
        prop.readAscii(parts[i++]);
      }
    }
  }
}
