import { Transform } from "node:stream";
import { StringDecoder } from "node:string_decoder";
export class NDJSON extends Transform {
  #decoder = new StringDecoder("utf8");
  #pending = "";
  constructor({
    maxLength = 1024,
    filter = () => true,
    malformed = "fail",
  } = {}) {
    super();
    this.maxLength = maxLength;
    this.filter = filter;
    this.malformed = malformed;
    this.counts = { read: 0, accepted: 0, malformed: 0 };
  }
  #line(line) {
    if (line.length > this.maxLength) throw Error("Record too long");
    if (!line.trim()) return;
    this.counts.read++;
    let value;
    try {
      value = JSON.parse(line);
    } catch (error) {
      this.counts.malformed++;
      if (this.malformed === "fail") throw error;
      return;
    }
    if (this.filter(value)) {
      this.counts.accepted++;
      this.push(JSON.stringify(value) + "\n");
    }
  }
  #consume() {
    let end;
    while ((end = this.#pending.indexOf("\n")) >= 0) {
      const line = this.#pending.slice(0, end);
      this.#pending = this.#pending.slice(end + 1);
      this.#line(line);
    }
    if (this.#pending.length > this.maxLength) throw Error("Record too long");
  }
  _transform(chunk, enc, done) {
    try {
      this.#pending += this.#decoder.write(chunk);
      this.#consume();
      done();
    } catch (e) {
      done(e);
    }
  }
  _flush(done) {
    try {
      this.#pending += this.#decoder.end();
      this.#consume();
      if (this.#pending) this.#line(this.#pending);
      this.#pending = "";
      done();
    } catch (e) {
      done(e);
    }
  }
}
