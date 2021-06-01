import { PlyAscii } from "./plyAscii";
import { extractHeader } from "./tools";

function loadFromString(src: string) {
  let header = extractHeader(src);
  let body = src.slice(header.length + 1);
  return new PlyAscii(header, body);
}

export { loadFromString, PlyAscii };
