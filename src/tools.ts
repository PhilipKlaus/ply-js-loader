import { PlyProperty } from ".";
import { TypedArray } from "./plyProperty";

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

export function extractBinary(
  type: string,
  dataView: DataView,
  byteOffset: number,
  littleEndian = true
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

export function createTypedArray(type: string, length = 0) {
  switch (type) {
    case "char":
      return new Int8Array(length);
    case "uchar":
      return new Uint8Array(length);
    case "short":
      return new Int16Array(length);
    case "ushort":
      return new Uint16Array(length);
    case "int":
      return new Int32Array(length);
    case "uint":
      return new Uint32Array(length);
    case "float":
      return new Float32Array(length);
    case "double":
      return new Float64Array(length);
    default:
      throw Error(`The PLY standard does not support type ${type}`);
  }
}

export function toTypedArray(type: string, array: Array<number>): TypedArray {
  switch (type) {
    case "char":
      return Int8Array.from(array);
    case "uchar":
      return Uint8Array.from(array);
    case "short":
      return Int16Array.from(array);
    case "ushort":
      return Uint16Array.from(array);
    case "int":
      return Int32Array.from(array);
    case "uint":
      return Uint32Array.from(array);
    case "float":
      return Float32Array.from(array);
    case "double":
      return Float64Array.from(array);
    default:
      throw Error(`The PLY standard does not support type ${type}`);
  }
}

export function copyAscii(property: PlyProperty, value: string) {
  property.push(Number(value));
}

export function copyBinary(
  property: PlyProperty,
  dataView: DataView,
  byteOffset: number,
  littleEndian: boolean
) {
  const parsed = extractBinary(
    property.getType(),
    dataView,
    byteOffset,
    littleEndian
  );
  property.push(parsed);
}

export function getListLength(
  property: PlyProperty,
  dataView: DataView,
  byteOffset: number
): number {
  const listLenType = property.getListLenType();
  if (listLenType) {
    return extractBinary(listLenType, dataView, byteOffset, true);
  }
  throw Error("Property is not a list");
}
