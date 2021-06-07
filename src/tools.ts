import { PlyProperty } from ".";

export function extractBinary(
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

export function copyAscii(property: PlyProperty, value: string) {
  property.getData().push(Number(value));
}

export function copyBinary(
  property: PlyProperty,
  dataView: DataView,
  byteOffset: number,
  littleEndian: boolean
) {
  const parsed = extractBinary(
    property.scalarType,
    dataView,
    byteOffset,
    littleEndian
  );
  property.getData().push(parsed);
}

export function getListLength(
  property: PlyProperty,
  dataView: DataView,
  byteOffset: number
): number {
  if (property.listType) {
    return extractBinary(property.listType, dataView, byteOffset, true);
  }
  throw Error("Property is not a list");
}
