import assert from "node:assert/strict";
class Inventory {
  #count = 0;
  add(n = 1) {
    this.#count += n;
    return this.#count;
  }
}
const stock = new Inventory(),
  loose = stock.add;
assert.throws(() => loose(), TypeError);
console.log("TypeError for lost receiver");
console.log(stock.add.bind(stock)(), (() => stock.add())());
