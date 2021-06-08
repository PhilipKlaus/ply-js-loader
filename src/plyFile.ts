import { PlyElement, PlyProperty } from ".";
import {
  ByteSizes,
  copyAscii,
  copyBinary,
  createArray,
  getListLength,
} from "./tools";

export interface PlyFormat {
  type: string;
  version: string;
  endianness: string;
}

export class PlyFile {
  private itsType: string;
  private itsVersion: string;
  private itsEndianness: string;
  private comments: Array<string>;

  private elements: Map<string, PlyElement>;
  private currentElement: string;

  constructor(ply?: string | ArrayBuffer) {
    this.itsType = "";
    this.itsVersion = "";
    this.itsEndianness = "";
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

  getFormat(): PlyFormat {
    return {
      type: this.itsType,
      version: this.itsVersion,
      endianness: this.itsEndianness,
    };
  }

  getComments(): Array<string> {
    return this.comments;
  }

  getElement(element: string): PlyElement {
    if (!this.hasElement(element)) {
      throw Error(`Element ${element} not found`);
    }
    return this.elements.get(element) as PlyElement;
  }

  elementNames(): Array<string> {
    return Array.from(this.elements.keys());
  }

  hasElement(element: string): boolean {
    return this.elementNames().includes(element);
  }

  getVertexPositions(element: string = "vertex"): any {
    const vertex = this.getElement(element);
    const x = vertex.getProperty("x");
    const y = vertex.getProperty("y");
    const z = vertex.getProperty("z");

    const numVertices = x.getData().length;
    const positions = createArray(x.getType(), numVertices * 3);
    for (let i = 0; i < numVertices; ++i) {
      positions[i * 3] = x.getData()[i];
      positions[i * 3 + 1] = y.getData()[i];
      positions[i * 3 + 2] = z.getData()[i];
    }
    return positions;
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
    this.itsType = formatParts[0];
    this.itsEndianness = "";
    if (formatParts.length > 1) {
      this.itsEndianness = formatParts.slice(1).join("_");
    }
    this.itsVersion = lineParts[2];
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
    return this.itsEndianness == "little_endian";
  }

  private parseAsciiBody(body: string) {
    let bodySplit = body.split("\n");
    let lineIdx = 0;

    this.elements.forEach((e, _, __) => {
      for (let i = 0; i < e.getAmount(); ++i) {
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
      for (let i = 0; i < e.getAmount(); ++i) {
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
