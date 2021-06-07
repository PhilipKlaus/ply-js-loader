import { PlyProperty } from "../src";

describe("A PlyProperty should", () => {
  let property: PlyProperty;

  beforeEach(() => {
    property = new PlyProperty("x", "float");
  });

  it("return its name", () => {
    expect(property.getName()).toEqual("x");
  });

  it("return its scalar type", () => {
    expect(property.getType()).toEqual("float");
  });

  it("return false when calling isListProperty", () => {
    expect(property.isListProperty()).toBeFalse();
    expect(new PlyProperty("x", "float", "int").isListProperty()).toBeTrue();
  });

  it("return its list length type", () => {
    expect(property.getListLenType()).toBeUndefined;
    expect(new PlyProperty("x", "float", "int").getListLenType()).toEqual(
      "int"
    );
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
});
