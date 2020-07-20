
export class PlyProperty {
    private itsName: string;
    private itsScalarType: string;
    private itsIsList: boolean;
    private itsListSizeType: string | undefined;

    constructor(name: string, scalarType: string, isList: boolean, listSizeType?: string) {
        this.itsName = name;
        this.itsScalarType = scalarType;
        this.itsIsList = isList;
        this.itsListSizeType = listSizeType;
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
 }