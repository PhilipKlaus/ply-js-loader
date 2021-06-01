import { PlyFile, PlyParsingResult } from "../src";

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
2 0 0 0 0
`

describe("Calling parsePlyBody", function() {

    let plyFile: PlyFile;

    beforeEach(function() {
        plyFile = PlyFile.loadFromString(testPly);
    });

    it("without a ParsingConfiguration returns void", function() {
        expect(plyFile.parsePlyBody()).toBeUndefined();
    });

    describe("returns a PlyParsingResult", function() {

        let result: PlyParsingResult | void;

        beforeEach(function() {
            result = plyFile.parsePlyBody({
                "vertex": {
                    "vertices": {
                        propertyNames: ["x", "y", "z"],
                    },
                    "colors": {
                        propertyNames: ["red", "green", "blue"],
                        propertyFunction: (x: number) => {
                            return x / 255.0;
                        }
                    }
                },
                "edge": {
                    "edgeColor": {
                        propertyNames: ["red", "green", "blue"]
                    },
                    "mix": {
                        propertyNames: ["red", "vertex2", "vertex1"]
                    }
                }
            });
            expect(result).toBeDefined();
        });

        it("which contains values", function() {
            expect((result as PlyParsingResult).vertices).toBeDefined();
            expect((result as PlyParsingResult).vertices).toEqual(
                [
                    0, 0, 0,
                    0, 0, 1,
                    0, 1, 1,
                    0, 1, 0,
                    1, 0, 0,
                    1, 0, 1,
                    1, 1, 1,
                    1, 1, 0
                ]
            );

            expect((result as PlyParsingResult).colors).toBeDefined();
            expect((result as PlyParsingResult).colors).toEqual(
                [
                    1.0, 0, 0,
                    1.0, 0, 0,
                    1.0, 0, 0,
                    1.0, 0, 0,
                    0, 0, 1.0,
                    0, 0, 1.0,
                    0, 0, 1.0,
                    0, 0, 1.0
                ]
            );

            expect((result as PlyParsingResult).edgeColor).toBeDefined();
            expect((result as PlyParsingResult).edgeColor).toEqual(
                [
                    255, 255, 255,
                    255, 255, 255,
                    255, 255, 255,
                    255, 255, 255,
                    0, 0, 0
                ]
            );

            expect((result as PlyParsingResult).mix).toBeDefined();
            expect((result as PlyParsingResult).mix).toEqual(
                [
                    255, 1, 0,
                    255, 2, 1,
                    255, 3, 2,
                    255, 0, 3,
                    0, 0, 2
                ]
            );
        });
    });
});