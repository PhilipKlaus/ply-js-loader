import { PlyMetadata, PlyProperty, PlyElement } from "./plyMetadata";

export interface ParsingConfiguration {
    [element: string]: {
        [configName: string]: string[]
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

            if(!currentProperty.isList && currentElement.name in configuration) {
                for (let config in configuration[currentElement.name]) {
                    configuration[currentElement.name][config].forEach(prop => {
                        let lastElement = (currentElement.properties.get(prop) as PlyProperty).buffer.length - 1;
                        resultBuffer[config].push((currentElement.properties.get(prop) as PlyProperty).buffer[lastElement]);
                    }); 
                }
            }
            --linesToRead;
        }
        
        if(Object.keys(resultBuffer).length !== 0) {
            return resultBuffer;
        }
    }

    private parsePlyBinaryBody(configuration: ParsingConfiguration = {}): PlyParsingResult | void {
        
    }

    get metadata(): PlyMetadata {
        return this.itsMetadata;
    }

    public static loadFromString(plyFile: string) {

        let header = extractHeader(plyFile);
        let body = plyFile.slice(header.length + 1);
        return new PlyFile(header, body);
    }

    public static loadFromArrayBuffer(buffer: ArrayBuffer) {

        let encoder = new TextDecoder();
        let plyFile = encoder.decode(buffer);
        let header = extractHeader(plyFile);
        let body = buffer.slice(header.length + 1);
        return new PlyFile(header, body);
    }
}

