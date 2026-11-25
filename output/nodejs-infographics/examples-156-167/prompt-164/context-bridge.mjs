import { AsyncLocalStorage } from 'node:async_hooks';

const context = new AsyncLocalStorage();
let plain, bound, captured;

context.run({ id: 'A' }, () => {
  plain = () => context.getStore()?.id;
  bound = AsyncLocalStorage.bind(plain);
  captured = AsyncLocalStorage.snapshot();
});

console.log(plain());
console.log(bound());
console.log(captured(plain));
