import { PlyMetadata, PlyProperty, PlyElement } from "./plyMetadata";

export interface BufferConfig {
    parentElementName: string,
    bufferProperties: string[],
    bufferName: string
}

export class BufferResult {
    [bufferName: string]: ArrayBuffer
}

interface DataBuffer {
    [property: string]: number[]
}

interface DataElement {
    [element: string]: DataBuffer
}

export interface ParsingConfiguration {
    [element: string]: {
        [configName: string]: string[]
    }
}

export interface PlyParsingResult {
    [configName: string]: ArrayBuffer
}

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

    private _metadata: PlyMetadata; 
    private _body: ArrayBuffer | String;
    private _elements: DataElement = {};

    private constructor(header: string, body: ArrayBuffer | String) {
        this._metadata = new PlyMetadata();
        this._body = body;
        this.parseHeader(header);
    }

    private parseHeader(header: string) {
        const headerLines: string[] = header.split("\n");
        
        let currentElementName = "";
        let currentElementIndex = -1;

        headerLines.forEach(line => {
            const lineParts = line.split( /\s+/ );
            
            
            switch(lineParts[0]) {
                case "format":
                    const formatParts = lineParts[1].split("_");
                    this._metadata.format = formatParts[0];
                    if(formatParts.length > 1) {
                        this._metadata.formatEndianness = formatParts.slice(1).join("_");
                    }
                    this._metadata.formatVersion = parseFloat(lineParts[2]);
                    break;
                case "comment":
                    this._metadata.comments.push(lineParts.slice(1).join(" "));
                    break;
                case "element":
                    ++currentElementIndex;
                    currentElementName = lineParts[1];
                    this._metadata.elements.push(
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
                    
                    this._metadata.elements[currentElementIndex].properties.push(
                        new PlyProperty(
                            propertyName,
                            scalarType,
                            isList,
                            isList ? lineParts[2] : undefined,
                        )
                    );
                    this._metadata.elements[currentElementIndex].hasListProperty = isList ? true : this._metadata.elements[currentElementIndex].hasListProperty;
                    break;
                default:
                    break;
            }
        });
    }

    public parsePlyBody(configuration?: ParsingConfiguration): PlyParsingResult | void {
        let elementIndex = -1;
        let propertyIndex = -1;
        let linesToRead = 0;

        let element: PlyElement;
        let property: PlyProperty;
        
        (this._body as string).split("\n").forEach(row => {
            if(linesToRead == 0) {
                // Calculate current index etc.
                ++elementIndex;
                element = this._metadata.elements[elementIndex];
                property = element.properties[0];
                linesToRead = element.count;

                // Prepare
                this._elements[element.name] = {};
                this._metadata.elements[elementIndex].properties.forEach(prop => {
                    this._elements[element.name][prop.name] = [];
                });
            }

            propertyIndex = 0;
            let currentType = property.scalarType;
            let isList = property.isList;
            let listIndex = 0;

            row.split( /\s+/ ).forEach(num => {
                if(isList) {
                    if(listIndex > 0) {
                        this._elements[element.name][property.name].push((currentType == "float" || currentType == "double") ? parseFloat(num) : parseInt(num));
                    }
                    ++listIndex;
                }
                else {
                    property = element.properties[propertyIndex];
                    this._elements[element.name][property.name].push((currentType == "float" || currentType == "double") ? parseFloat(num) : parseInt(num));
                    ++propertyIndex;
                }
            });

            --linesToRead;
        });
    }

    get metadata(): PlyMetadata {
        return this._metadata;
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

