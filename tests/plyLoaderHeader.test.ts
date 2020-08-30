import { PlyFile, PlyElement, PlyMetadata, PlyProperty } from "../src";

const testPly: string = 
`ply
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
2 0 0 0 0`

describe("After loading a ply file a PlyFile object", function() {

  let plyFile: PlyFile;
  let plyMetadata: PlyMetadata;

  beforeEach(function() {
    plyFile = PlyFile.loadFromString(testPly);
    plyMetadata = plyFile.metadata;
  });

    it("has comments", function() {
      const comments: string[] = plyMetadata.comments;
      expect(comments).toEqual([
        "author: Greg Turk",
        "object: another cube"
      ]);
    });

    it("has format", function() {
      expect(plyMetadata.format).toEqual("ascii");
    });

    it("has formatVersion", function() {
      expect(plyMetadata.formatVersion).toEqual(1.0);
    });

    it("has formatEndianess", function() {
      expect(plyMetadata.formatEndianness).toEqual("little_endian");
    });

    describe("has elements which", function() {

      it("have element names", function() {
        expect(plyMetadata.elements[0].name).toEqual("vertex");
        expect(plyMetadata.elements[1].name).toEqual("face");
        expect(plyMetadata.elements[2].name).toEqual("edge");
      });

      it("have element counts", function() {
        expect(plyMetadata.elements[0].count).toEqual(8);
        expect(plyMetadata.elements[1].count).toEqual(7);
        expect(plyMetadata.elements[2].count).toEqual(5);
      });

      it("have hasListProperties", function() {
        expect(plyMetadata.elements[0].hasListProperty).toEqual(false);
        expect(plyMetadata.elements[1].hasListProperty).toEqual(true);
        expect(plyMetadata.elements[2].hasListProperty).toEqual(false);
      });

      it("have properties", function() {
        expect(plyMetadata.elements[0].properties.size).toEqual(6);
        expect(plyMetadata.elements[1].properties.size).toEqual(1);
        expect(plyMetadata.elements[2].properties.size).toEqual(5);
      });
  
    });
    
    describe("has properties which", function() {
      
      it("have names", function() {
        expect((plyMetadata.elements[0].properties.get("x") as PlyProperty).name).toEqual("x");
        expect((plyMetadata.elements[0].properties.get("y") as PlyProperty).name).toEqual("y");
        expect((plyMetadata.elements[0].properties.get("z") as PlyProperty).name).toEqual("z");
        expect((plyMetadata.elements[0].properties.get("red") as PlyProperty).name).toEqual("red");
        expect((plyMetadata.elements[0].properties.get("green") as PlyProperty).name).toEqual("green");
        expect((plyMetadata.elements[0].properties.get("blue") as PlyProperty).name).toEqual("blue");

        expect((plyMetadata.elements[1].properties.get("vertex_index") as PlyProperty).name).toEqual("vertex_index");

        expect((plyMetadata.elements[2].properties.get("vertex1") as PlyProperty).name).toEqual("vertex1");
        expect((plyMetadata.elements[2].properties.get("vertex2") as PlyProperty).name).toEqual("vertex2");
        expect((plyMetadata.elements[2].properties.get("red") as PlyProperty).name).toEqual("red");
        expect((plyMetadata.elements[2].properties.get("green") as PlyProperty).name).toEqual("green");
        expect((plyMetadata.elements[2].properties.get("blue") as PlyProperty).name).toEqual("blue");
      });

      it("have scalarTypes", function() {
        expect((plyMetadata.elements[0].properties.get("x") as PlyProperty).scalarType).toEqual("float");
        expect((plyMetadata.elements[0].properties.get("y") as PlyProperty).scalarType).toEqual("float");
        expect((plyMetadata.elements[0].properties.get("z") as PlyProperty).scalarType).toEqual("float");
        expect((plyMetadata.elements[0].properties.get("red") as PlyProperty).scalarType).toEqual("uchar");
        expect((plyMetadata.elements[0].properties.get("green") as PlyProperty).scalarType).toEqual("uchar");
        expect((plyMetadata.elements[0].properties.get("blue") as PlyProperty).scalarType).toEqual("uchar");

        expect((plyMetadata.elements[1].properties.get("vertex_index") as PlyProperty).scalarType).toEqual("int");

        expect((plyMetadata.elements[2].properties.get("vertex1") as PlyProperty).scalarType).toEqual("int");
        expect((plyMetadata.elements[2].properties.get("vertex2") as PlyProperty).scalarType).toEqual("int");
        expect((plyMetadata.elements[2].properties.get("red") as PlyProperty).scalarType).toEqual("uchar");
        expect((plyMetadata.elements[2].properties.get("green") as PlyProperty).scalarType).toEqual("uchar");
        expect((plyMetadata.elements[2].properties.get("blue") as PlyProperty).scalarType).toEqual("uchar");
      });
      
      it("have isList", function() {
        expect((plyMetadata.elements[0].properties.get("x") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[0].properties.get("y") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[0].properties.get("z") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[0].properties.get("red") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[0].properties.get("green") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[0].properties.get("blue") as PlyProperty).isList).toEqual(false);

        expect((plyMetadata.elements[1].properties.get("vertex_index") as PlyProperty).isList).toEqual(true);

        expect((plyMetadata.elements[2].properties.get("vertex1") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[2].properties.get("vertex2") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[2].properties.get("red") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[2].properties.get("green") as PlyProperty).isList).toEqual(false);
        expect((plyMetadata.elements[2].properties.get("blue") as PlyProperty).isList).toEqual(false);
      });

      it("have listSizeTypea", function() {
        expect((plyMetadata.elements[0].properties.get("x") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[0].properties.get("y") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[0].properties.get("z") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[0].properties.get("red") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[0].properties.get("green") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[0].properties.get("blue") as PlyProperty).listSizeType).toEqual(undefined);

        expect((plyMetadata.elements[1].properties.get("vertex_index") as PlyProperty).listSizeType).toEqual("uchar");

        expect((plyMetadata.elements[2].properties.get("vertex1") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[2].properties.get("vertex2") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[2].properties.get("red") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[2].properties.get("green") as PlyProperty).listSizeType).toEqual(undefined);
        expect((plyMetadata.elements[2].properties.get("blue") as PlyProperty).listSizeType).toEqual(undefined);
      });

    });

    describe("has a body which", function() {

      it("has values", function() {
        expect(plyFile.body).toEqual(
`0 0 0 255 0 0
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
2 0 0 0 0`
      );
    });
  });
});