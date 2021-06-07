import { PlyProperty } from "../src";

describe("A PlyProperty should", () => {
  let property: PlyProperty;

  beforeEach(() => {
    property = new PlyProperty("x", "float");
  });

  it("return its name", () => {
    expect(property.name).toEqual("x");
  });

  it("return its scalar type", () => {
    expect(property.scalarType).toEqual("float");
  });

  it("return false when calling isListProperty", () => {
    expect(property.isListProperty()).toBeFalse();
    expect(new PlyProperty("x", "float", "int").isListProperty()).toBeTrue();
  });

  it("return its list type", () => {
    expect(property.listType).toBeUndefined;
    expect(new PlyProperty("x", "float", "int").listType).toEqual("int");
  });

  it("return empty data after instantiating", () => {
    expect(property.getData().length).toEqual(0);
  });

  it("set and get data", () => {
    // Test returning data as reference
    property.setData([1, 2, 3]);
    expect(property.getData()).toEqual([1, 2, 3]);
    property.getData()[0] = 4;
    expect(property.getData()).toEqual([4, 2, 3]);

    // Test returning data as copy
    property.setData([1, 2, 3]);
    expect(property.getData()).toEqual([1, 2, 3]);
    property.getDataCopy()[0] = 4;
    expect(property.getData()).toEqual([1, 2, 3]);
  });

  it("read ascii data", () => {
    property.readAscii("100.5");
    property.readAscii("200.5");
    property.readAscii("300.5");
    expect(property.getData()).toEqual([100.5, 200.5, 300.5]);
  });

  it("read binary data", () => {
    const dataView = new DataView(
      new Float32Array([100.5, 200.5, 300.5]).buffer
    );
    property.readBinary(dataView, 0, true);
    property.readBinary(dataView, 4, true);
    property.readBinary(dataView, 8, true);
    expect(property.getData()).toEqual([100.5, 200.5, 300.5]);
  });

  it("throw when extractListLength is called on a non-list property", () => {
    const dataView = new DataView(new Uint8Array([3]).buffer);
    expect(() => {
      property.extractListLength(dataView, 0);
    }).toThrow();
  });

  it("return the list length when extractListLength is called on a list property", () => {
    const listProp = new PlyProperty("list", "float", "uchar");
    const dataView = new DataView(new Uint8Array([3]).buffer);
    expect(listProp.extractListLength(dataView, 0)).toEqual(3);
  });
});
