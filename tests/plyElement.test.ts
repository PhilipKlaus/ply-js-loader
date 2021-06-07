import { PlyElement, PlyProperty } from "../src";

describe("A PlyElement should", () => {
  let element: PlyElement;
  beforeEach(() => {
    element = new PlyElement("vertex", 3);
  });

  it("return its name", () => {
    expect(element.name).toEqual("vertex");
  });

  it("return its property amount", () => {
    expect(element.amount).toEqual(3);
  });

  it("store PlyProperties", () => {
    expect(element.hasProperty("x")).toBeFalse();
    element.addProperty(new PlyProperty("x", "float"));
    expect(element.getProperty("x")).toEqual(new PlyProperty("x", "float"));
    expect(element.hasProperty("x")).toBeTrue();
  });

  it("return names of stored PlyProperties", () => {
    element.addProperty(new PlyProperty("x", "float"));
    element.addProperty(new PlyProperty("y", "float"));
    element.addProperty(new PlyProperty("z", "float"));
    expect(element.properyNames()).toEqual(["x", "y", "z"]);
  });

  it("parse an ascii property line", () => {
    element.addProperty(new PlyProperty("prop1", "float"));
    element.addProperty(new PlyProperty("prop2", "int", "uchar"));
    element.addProperty(new PlyProperty("prop3", "uchar"));

    element.parseAscii("1.0 3 1 2 3 10");
    element.parseAscii("10.0 2 10 20 100");

    expect(element.getProperty("prop1").getData()).toEqual([1.0, 10.0]);
    expect(element.getProperty("prop2").getData()).toEqual([1, 2, 3, 10, 20]);
    expect(element.getProperty("prop3").getData()).toEqual([10, 100]);
  });

  /*element.addProperty("x", new PlyProperty("x", "float", false));
  element.addProperty("y", new PlyProperty("y", "float", false));
  element.addProperty("z", new PlyProperty("z", "float", false));

  it("return property names", () => {
    expect(element.properyNames()).toEqual(["x", "y", "z"]);
  });

  it("have correct properties", () => {
    expect(element.hasProperty("x")).toBeTrue();
    expect(element.hasProperty("y")).toBeTrue();
    expect(element.hasProperty("z")).toBeTrue();
    expect(element.hasProperty("foo")).toBeFalse();
  });*/
});
