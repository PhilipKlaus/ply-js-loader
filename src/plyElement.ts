import { PlyProperty } from "./plyProperty";

export class PlyElement {
    private itsName: string;
    private itsCount: number;
    private itsProperties: PlyProperty[];
    private itsHasListProperty: boolean;

    constructor(name: string, count: number) {
        this.itsName = name,
        this.itsCount = count;
        this.itsProperties = [];
        this.itsHasListProperty = false;
    }

    public get name(): string {
        return this.itsName;
    }

    public get count(): number {
        return this.itsCount;
    }

    public get properties(): PlyProperty[] {
        return this.itsProperties;
    }

    public get hasListProperty(): boolean {
        return this.itsHasListProperty;
    }
    
    public set hasListProperty(hasListProperty: boolean) {
        this.itsHasListProperty = hasListProperty;
    }
}