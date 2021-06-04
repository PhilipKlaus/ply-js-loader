import { PlyElement, PlyProperty } from "../src/plyMetadata";

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

    expect(element.getProperty("prop1").data).toEqual([1.0, 10.0]);
    expect(element.getProperty("prop2").data).toEqual([1, 2, 3, 10, 20]);
    expect(element.getProperty("prop3").data).toEqual([10, 100]);
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

/*import * as ply from "../src";
import { PlyElement, PlyProperty } from "../src/plyMetadata";

describe("A PlyElement should", () => {
  let element = new PlyElement("vertex", 3);
  element.addProperty("x", new PlyProperty("x", "float", false));
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
  });
});
*/
/*
const testPly: string = `ply
format ascii 1.0
comment author: Greg Turk
comment object: another cube
element vertex 8
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
element face 7
property list uchar int vertex_index
element edge 5
property int vertex1
property int vertex2
property uchar red
property uchar green
property uchar blue
end_header
0 0 0 255 0 0
0 0 1 255 0 0
0 1 1 255 0 0
0 1 0 255 0 0
1 0 0 0 0 255
1 0 1 0 0 255
1 1 1 0 0 255
1 1 0 0 0 255
3 0 1 2
3 0 2 3
4 7 6 5 4
4 0 4 5 1
4 1 5 6 2
4 2 6 7 3
4 3 7 4 0
0 1 255 255 255
1 2 255 255 255
2 3 255 255 255
3 0 255 255 255
2 0 0 0 0`;

describe("A ply string with an invalid header should", () => {
  it("throw an Error exeption when end_header is missing", () => {
    expect(() => {
      ply.loadFromString("");
    }).toThrow();
  });
});

describe("A PlyAscii object should", function () {
  let plyFile: ply.PlyAscii;

  beforeEach(function () {
    plyFile = ply.loadFromString(testPly);
  });

  it("have comments", () => {
    expect(plyFile.comments()).toEqual([
      "author: Greg Turk",
      "object: another cube",
    ]);
  });

  it("have a format", () => {
    expect(plyFile.format().format).toEqual("ascii");
    expect(plyFile.format().endianness).toEqual("");
    expect(plyFile.format().version).toEqual("1.0");
  });

  it("have elements", () => {
    expect(plyFile.elementNames()).toEqual(["vertex", "face", "edge"]);
    expect(plyFile.hasElement("vertex")).toBeTrue();
    expect(plyFile.hasElement("face")).toBeTrue();
    expect(plyFile.hasElement("edge")).toBeTrue();
    expect(plyFile.hasElement("invalid")).toBeFalse();
  });

  it("not throw an error when calling getElement", () => {
    expect(() => {
      plyFile.getElement("vertex");
    }).not.toThrow();
    expect(() => {
      plyFile.getElement("face");
    }).not.toThrow();
    expect(() => {
      plyFile.getElement("edge");
    }).not.toThrow();
  });

  it("return the correct property names", () => {
    expect(plyFile.getElement("vertex").properyNames()).toEqual([
      "x",
      "y",
      "z",
      "red",
      "green",
      "blue",
    ]);
    expect(plyFile.getElement("face").properyNames()).toEqual(["vertex_index"]);
    expect(plyFile.getElement("edge").properyNames()).toEqual([
      "vertex1",
      "vertex2",
      "red",
      "green",
      "blue",
    ]);
  });
});
*/
