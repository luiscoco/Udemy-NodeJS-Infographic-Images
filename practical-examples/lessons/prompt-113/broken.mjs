export function total(price, percent) {
  return price * (1 - percent);
}
console.log(total(100, 20));
