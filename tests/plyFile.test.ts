import { PlyFile, PlyFormat } from "../src/plyFile";
import { PlyElement, PlyProperty } from "../src/plyMetadata";
import { testPly } from "./testply";

describe("A PlyFile created from a string should", () => {
  let ply: PlyFile;

  beforeEach(() => {
    ply = new PlyFile(testPly);
  });

  it("return comments", () => {
    expect(ply.comments).toEqual(["author: Greg Turk", "object: another cube"]);
  });

  it("return format info", () => {
    expect(ply.format).toEqual(new PlyFormat("ascii", "1.0", ""));
  });

  it("have elements", () => {
    expect(ply.hasElement("vertex")).toBeTrue();
    expect(ply.hasElement("face")).toBeTrue();
    expect(ply.hasElement("edge")).toBeTrue();
    expect(ply.hasElement("foo")).toBeFalse();
  });

  it("return element names", () => {
    expect(ply.elementNames()).toEqual(["vertex", "face", "edge"]);
  });

  describe("return elements", () => {
    it("which have properties", () => {
      expect(ply.getElement("vertex").hasProperty("x")).toBeTrue();
      expect(ply.getElement("vertex").hasProperty("y")).toBeTrue();
      expect(ply.getElement("vertex").hasProperty("z")).toBeTrue();
      expect(ply.getElement("vertex").hasProperty("red")).toBeTrue();
      expect(ply.getElement("vertex").hasProperty("green")).toBeTrue();
      expect(ply.getElement("vertex").hasProperty("blue")).toBeTrue();

      expect(ply.getElement("face").hasProperty("vertex_index")).toBeTrue();

      expect(ply.getElement("edge").hasProperty("vertex1")).toBeTrue();
      expect(ply.getElement("edge").hasProperty("vertex2")).toBeTrue();
      expect(ply.getElement("edge").hasProperty("red")).toBeTrue();
      expect(ply.getElement("edge").hasProperty("green")).toBeTrue();
      expect(ply.getElement("edge").hasProperty("blue")).toBeTrue();
    });

    it("which return property names", () => {
      expect(ply.getElement("vertex").properyNames()).toEqual([
        "x",
        "y",
        "z",
        "red",
        "green",
        "blue",
      ]);
      expect(ply.getElement("face").properyNames()).toEqual(["vertex_index"]);
      expect(ply.getElement("edge").properyNames()).toEqual([
        "vertex1",
        "vertex2",
        "red",
        "green",
        "blue",
      ]);
    });

    describe("return properties", () => {
      let vertex: PlyElement;
      let face: PlyElement;
      let edge: PlyElement;

      beforeEach(() => {
        vertex = ply.getElement("vertex");
        face = ply.getElement("face");
        edge = ply.getElement("edge");
      });

      it("which return isListProperty", () => {
        expect(vertex.getProperty("x").isListProperty()).toBeFalse();
        expect(vertex.getProperty("y").isListProperty()).toBeFalse();
        expect(vertex.getProperty("z").isListProperty()).toBeFalse();
        expect(vertex.getProperty("red").isListProperty()).toBeFalse();
        expect(vertex.getProperty("green").isListProperty()).toBeFalse();
        expect(vertex.getProperty("blue").isListProperty()).toBeFalse();

        expect(face.getProperty("vertex_index").isListProperty()).toBeTrue();

        expect(edge.getProperty("vertex1").isListProperty()).toBeFalse();
        expect(edge.getProperty("vertex1").isListProperty()).toBeFalse();
        expect(edge.getProperty("red").isListProperty()).toBeFalse();
        expect(edge.getProperty("green").isListProperty()).toBeFalse();
        expect(edge.getProperty("blue").isListProperty()).toBeFalse();
      });

      it("which return numerical data", () => {
        expect(vertex.getProperty("x").data).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
        expect(vertex.getProperty("y").data).toEqual([0, 0, 1, 1, 0, 0, 1, 1]);
        expect(vertex.getProperty("z").data).toEqual([0, 1, 1, 0, 0, 1, 1, 0]);

        expect(face.getProperty("vertex_index").data).toEqual([
          0, 1, 2, 0, 2, 3, 7, 6, 5, 4, 0, 4, 5, 1, 1, 5, 6, 2, 2, 6, 7, 3, 3,
          7, 4, 0,
        ]);

        expect(edge.getProperty("vertex1").data).toEqual([0, 1, 2, 3, 2]);
        expect(edge.getProperty("vertex2").data).toEqual([1, 2, 3, 0, 0]);
      });
    });
  });
});

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
*/
