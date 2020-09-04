import { PlyFile, PlyParsingResult } from "../src";
import * as fs from 'fs';

describe("Calling parsePlyBody", function() {

    let plyFile: PlyFile;

    beforeEach(function() {
        const binaryBuffer = fs.readFileSync("./tests/test_binary.ply", {"encoding": null});
                
        // Convert Node Buffer to ArrayBuffer
        var ab = new ArrayBuffer(binaryBuffer.length);
            var view = new Uint8Array(ab);
            for (var i = 0; i < binaryBuffer.length; ++i) {
                view[i] = binaryBuffer[i];
            }

        plyFile = PlyFile.loadFromArrayBuffer(ab);
    });

    it("without a ParsingConfiguration returns void", function() {
        expect(plyFile.parsePlyBody()).toBeUndefined();
    });

    describe("returns a PlyParsingResult", function() {

        let result: PlyParsingResult | void;

        beforeEach(function() {
            result = plyFile.parsePlyBody({
                "vertex": {
                    "vertices": ["x", "y", "z"],
                    "colors": ["red", "green", "blue"]
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
                    255, 0, 0,
                    255, 0, 0,
                    255, 0, 0,
                    255, 0, 0,
                    0, 0, 255,
                    0, 0, 255,
                    0, 0, 255,
                    0, 0, 255
                ]
            );
        });
    });
});