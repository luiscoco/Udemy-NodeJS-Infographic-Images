import domain from "node:domain";
const data = new Buffer("hello");
const scope = domain.create();
scope.run(() => console.log(data.toString()));
