export function discount(total, member) {
  if (total < 0) throw Error("Invalid total");
  return member ? total * 0.9 : total;
}
