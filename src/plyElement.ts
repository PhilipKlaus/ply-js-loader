import { PlyProperty } from ".";

export class PlyElement {
  private itsProperties: Map<string, PlyProperty>;
  constructor(public name: string, public amount: number) {
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
