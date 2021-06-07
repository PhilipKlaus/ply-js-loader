import { PlyProperty } from ".";

export class PlyElement {
  private itsProperties: Map<string, PlyProperty>;
  private itsName: string;
  private itsAmount: number;

  constructor(name: string, amount: number) {
    this.itsProperties = new Map<string, PlyProperty>();
    this.itsName = name;
    this.itsAmount = amount;
  }

  public getName(): string {
    return this.itsName;
  }

  public getAmount(): number {
    return this.itsAmount;
  }

  public addProperty(property: PlyProperty) {
    this.itsProperties.set(property.getName(), property);
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
}
