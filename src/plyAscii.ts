import { Ply } from "./plyFile";

export class PlyAscii extends Ply {
  private itsBody: string;

  constructor(header: string, body: string) {
    super(header);
    this.itsBody = body;
  }
}
