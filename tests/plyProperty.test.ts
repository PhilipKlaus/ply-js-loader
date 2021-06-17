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
    property.setData([1, 2, 3]);
    expect(property.getData()).toEqual(new Float32Array([1, 2, 3]));
    property.setData([4, 5, 6]);
    expect(property.getData()).toEqual(new Float32Array([4, 5, 6]));
  });

  it("push and get data", () => {
    property.push(1);
    expect(property.getData()).toEqual(new Float32Array([1]));
    property.push(2);
    expect(property.getData()).toEqual(new Float32Array([1, 2]));
    property.push(3);
    expect(property.getData()).toEqual(new Float32Array([1, 2, 3]));
  });
});
