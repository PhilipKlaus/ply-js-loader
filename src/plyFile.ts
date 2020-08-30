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

export interface PlyParsingResultBuffer {
    [configName: string]: number[]
}


export interface PlyParsingResult {
    [configName: string]: number[]
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

        for(let i = 0; i < headerLines.length; ++i) {
            let line = headerLines[i];    

            if(!line) {
                continue;
            }
            const lineParts = line.trim().split( /\s+/ );
            
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
                    
                    this._metadata.elements[currentElementIndex].properties.set(
                        propertyName,
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
        }
    }

    public parsePlyBody(configuration: ParsingConfiguration = {}): PlyParsingResult | void {
        let resultBuffer: PlyParsingResult = {};
        for (let element in configuration) {
            for (let config in configuration[element]) {
                resultBuffer[config] = [];
            }
        }

        let elementIndex = -1;
        let linesToRead = 0;

        let element: PlyElement = {} as PlyElement;
        let property: PlyProperty = {} as PlyProperty;
        
        let bodySplit = (this._body as string).split("\n");

        let isList: boolean = false;
        let currentType: string = "";
        let oldIdx = 0;
        let propertyIterator: IterableIterator<PlyProperty>;

        for(let i = 0; i < bodySplit.length; ++i) {

            if(!bodySplit[i]) {
                continue;
            }

            if(linesToRead == 0) {
                // Calculate current index etc.
                element = this._metadata.elements[++elementIndex];
                propertyIterator = element.properties.values();
                property = propertyIterator.next().value;
                linesToRead = element.count;

                // Prepare
                this._elements[element.name] = {};
                this._metadata.elements[elementIndex].properties.forEach(prop => {
                    this._elements[element.name][prop.name] = [];
                });
            }

            propertyIterator = element.properties.values();
            currentType = property.scalarType;
            isList = property.isList;

            oldIdx = 0
            for(let a = 0; a < bodySplit[i].length; ++a) {
                if(bodySplit[i][a] == " ") {
                    property = isList ? property : propertyIterator.next().value;
                    this._elements[element.name][property.name].push(Number(bodySplit[i].substring(oldIdx, a)));
                    oldIdx = a + 1;
                }
                else if(a == bodySplit[i].length-1) {
                    property = propertyIterator.next().value;
                    this._elements[element.name][property.name].push(Number(bodySplit[i].substring(oldIdx, a + 1)));
                }
              }

            if(!isList && element.name in configuration) {
                for (let config in configuration[element.name]) {
                    configuration[element.name][config].forEach(prop => {
                        let lastElement = this._elements[element.name][prop].length - 1;
                        resultBuffer[config].push(this._elements[element.name][prop][lastElement]);
                    }); 
                }
            }
            --linesToRead;
        }
        
        if(Object.keys(resultBuffer).length !== 0) {
            return resultBuffer;
        }
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

