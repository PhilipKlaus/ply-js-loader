import { PlyElement, PlyProperty } from "./plyMetadata";

export class PlyFormat {
  constructor(
    public type: string,
    public version: string,
    public endianness: string
  ) {}

  static empty(): PlyFormat {
    return new PlyFormat("", "", "");
  }
}

export class PlyFile {
  public format: PlyFormat;
  public comments: Array<string>;

  private elements: Map<string, PlyElement>;
  private currentElement: string;

  constructor(ply?: string | ArrayBuffer) {
    this.format = PlyFormat.empty();
    this.comments = new Array<string>();
    this.elements = new Map<string, PlyElement>();

    this.currentElement = "";

    if (ply) {
      if (typeof ply === "string") {
        const header = this.extractHeader(ply);
        this.parseHeader(header);
        const body = ply.slice(header.length + 1);
        this.parseAsciiBody(body);
      } else {
        throw Error("Not implemented");
      }
    } else {
      // Empty Ply file is created
    }
  }

  public getElement(element: string): PlyElement {
    if (!this.hasElement(element)) {
      throw Error(`Element ${element} not found`);
    }
    return this.elements.get(element) as PlyElement;
  }

  public elementNames(): Array<string> {
    return Array.from(this.elements.keys());
  }

  public hasElement(element: string): boolean {
    return this.elementNames().includes(element);
  }

  private extractHeader(ply: string): string {
    let endHeaderIndex: number = ply.lastIndexOf("end_header");
    if (endHeaderIndex === -1) {
      throw "Invalid PLY file: end_header not present";
    }
    endHeaderIndex += "end_header".length;
    const headerString: string = ply.slice(0, endHeaderIndex);
    return headerString;
  }

  private parseComment(lineParts: string[]) {
    this.comments.push(lineParts.slice(1).join(" "));
  }

  private parseFormat(lineParts: string[]) {
    const formatParts = lineParts[1].split("_");
    let format = formatParts[0];
    let endianness = "";
    if (formatParts.length > 1) {
      endianness = formatParts.slice(1).join("_");
    }
    let version = lineParts[2];
    this.format = new PlyFormat(format, version, endianness);
  }

  private parseElement(lineParts: string[]) {
    this.currentElement = lineParts[1];
    this.elements.set(
      this.currentElement,
      new PlyElement(this.currentElement, parseInt(lineParts[2]))
    );
  }

  private parseProperty(lineParts: string[]) {
    const isList = lineParts[1] == "list";
    const listType = isList ? lineParts[2] : undefined;
    const name = lineParts[lineParts.length - 1];
    const type = lineParts[lineParts.length - 2];

    this.elements
      .get(this.currentElement)
      ?.addProperty(new PlyProperty(name, type, listType));
  }

  private parseHeader(raw: string) {
    raw.split("\n").forEach((line) => {
      if (line) {
        const lineParts = line.trim().split(/\s+/);
        const keyword = lineParts[0];

        switch (keyword) {
          case "ply":
            // Do nothing
            break;
          case "end_header":
            // Do nothing
            break;
          case "comment":
            this.parseComment(lineParts);
            break;
          case "format":
            this.parseFormat(lineParts);
            break;
          case "element":
            this.parseElement(lineParts);
            break;
          case "property":
            this.parseProperty(lineParts);
            break;
          default:
            throw Error(`invalid header keyword ${keyword}`);
        }
      }
    });
  }

  private parseAsciiBody(body: string) {
    let bodySplit = body.split("\n");
    let lineIdx = 0;

    this.elements.forEach((e, _, __) => {
      for (let i = 0; i < e.amount; ++i) {
        const line = bodySplit[lineIdx];
        const values = line.trim().split(/\s+/);
        let valueIdx = 0;
        e.properyNames().forEach((p) => {
          const prop = e.getProperty(p);
          if (prop.isListProperty()) {
            const len = Number(values[valueIdx++]);
            for (let j = 0; j < len; ++j) {
              prop.readAscii(values[valueIdx++]);
            }
          } else {
            prop.readAscii(values[valueIdx++]);
          }
        });
        ++lineIdx;
      }
    });
  }

  /*private parseAsciiElement(
    element: PlyElement,
    name: string,
    map: Map<string, PlyElement>
  ) {} */

  /*public static fromString(raw: string): PlyFile {
    const ply = new PlyFile();
    this.parseHeader(raw, ply);
    return ply;
  }

  private extractHeader(plyFile: string): string {
    let endHeaderIndex: number = plyFile.lastIndexOf("end_header");
    if(endHeaderIndex === -1) {
        throw "Invalid PLY file: end_header not present";
    }
    endHeaderIndex += "end_header".length;
    const headerString: string = plyFile.slice(0, endHeaderIndex);
    return headerString;
  }*/
}
/*import { PlyFormat, PlyHeader, PlyElement } from "./plyMetadata";

export abstract class Ply {
  private itsHeader: PlyHeader;

  constructor(header: string) {
    this.itsHeader = new PlyHeader(header);
  }

  public comments(): Array<string> {
    return this.itsHeader.comments;
  }

  public format(): PlyFormat {
    return this.itsHeader.format;
  }

  public elementNames(): Array<string> {
    return Array.from(this.itsHeader.elements.keys());
  }

  public hasElement(element: string): boolean {
    return this.elementNames().includes(element);
  }

  public getElement(element: string): PlyElement {
    let e = this.itsHeader.elements.get(element);
    if (e) {
      return e;
    }
    throw Error(`Element ${element} is not existing`);
  }
}
*/
