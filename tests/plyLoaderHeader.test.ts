import { Ply } from "../src";

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

describe("After loading a ply file a PlyLoader object", function() {

  let loader: Ply.File;

  beforeEach(function() {
    loader = Ply.File.loadFromString(testPly);
  });

    it("returns comments", function() {
      const comments: string[] = loader.comments;
      expect(comments).toEqual([
        "author: Greg Turk",
        "object: another cube"
      ]);
    });

    it("returns format", function() {
      expect(loader.format).toEqual("ascii");
    });

    it("returns formatVersion", function() {
      expect(loader.formatVersion).toEqual(1.0);
    });

    it("returns formatEndianess", function() {
      expect(loader.formatEndianness).toEqual("little_endian");
    });

    it("returns elements", function() {

      const elements: Ply.Element[] = loader.elements;
      expect(loader.elements).toEqual([
        {
          name: "vertex",
          count: 8,
          byteSize: 15,
          properties: [
            {
              name: "x",
              scalarType: "float",
              byteSize: 4,
              listSizeType: "",
              isList: false
            },
            {
              name: "y",
              scalarType: "float",
              byteSize: 4,
              listSizeType: "",
              isList: false
            },
            {
              name: "z",
              scalarType: "float",
              byteSize: 4,
              listSizeType: "",
              isList: false
            },
            {
              name: "red",
              scalarType: "uchar",
              byteSize: 1,
              listSizeType: "",
              isList: false
            },
            {
              name: "green",
              scalarType: "uchar",
              byteSize: 1,
              listSizeType: "",
              isList: false
            },
            {
              name: "blue",
              scalarType: "uchar",
              byteSize: 1,
              listSizeType: "",
              isList: false
            }
          ]
        },
        {
          name: "face",
          count: 7,
          byteSize: 0,
          properties: [
            {
              name: "vertex_index",
              scalarType: "int",
              byteSize: 4,
              listSizeType: "uchar",
              isList: true
            }
          ]
        },
        {
          name: "edge",
          count: 5,
          byteSize: 11,
          properties:[
            {
              name: "vertex1",
              scalarType: "int",
              byteSize: 4,
              listSizeType: "",
              isList: false
            },
            {
              name: "vertex2",
              scalarType: "int",
              byteSize: 4,
              listSizeType: "",
              isList: false
            },
            {
              name: "red",
              scalarType: "uchar",
              byteSize: 1,
              listSizeType: "",
              isList: false
            },
            {
              name: "green",
              scalarType: "uchar",
              byteSize: 1,
              listSizeType: "",
              isList: false
            },
            {
              name: "blue",
              scalarType: "uchar",
              byteSize: 1,
              listSizeType: "",
              isList: false
            }
          ]
        }
      ]);
    });
  });