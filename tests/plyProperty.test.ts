import { PlyProperty } from "../src/plyMetadata";

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
    expect(property.data.length).toEqual(0);
  });

  it("set new data", () => {
    property.data = [1, 2, 3];
    expect(property.data).toEqual([1, 2, 3]);
  });

  it("read ascii data", () => {});
  /*
  it("have correct properties", () => {
    expect(element.hasProperty("x")).toBeTrue();
    expect(element.hasProperty("y")).toBeTrue();
    expect(element.hasProperty("z")).toBeTrue();
    expect(element.hasProperty("foo")).toBeFalse();
  });*/
});
