import { PlyFile, PlyElement } from "../src";

const testPly: string = 
`
ply
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
2 0 0 0 0
`

describe("After loading a ply file a PlyFile object", function() {

  let plyFile: PlyFile;

  beforeEach(function() {
    plyFile = PlyFile.loadFromString(testPly);
  });

    it("has comments", function() {
      const comments: string[] = plyFile.comments;
      expect(comments).toEqual([
        "author: Greg Turk",
        "object: another cube"
      ]);
    });

    it("has format", function() {
      expect(plyFile.format).toEqual("ascii");
    });

    it("has formatVersion", function() {
      expect(plyFile.formatVersion).toEqual(1.0);
    });

    it("has formatEndianess", function() {
      expect(plyFile.formatEndianness).toEqual("little_endian");
    });

    describe("has elements which", function() {

      it("have element names", function() {
        expect(plyFile.elements[0].name).toEqual("vertex");
        expect(plyFile.elements[1].name).toEqual("face");
        expect(plyFile.elements[2].name).toEqual("edge");
      });

      it("have element counts", function() {
        expect(plyFile.elements[0].count).toEqual(8);
        expect(plyFile.elements[1].count).toEqual(7);
        expect(plyFile.elements[2].count).toEqual(5);
      });

      it("have hasListProperties", function() {
        expect(plyFile.elements[0].hasListProperty).toEqual(false);
        expect(plyFile.elements[1].hasListProperty).toEqual(true);
        expect(plyFile.elements[2].hasListProperty).toEqual(false);
      });

      it("have properties", function() {
        expect(plyFile.elements[0].properties.length).toEqual(6);
        expect(plyFile.elements[1].properties.length).toEqual(1);
        expect(plyFile.elements[2].properties.length).toEqual(5);
      });
  
    });
    
    describe("has properties which", function() {
      
      it("have names", function() {
        expect(plyFile.elements[0].properties[0].name).toEqual("x");
        expect(plyFile.elements[0].properties[1].name).toEqual("y");
        expect(plyFile.elements[0].properties[2].name).toEqual("z");
        expect(plyFile.elements[0].properties[3].name).toEqual("red");
        expect(plyFile.elements[0].properties[4].name).toEqual("green");
        expect(plyFile.elements[0].properties[5].name).toEqual("blue");

        expect(plyFile.elements[1].properties[0].name).toEqual("vertex_index");

        expect(plyFile.elements[2].properties[0].name).toEqual("vertex1");
        expect(plyFile.elements[2].properties[1].name).toEqual("vertex2");
        expect(plyFile.elements[2].properties[2].name).toEqual("red");
        expect(plyFile.elements[2].properties[3].name).toEqual("green");
        expect(plyFile.elements[2].properties[4].name).toEqual("blue");
      });

      it("have scalarTypes", function() {
        expect(plyFile.elements[0].properties[0].scalarType).toEqual("float");
        expect(plyFile.elements[0].properties[1].scalarType).toEqual("float");
        expect(plyFile.elements[0].properties[2].scalarType).toEqual("float");
        expect(plyFile.elements[0].properties[3].scalarType).toEqual("uchar");
        expect(plyFile.elements[0].properties[4].scalarType).toEqual("uchar");
        expect(plyFile.elements[0].properties[5].scalarType).toEqual("uchar");

        expect(plyFile.elements[1].properties[0].scalarType).toEqual("int");

        expect(plyFile.elements[2].properties[0].scalarType).toEqual("int");
        expect(plyFile.elements[2].properties[1].scalarType).toEqual("int");
        expect(plyFile.elements[2].properties[2].scalarType).toEqual("uchar");
        expect(plyFile.elements[2].properties[3].scalarType).toEqual("uchar");
        expect(plyFile.elements[2].properties[4].scalarType).toEqual("uchar");
      });

      it("have isList", function() {
        expect(plyFile.elements[0].properties[0].isList).toEqual(false);
        expect(plyFile.elements[0].properties[1].isList).toEqual(false);
        expect(plyFile.elements[0].properties[2].isList).toEqual(false);
        expect(plyFile.elements[0].properties[3].isList).toEqual(false);
        expect(plyFile.elements[0].properties[4].isList).toEqual(false);
        expect(plyFile.elements[0].properties[5].isList).toEqual(false);

        expect(plyFile.elements[1].properties[0].isList).toEqual(true);

        expect(plyFile.elements[2].properties[0].isList).toEqual(false);
        expect(plyFile.elements[2].properties[1].isList).toEqual(false);
        expect(plyFile.elements[2].properties[2].isList).toEqual(false);
        expect(plyFile.elements[2].properties[3].isList).toEqual(false);
        expect(plyFile.elements[2].properties[4].isList).toEqual(false);
      });

      it("have listSizeTypea", function() {
        expect(plyFile.elements[0].properties[0].listSizeType).toEqual(undefined);
        expect(plyFile.elements[0].properties[1].listSizeType).toEqual(undefined);
        expect(plyFile.elements[0].properties[2].listSizeType).toEqual(undefined);
        expect(plyFile.elements[0].properties[3].listSizeType).toEqual(undefined);
        expect(plyFile.elements[0].properties[4].listSizeType).toEqual(undefined);
        expect(plyFile.elements[0].properties[5].listSizeType).toEqual(undefined);

        expect(plyFile.elements[1].properties[0].listSizeType).toEqual("uchar");

        expect(plyFile.elements[2].properties[0].listSizeType).toEqual(undefined);
        expect(plyFile.elements[2].properties[1].listSizeType).toEqual(undefined);
        expect(plyFile.elements[2].properties[2].listSizeType).toEqual(undefined);
        expect(plyFile.elements[2].properties[3].listSizeType).toEqual(undefined);
        expect(plyFile.elements[2].properties[4].listSizeType).toEqual(undefined);
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
2 0 0 0 0
`
      );
    });
  });
});