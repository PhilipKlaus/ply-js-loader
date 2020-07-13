
function extractHeader(plyFile: string): string {
    let endHeaderIndex: number = plyFile.lastIndexOf("end_header");
    if(endHeaderIndex === -1) {
        throw "Invalid PLY file: end_header not present";
    }
    endHeaderIndex += "end_header".length;
    const headerString: string = plyFile.slice(0, endHeaderIndex);
    return headerString;
}

function getByteSizeFromType(type: string) {
    switch(type) {
        case "char":
        case "uchar":
            return 1;
        case "short":
        case "ushort":
            return 2;
        case "int":
        case "uint":
        case "float":
            return 4;
        case "double":
            return 8;
        default:
            return 0
    };
}

export namespace Ply {

    export interface PlyProperty {
        name: string,
        scalarType: string
        byteSize: number,
        listSizeType: string,
        isList: boolean
    }
    
    export interface PlyElement {
        name: string
        count: number,
        byteSize: number,
        properties: PlyProperty[],
        buffer?: ArrayBuffer
    }
    
    export class PlyLoader {
    
        private _format!: string;
        private _formatEndianness: string = "little_endian";
        private _formatVersion!: number;
        private _comments: string[] = [];
        private _elements: PlyElement[] = [];
    
        private constructor(header: string) {
            const headerLines: string[] = header.split("\n");
            
            let currentElementName = "";
            let currentElementIndex = -1;
    
            headerLines.forEach(line => {
                const lineParts = line.split( /\s+/ );
                
                
                switch(lineParts[0]) {
                    case "format":
                        const formatParts = lineParts[1].split("_");
                        this._format = formatParts[0];
                        if(formatParts.length > 1) {
                            this._formatEndianness = formatParts.slice(1).join("_");
                        }
                        this._formatVersion = parseFloat(lineParts[2]);
                        break;
                    case "comment":
                        this._comments.push(lineParts.slice(1).join(" "));
                        break;
                    case "element":
                        ++currentElementIndex;
                        currentElementName = lineParts[1];
                        this._elements.push({
                            name: currentElementName,
                            count: parseInt(lineParts[2]),
                            byteSize: 0,
                            properties: [],
                        });
                        break;
                    case "property":
                        let isList = lineParts[1] == "list";
                        let propertyName = lineParts[lineParts.length - 1];
                        let scalarType = lineParts[lineParts.length - 2];
                        let byteSize = getByteSizeFromType(scalarType);
                        
                        this._elements[currentElementIndex].properties.push({
                            name: propertyName,
                            scalarType: scalarType,
                            byteSize: byteSize,
                            isList: isList,
                            listSizeType: isList ? lineParts[2] : ""
                        });
    
                        if(!isList) {
                            this._elements[currentElementIndex].byteSize += byteSize;
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    
        get comments(): string[] {
            return this._comments;
        }
    
        get format(): string {
            return this._format;
        }
    
        get formatEndianness(): string {
            return this._formatEndianness;
        }
    
        get formatVersion(): number {
            return this._formatVersion;
        }
    
        get elements(): PlyElement[] {
            return this._elements;
        }
        
        private getElement(elementName: string, conversion: (view: DataView, byteOffset: number) => number): ArrayBuffer{
            return new ArrayBuffer(1);
        }

        public getFloat32Element(elementName: string): Float32Array {
            return this.getElement(
                elementName,
                (view: DataView, byteOffset: number): number => {
                    return view.getFloat32(byteOffset);
                }
            ) as Float32Array;
        }

        public static loadFromString(plyFile: string) {
    
            const headerString = extractHeader(plyFile);
            return new PlyLoader(headerString);
        }
    
        public static loadFromArrayBuffer(buffer: ArrayBuffer) {
    
            const encoder = new TextDecoder("ascii");
            const plyFile = encoder.decode(buffer);
            const headerString = extractHeader(plyFile);
            return new PlyLoader(headerString);
        }
    }
}
