export class PlyProperty {
    private itsName: string;
    private itsScalarType: string;
    private itsIsList: boolean;
    private itsListSizeType: string | undefined;
    private itsBuffer: number[]

    constructor(name: string, scalarType: string, isList: boolean, listSizeType?: string) {
        this.itsName = name;
        this.itsScalarType = scalarType;
        this.itsIsList = isList;
        this.itsListSizeType = listSizeType;
        this.itsBuffer = [];
    }

    get name(): string {
        return this.itsName;
    }

    get scalarType(): string {
        return this.itsScalarType;
    }

    get isList(): boolean {
        return this.itsIsList;
    }

    get listSizeType(): string | undefined{
        return this.itsListSizeType;
    }

    get buffer(): number[] {
        return this.itsBuffer;
    }
 }

 export class PlyElement {
    private itsName: string;
    private itsCount: number;
    private itsProperties: Map<string, PlyProperty>;
    private itsHasListProperty: boolean;

    constructor(name: string, count: number) {
        this.itsName = name,
        this.itsCount = count;
        this.itsProperties = new Map<string, PlyProperty>();
        this.itsHasListProperty = false;
    }

    public get name(): string {
        return this.itsName;
    }

    public get count(): number {
        return this.itsCount;
    }

    public get properties(): Map<string, PlyProperty> {
        return this.itsProperties;
    }

    public get hasListProperty(): boolean {
        return this.itsHasListProperty;
    }
    
    public set hasListProperty(hasListProperty: boolean) {
        this.itsHasListProperty = hasListProperty;
    }
}

export class PlyMetadata {
    
    public format!: string;
    public formatEndianness: string = "little_endian";
    public formatVersion!: number;
    public comments: string[] = [];
    public elements: Map<string, PlyElement> = new Map<string, PlyElement>();
}