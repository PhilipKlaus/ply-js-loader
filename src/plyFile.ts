import { PlyElement } from "./plyElement";
import { PlyProperty } from "./plyProperty";

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
    
export class PlyFile {

    private _format!: string;
    private _formatEndianness: string = "little_endian";
    private _formatVersion!: number;
    private _comments: string[] = [];
    private _elements: PlyElement[] = [];
    private _body: ArrayBuffer | String;

    private constructor(header: string, body: ArrayBuffer | String) {
        this._body = body;
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
                    this._elements.push(
                        new PlyElement(
                            currentElementName,
                            parseInt(lineParts[2])
                        )
                    );
                    break;
                case "property":
                    let isList = lineParts[1] == "list";
                    let propertyName = lineParts[lineParts.length - 1];
                    let scalarType = lineParts[lineParts.length - 2];
                    
                    this._elements[currentElementIndex].properties.push(
                        new PlyProperty(
                            propertyName,
                            scalarType,
                            isList,
                            isList ? lineParts[2] : undefined,
                        )
                    );
                    this._elements[currentElementIndex].hasListProperty = isList ? true : this._elements[currentElementIndex].hasListProperty;
                    break;
                default:
                    break;
            }
        });

        this.calculateElementBuffer();
    }

    private calculateElementBuffer() {
        let elementIndex = 0;
        let propertyIndex = 0;
        let element = this._elements[elementIndex];
        let property = element.properties[propertyIndex];
        let buffer: Array<number> = [];
        
        (this.body as string).split("\n").forEach(row => {
            let currentType = property.scalarType;
            let isList = property.isList;
            let listIndex = 0;
            row.split( /\s+/ ).forEach(num => {
                if(isList) {
                    if(listIndex > 0) {
                        buffer.push((currentType == "float" || currentType == "double") ? parseFloat(num) : parseInt(num));
                    }
                    ++listIndex;
                }
                else {
                    buffer.push((currentType == "float" || currentType == "double") ? parseFloat(num) : parseInt(num));
                }
            });
        });
        //let arrayBuffer = new ArrayBuffer(buffer);
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

    get body(): ArrayBuffer | String {
        return this._body;
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

        const header = extractHeader(plyFile);
        const body = plyFile.slice(header.length + 1);
        return new PlyFile(header, body);
    }

    public static loadFromArrayBuffer(buffer: ArrayBuffer) {

        const encoder = new TextDecoder("ascii");
        const plyFile = encoder.decode(buffer);
        const header = extractHeader(plyFile);
        const body = buffer.slice(header.length + 1);
        return new PlyFile(header, body);
    }
}

