import { PlyProperty } from "../src";
import {
  copyAscii,
  copyBinary,
  createTypedArray,
  extractBinary,
  getListLength,
  toTypedArray,
} from "../src/tools";

it("When calling copyAscii a property should return correct data", () => {
  const prop = new PlyProperty("x", "float");
  copyAscii(prop, "100.5");
  copyAscii(prop, "200.5");
  copyAscii(prop, "300.5");
  expect(prop.getData()).toEqual(new Float32Array([100.5, 200.5, 300.5]));
});

it("When calling copyBinary a property should return correct data", () => {
  const prop = new PlyProperty("x", "float");
  const dataView = new DataView(new Float32Array([100.5, 200.5, 300.5]).buffer);
  copyBinary(prop, dataView, 0, true);
  copyBinary(prop, dataView, 4, true);
  copyBinary(prop, dataView, 8, true);
});

it("When calling getListLength on a non-list property an Error should be thrown", () => {
  const prop = new PlyProperty("x", "float");
  const dataView = new DataView(new Uint8Array([3]).buffer);
  expect(() => {
    getListLength(prop, dataView, 0);
  }).toThrow();
});

it("When calling getListLength on a list property the list length should be returned", () => {
  const prop = new PlyProperty("x", "float", "uchar");
  const dataView = new DataView(new Uint8Array([3]).buffer);
  expect(getListLength(prop, dataView, 0)).toEqual(3);
});

it("When extractBinary is called it should return correct data", () => {
  // char
  let dataView = new DataView(new Int8Array([127]).buffer);
  expect(extractBinary("char", dataView, 0, true)).toEqual(127);
  // uchar
  dataView = new DataView(new Uint8Array([255]).buffer);
  expect(extractBinary("uchar", dataView, 0, true)).toEqual(255);
  // short
  dataView = new DataView(new Int16Array([32767]).buffer);
  expect(extractBinary("short", dataView, 0, true)).toEqual(32767);
  // ushort
  dataView = new DataView(new Uint16Array([65535]).buffer);
  expect(extractBinary("ushort", dataView, 0, true)).toEqual(65535);
  // int
  dataView = new DataView(new Int32Array([2147483647]).buffer);
  expect(extractBinary("int", dataView, 0, true)).toEqual(2147483647);
  // uint
  dataView = new DataView(new Uint32Array([4294967295]).buffer);
  expect(extractBinary("uint", dataView, 0, true)).toEqual(4294967295);
  // float
  dataView = new DataView(new Float32Array([0.0001]).buffer);
  expect(extractBinary("float", dataView, 0, true)).toBeCloseTo(0.0001);
  // double
  dataView = new DataView(new Float64Array([0.0001]).buffer);
  expect(extractBinary("double", dataView, 0, true)).toBeCloseTo(0.0001);
});

it("When extractBinary is called with an invalid type an Error should be thrown", () => {
  const dataView = new DataView(new Int8Array([127]).buffer);
  expect(() => {
    extractBinary("invalid", dataView, 0, true);
  }).toThrow();
});

it("When toTypedArray is called it should return a TypedArray", () => {
  const data = [1, 2, 3];
  expect(toTypedArray("char", data)).toEqual(new Int8Array([1, 2, 3]));
  expect(toTypedArray("uchar", data)).toEqual(new Uint8Array([1, 2, 3]));
  expect(toTypedArray("short", data)).toEqual(new Int16Array([1, 2, 3]));
  expect(toTypedArray("ushort", data)).toEqual(new Uint16Array([1, 2, 3]));
  expect(toTypedArray("int", data)).toEqual(new Int32Array([1, 2, 3]));
  expect(toTypedArray("uint", data)).toEqual(new Uint32Array([1, 2, 3]));
  expect(toTypedArray("float", data)).toEqual(new Float32Array([1, 2, 3]));
  expect(toTypedArray("double", data)).toEqual(new Float64Array([1, 2, 3]));
});

it("When toTypedArray is called with an invalid type an Error should be thrown", () => {
  const data = [1, 2, 3];
  expect(() => {
    toTypedArray("invalid", data);
  }).toThrow();
});

it("When createTypedArray is called it should return a TypedArray", () => {
  expect(createTypedArray("char")).toEqual(new Int8Array());
  expect(createTypedArray("uchar")).toEqual(new Uint8Array());
  expect(createTypedArray("short")).toEqual(new Int16Array());
  expect(createTypedArray("ushort")).toEqual(new Uint16Array());
  expect(createTypedArray("int")).toEqual(new Int32Array());
  expect(createTypedArray("uint")).toEqual(new Uint32Array());
  expect(createTypedArray("float")).toEqual(new Float32Array());
  expect(createTypedArray("double")).toEqual(new Float64Array());
});

it("When createTypedArray is called with an invalid type an Error should be thrown", () => {
  expect(() => {
    createTypedArray("invalid", 10);
  }).toThrow();
});
