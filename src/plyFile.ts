import { PlyMetadata, PlyProperty, PlyElement } from "./plyMetadata";

export interface ParsingConfiguration {
    [element: string]: {
        [configName: string]: {
            propertyNames: string[],
            propertyFunction?: ((n: number) => number)
        }
    }
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

interface ITypeByteSizeMap {
    [type: string]: number
}
let TypeByteSizeMap = {
    "char": 1,
    "uchar": 1,
    "short": 2,
    "ushort": 2,
    "int": 4,
    "uint4": 4,
    "float": 4,
    "double": 8
} as ITypeByteSizeMap;

function readBinary(dataView: DataView, type: string, byteOffset: number, littleEndian: boolean) {
    switch(type) {
        case "char":
            return dataView.getInt8(byteOffset);
        case "uchar":
            return dataView.getUint8(byteOffset);
        case "short":
            return dataView.getInt16(byteOffset, littleEndian);
        case "ushort":
            return dataView.getUint16(byteOffset, littleEndian);
        case "int":
            return dataView.getInt32(byteOffset, littleEndian);
        case "uint":
            return dataView.getUint32(byteOffset, littleEndian);
        case "float":
            return dataView.getFloat32(byteOffset, littleEndian);
        case "double":
            return dataView.getFloat64(byteOffset, littleEndian);
        default:
            return 0
    };
}
    
export class PlyFile {

    private itsMetadata: PlyMetadata; 
    private itsBody: ArrayBuffer | String;

    private constructor(header: string, body: ArrayBuffer | String) {
        this.itsMetadata = new PlyMetadata();
        this.itsBody = body;
        this.parseHeader(header);
    }

    private parseHeader(header: string) {
        const headerLines: string[] = header.split("\n");
        
        let currentElementName = "";

        for(let i = 0; i < headerLines.length; ++i) {
            let line = headerLines[i];    

            if(!line) {
                continue;
            }
            const lineParts = line.trim().split( /\s+/ );
            
            switch(lineParts[0]) {
                case "format":
                    const formatParts = lineParts[1].split("_");
                    this.itsMetadata.format = formatParts[0];
                    if(formatParts.length > 1) {
                        this.itsMetadata.formatEndianness = formatParts.slice(1).join("_");
                    }
                    this.itsMetadata.formatVersion = parseFloat(lineParts[2]);
                    break;
                case "comment":
                    this.itsMetadata.comments.push(lineParts.slice(1).join(" "));
                    break;
                case "element":
                    currentElementName = lineParts[1];
                    this.itsMetadata.elements.set(
                        currentElementName,
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
                    
                    (this.itsMetadata.elements.get(currentElementName) as PlyElement).properties.set(
                        propertyName,
                        new PlyProperty(
                            propertyName,
                            scalarType,
                            isList,
                            isList ? lineParts[2] : undefined,
                        )
                    );
                    (this.itsMetadata.elements.get(currentElementName) as PlyElement).hasListProperty = 
                        isList ? true : (this.itsMetadata.elements.get(currentElementName) as PlyElement).hasListProperty;
                    break;
                default:
                    break;
            }
        }
    }

    private prepareResultBuffer(configuration: ParsingConfiguration = {}): PlyParsingResult {
        let resultBuffer: PlyParsingResult = {};
        for (let element in configuration) {
            for (let config in configuration[element]) {
                resultBuffer[config] = [];
            }
        }
        return resultBuffer;
    }

    private addToResultBuffer(configuration: ParsingConfiguration, result: PlyParsingResult, element: PlyElement) {
        for (let config in configuration[element.name]) {
            configuration[element.name][config].propertyNames.forEach(prop => {
                let lastElement = (element.properties.get(prop) as PlyProperty).buffer.length - 1;
                let value = (element.properties.get(prop) as PlyProperty).buffer[lastElement];
                let propertyFunction = configuration[element.name][config].propertyFunction;

                if(propertyFunction !== undefined) {
                    value = propertyFunction(value);
                }
                result[config].push(value);
            }); 
        }
    }

    public parsePlyBody(configuration: ParsingConfiguration = {}): PlyParsingResult | void {
        if(this.itsMetadata.format === "ascii") {
            return this.parsePlyAsciiBody(configuration);
        }
        else {
            return this.parsePlyBinaryBody(configuration);
        }
    }

    private parsePlyAsciiBody(configuration: ParsingConfiguration = {}): PlyParsingResult | void {
        let resultBuffer:PlyParsingResult = this.prepareResultBuffer(configuration);
        
        let bodySplit = (this.itsBody as string).split("\n");
        
        let elementIterator: IterableIterator<PlyElement> = this.itsMetadata.elements.values();
        let currentElement: PlyElement = elementIterator.next().value;
        let propertyIterator: IterableIterator<PlyProperty> = currentElement.properties.values();
        let currentProperty: PlyProperty = propertyIterator.next().value;
        let linesToRead = currentElement.count;
        
        let lineIdx = 0;

        for(let i = 0; i < bodySplit.length; ++i) {

            if(!bodySplit[i]) {
                continue;
            }

            if(linesToRead == 0) {
                currentElement = elementIterator.next().value;
                propertyIterator = currentElement.properties.values();
                currentProperty = propertyIterator.next().value;
                linesToRead = currentElement.count;
            }

            propertyIterator = currentElement.properties.values();
            lineIdx = 0

            for(let a = 0; a < bodySplit[i].length; ++a) {
                if(bodySplit[i][a] == " ") {
                    currentProperty = currentProperty.isList ? currentProperty : propertyIterator.next().value;
                    currentProperty.buffer.push(Number(bodySplit[i].substring(lineIdx, a)));
                    lineIdx = a + 1;
                }
                else if(a == bodySplit[i].length-1) {
                    currentProperty = propertyIterator.next().value;
                    currentProperty.buffer.push(Number(bodySplit[i].substring(lineIdx, a + 1)));
                }
              }

            if(currentElement.name in configuration) {
                this.addToResultBuffer(configuration, resultBuffer, currentElement);
            }
            --linesToRead;
        }
        
        if(Object.keys(resultBuffer).length !== 0) {
            return resultBuffer;
        }
    }

    private parsePlyBinaryBody(configuration: ParsingConfiguration = {}): PlyParsingResult | void {
        let resultBuffer:PlyParsingResult = this.prepareResultBuffer(configuration);
        let byteOffset = 0;

        let dataView = new DataView((this.itsBody as ArrayBuffer));
        let isLittleEndian = this.metadata.formatEndianness === "little_endian";
        let byteSize = 0;
        let listSizeByteSize = 0;
        let listAmount = 0;

        this.metadata.elements.forEach(
            (element, elementName) => {
                for(let i = 0; i < element.count; ++i) {
                    element.properties.forEach(
                        (property, propertyName) => {
                            
                            byteSize = TypeByteSizeMap[property.scalarType];

                            if(!property.isList) {
                                property.buffer.push(readBinary(dataView, property.scalarType, byteOffset, isLittleEndian));
                                byteOffset += byteSize;
                            }
                            else {
                                listSizeByteSize = TypeByteSizeMap[property.listSizeType as string];
                                listAmount = readBinary(dataView, property.listSizeType as string, byteOffset, isLittleEndian)
                                byteOffset += listSizeByteSize;
                                for(let u = 0; u < listAmount; ++u) {
                                    property.buffer.push(readBinary(dataView, property.scalarType, byteOffset, isLittleEndian));
                                    byteOffset += byteSize;
                                }
                            }
                        }
                    )
                    if(element.name in configuration) {
                        this.addToResultBuffer(configuration, resultBuffer, element);
                    }
                }
            }
        )

        if(Object.keys(resultBuffer).length !== 0) {
            return resultBuffer;
        }
    }

    get metadata(): PlyMetadata {
        return this.itsMetadata;
    }

    public static loadFromString(plyFile: string) {

        let header = extractHeader(plyFile);
        let body = plyFile.slice(header.length + 1);
        return new PlyFile(header, body);
    }


    private toArrayBuffer(buffer: Buffer) {
        var ab = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return ab;
    }

    public static loadFromArrayBuffer(buffer: ArrayBuffer) {
        let encoder = new TextDecoder();
        let plyFile = encoder.decode(buffer);
        let header = extractHeader(plyFile);
        let body = buffer.slice(header.length + 1);
        return new PlyFile(header, body);
    }
}

