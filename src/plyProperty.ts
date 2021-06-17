import { toTypedArray } from "./tools";

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

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

  public getData(): TypedArray {
    return toTypedArray(this.itsType, this.itsData);
  }

  public push(value: number) {
    this.itsData.push(value);
  }

  public setData(data: Array<number>) {
    this.itsData = data;
  }

  public isListProperty(): boolean {
    return this.itsListLenType != undefined;
  }
}
