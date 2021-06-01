import { PlyFile, PlyElement, PlyMetadata, PlyProperty } from "../src";
import * as fs from 'fs';

describe("After loading a binary ply file a PlyFile object", function() {

  let plyFile: PlyFile; 
  let plyMetadata: PlyMetadata;

  beforeEach(function() {
    const binaryBuffer = fs.readFileSync("./tests/test_binary.ply", {"encoding": null});
    plyFile = PlyFile.loadFromArrayBuffer(binaryBuffer);
    plyMetadata = plyFile.metadata;
  });

   it("has comments", function() {
        const comments: string[] = plyMetadata.comments;
        expect(comments).toEqual([
            "Created by CloudCompare v2.11.0 (Anoia)",
            "Created 30.08.2020 17:03"
        ]);
    });
    it("has format", function() {
      expect(plyMetadata.format).toEqual("binary");
    });

    it("has formatVersion", function() {
      expect(plyMetadata.formatVersion).toEqual(1.0);
    });

    it("has formatEndianess", function() {
      expect(plyMetadata.formatEndianness).toEqual("little_endian");
    });

    describe("has elements which", function() {

      it("have element names", function() {
        expect((plyMetadata.elements.get("vertex") as PlyElement).name).toEqual("vertex");
        expect((plyMetadata.elements.get("face") as PlyElement).name).toEqual("face");
      });

      it("have element counts", function() {
        expect((plyMetadata.elements.get("vertex") as PlyElement).count).toEqual(8);
        expect((plyMetadata.elements.get("face") as PlyElement).count).toEqual(12);
      });

      it("have hasListProperties", function() {
        expect((plyMetadata.elements.get("vertex") as PlyElement).hasListProperty).toEqual(false);
        expect((plyMetadata.elements.get("face") as PlyElement).hasListProperty).toEqual(true);
      });

      it("have properties", function() {
        expect((plyMetadata.elements.get("vertex") as PlyElement).properties.size).toEqual(6);
        expect((plyMetadata.elements.get("face") as PlyElement).properties.size).toEqual(1);
      });
  
    });
   
    describe("has properties which", function() {
      
      it("have names", function() {
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("x") as PlyProperty).name).toEqual("x");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("y") as PlyProperty).name).toEqual("y");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("z") as PlyProperty).name).toEqual("z");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("red") as PlyProperty).name).toEqual("red");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("green") as PlyProperty).name).toEqual("green");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("blue") as PlyProperty).name).toEqual("blue");

        expect(((plyMetadata.elements.get("face") as PlyElement).properties.get("vertex_indices") as PlyProperty).name).toEqual("vertex_indices");
      });
 
      it("have scalarTypes", function() {
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("x") as PlyProperty).scalarType).toEqual("float");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("y") as PlyProperty).scalarType).toEqual("float");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("z") as PlyProperty).scalarType).toEqual("float");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("red") as PlyProperty).scalarType).toEqual("uchar");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("green") as PlyProperty).scalarType).toEqual("uchar");
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("blue") as PlyProperty).scalarType).toEqual("uchar");

        expect(((plyMetadata.elements.get("face") as PlyElement).properties.get("vertex_indices") as PlyProperty).scalarType).toEqual("int");
      });
     
      it("have isList", function() {
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("x") as PlyProperty).isList).toEqual(false);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("y") as PlyProperty).isList).toEqual(false);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("z") as PlyProperty).isList).toEqual(false);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("red") as PlyProperty).isList).toEqual(false);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("green") as PlyProperty).isList).toEqual(false);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("blue") as PlyProperty).isList).toEqual(false);

        expect(((plyMetadata.elements.get("face") as PlyElement).properties.get("vertex_indices") as PlyProperty).isList).toEqual(true);
      });

      it("have listSizeTypea", function() {
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("x") as PlyProperty).listSizeType).toEqual(undefined);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("y") as PlyProperty).listSizeType).toEqual(undefined);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("z") as PlyProperty).listSizeType).toEqual(undefined);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("red") as PlyProperty).listSizeType).toEqual(undefined);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("green") as PlyProperty).listSizeType).toEqual(undefined);
        expect(((plyMetadata.elements.get("vertex") as PlyElement).properties.get("blue") as PlyProperty).listSizeType).toEqual(undefined);

        expect(((plyMetadata.elements.get("face") as PlyElement).properties.get("vertex_indices") as PlyProperty).listSizeType).toEqual("uchar");
      });

    });
});