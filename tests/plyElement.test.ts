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

  it("throw an Error when getProperty is called with an invalid property name", () => {
    element.addProperty(new PlyProperty("x", "float"));
    expect(() => {
      element.getProperty("x");
    }).not.toThrow();
    expect(() => {
      element.getProperty("invalid");
    }).toThrow();
  });
});
