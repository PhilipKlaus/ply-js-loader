import { PlyProperty } from "./plyProperty";

export class PlyElement {
    public name: string = "";
    public count: number = 0;
    public byteSize: number = 0;
    public properties: PlyProperty[] = [];
}