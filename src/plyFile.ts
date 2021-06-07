import { PlyElement, PlyProperty } from ".";
import { ByteSizes, copyAscii, copyBinary, getListLength } from "./tools";

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
        const header = PlyFile.extractHeader(ply);
        this.parseHeader(header);
        const body = ply.slice(header.length + 1);
        this.parseAsciiBody(body);
      } else {
        const encoder = new TextDecoder();
        const plyFile = encoder.decode(ply);
        const header = PlyFile.extractHeader(plyFile);
        this.parseHeader(header);
        const body = ply.slice(header.length + 1);
        this.parseBinaryBody(body);
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

  // ------------ Private methods ------------

  private static extractHeader(ply: string): string {
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

  private isLittleEndian(): boolean {
    return this.format.endianness == "little_endian";
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
              copyAscii(prop, values[valueIdx++]);
            }
          } else {
            copyAscii(prop, values[valueIdx++]);
          }
        });
        ++lineIdx;
      }
    });
  }

  private parseBinaryBody(body: ArrayBuffer) {
    let byteOffset = 0;
    const dataView = new DataView(body);
    this.elements.forEach((e, _, __) => {
      for (let i = 0; i < e.amount; ++i) {
        e.properyNames().forEach((p) => {
          const prop = e.getProperty(p);
          if (prop.isListProperty()) {
            const len = getListLength(prop, dataView, byteOffset);
            byteOffset += ByteSizes.get(
              prop.getListLenType() as string
            ) as number;
            for (let j = 0; j < len; ++j) {
              copyBinary(prop, dataView, byteOffset, this.isLittleEndian());
              byteOffset += ByteSizes.get(prop.getType()) as number;
            }
          } else {
            copyBinary(prop, dataView, byteOffset, this.isLittleEndian());
            byteOffset += ByteSizes.get(prop.getType()) as number;
          }
        });
      }
    });
  }
}
