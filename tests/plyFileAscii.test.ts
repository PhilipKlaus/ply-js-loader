import { PlyElement, PlyFile } from "../src";
import { PlyFormat } from "../src/plyFile";
import { testPly } from "./testply";

describe("A PlyFile created from a string should", () => {
  let ply: PlyFile;

  beforeEach(() => {
    ply = new PlyFile(testPly);
  });

  it("return comments", () => {
    expect(ply.getComments()).toEqual([
      "author: Greg Turk",
      "object: another cube",
    ]);
  });

  it("return format info", () => {
    const expected: PlyFormat = {
      type: "ascii",
      version: "1.0",
      endianness: "",
    };
    expect(ply.getFormat()).toEqual(expected);
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

  it("should throw an Error when getElement is called with an non-existing element name", () => {
    expect(() => {
      ply.getElement("foo");
    }).toThrow();
  });

  it("return vertex positions", () => {
    expect(ply.getVertexPositions()).toEqual(
      new Float32Array([
        0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0,
      ])
    );
  });

  it("return vertex colors", () => {
    expect(ply.getVertexColors()).toEqual(
      new Uint8Array([
        255, 0, 0, 255, 0, 0, 255, 0, 0, 255, 0, 0, 0, 0, 255, 0, 0, 255, 0, 0,
        255, 0, 0, 255,
      ])
    );
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
        expect(vertex.getProperty("x").getData()).toEqual(
          new Float32Array([0, 0, 0, 0, 1, 1, 1, 1])
        );
        expect(vertex.getProperty("y").getData()).toEqual(
          new Float32Array([0, 0, 1, 1, 0, 0, 1, 1])
        );
        expect(vertex.getProperty("z").getData()).toEqual(
          new Float32Array([0, 1, 1, 0, 0, 1, 1, 0])
        );
        expect(vertex.getProperty("red").getData()).toEqual(
          new Uint8Array([255, 255, 255, 255, 0, 0, 0, 0])
        );
        expect(vertex.getProperty("green").getData()).toEqual(
          new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0])
        );
        expect(vertex.getProperty("blue").getData()).toEqual(
          new Uint8Array([0, 0, 0, 0, 255, 255, 255, 255])
        );

        expect(face.getProperty("vertex_index").getData()).toEqual(
          new Int32Array([
            0, 1, 2, 0, 2, 3, 7, 6, 5, 4, 0, 4, 5, 1, 1, 5, 6, 2, 2, 6, 7, 3, 3,
            7, 4, 0,
          ])
        );

        expect(edge.getProperty("vertex1").getData()).toEqual(
          new Int32Array([0, 1, 2, 3, 2])
        );
        expect(edge.getProperty("vertex2").getData()).toEqual(
          new Int32Array([1, 2, 3, 0, 0])
        );
      });
    });
  });
});
