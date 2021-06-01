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
