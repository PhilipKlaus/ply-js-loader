export function extractHeader(plyFile: string): string {
  let endHeaderIndex: number = plyFile.lastIndexOf("end_header");
  if (endHeaderIndex === -1) {
    throw new Error("end_header not present");
  }
  endHeaderIndex += "end_header".length;
  const headerString: string = plyFile.slice(0, endHeaderIndex);
  return headerString;
}
