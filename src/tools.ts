export function extractHeader(plyFile: string): string {
  let endHeaderIndex: number = plyFile.lastIndexOf("end_header");
  if (endHeaderIndex === -1) {
    throw new Error("end_header not present");
  }
  endHeaderIndex += "end_header".length;
  const headerString: string = plyFile.slice(0, endHeaderIndex);
  return headerString;
}
// https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer

export function toArrayBuffer(buffer: Buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

export function toBuffer(arrayBuffer: ArrayBuffer) {
  var buf = Buffer.alloc(arrayBuffer.byteLength);
  var view = new Uint8Array(arrayBuffer);
  for (var i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}
