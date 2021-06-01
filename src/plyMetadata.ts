export class PlyProperty {
  public itsData: Array<number> = new Array();
  constructor(
    public name: string,
    public scalarType: string,
    public listType?: string
  ) {}

  public get data() {
    return this.itsData;
  }

  public set data(newData: Array<number>) {
    this.itsData = newData;
  }

  public readAscii(value: string) {
    this.itsData.push(Number(value));
  }

  public isListProperty(): boolean {
    return this.listType != undefined;
  }
}

export class PlyElement {
  private itsProperties: Map<string, PlyProperty>;
  constructor(public name: string, public propertyAmount: number) {
    this.itsProperties = new Map<string, PlyProperty>();
  }

  public addProperty(property: PlyProperty) {
    this.itsProperties.set(property.name, property);
  }

  public getProperty(propertyName: string): PlyProperty {
    const prop = this.itsProperties.get(propertyName);
    if (prop) {
      return prop;
    }
    throw new Error(`Property ${propertyName} not existing`);
  }

  public properyNames(): Array<string> {
    return Array.from(this.itsProperties.keys());
  }

  public hasProperty(property: string): boolean {
    return this.properyNames().includes(property);
  }

  public parseAscii(data: string) {
    const parts = data.split(" ");
    let i = 0;
    for (const [key, prop] of this.itsProperties.entries()) {
      if (prop.isListProperty()) {
        const list_len = Number(parts[i++]);
        for (let j = 0; j < list_len; ++j) {
          prop.readAscii(parts[i++]);
        }
      } else {
        prop.readAscii(parts[i++]);
      }
    }
  }
}

/*export class PlyProperty<Type> {
  constructor(
    public name: string,
    public scalarType: string,
    public isList: boolean,
    public data: Array<Type>,
    public listSizeType?: string
  ) {}
}

export class PlyElement {
  private itsProperties: Map<string, PlyProperty>;

  constructor(public name: string, public count: number) {
    this.itsProperties = new Map<string, PlyProperty>();
  }

  public addProperty<Type>(key: string, prop: PlyProperty<Type>) {
    this.itsProperties.set(key, prop);
  }

  public properyNames(): Array<string> {
    return Array.from(this.itsProperties.keys());
  }

  public hasProperty(property: string): boolean {
    return this.properyNames().includes(property);
  }
}

export class PlyFormat {
  constructor(
    public format: string,
    public endianness: string,
    public version: string
  ) {}
}

export class PlyHeader {
  public comments: Array<string>;
  public format!: PlyFormat;
  public elements: Map<string, PlyElement>;

  private currentElement: string;

  constructor(private header: string) {
    this.comments = new Array<string>();
    this.currentElement = "";
    this.elements = new Map<string, PlyElement>();

    this.parseHeader();
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
    this.format = new PlyFormat(format, endianness, version);
  }

  private parseElement(lineParts: string[]) {
    this.currentElement = lineParts[1];
    this.elements.set(
      this.currentElement,
      new PlyElement(this.currentElement, parseInt(lineParts[2]))
    );
  }

  private parseProperty(lineParts: string[]) {
    let isList = lineParts[1] == "list";
    let propertyName = lineParts[lineParts.length - 1];
    let scalarType = lineParts[lineParts.length - 2];

    this.elements
      .get(this.currentElement)
      ?.addProperty(
        propertyName,
        new PlyProperty(
          propertyName,
          scalarType,
          isList,
          isList ? lineParts[2] : undefined
        )
      );
  }

  private parseHeader() {
    const headerLines: string[] = this.header.split("\n");

    headerLines.forEach((line) => {
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
}
*/
