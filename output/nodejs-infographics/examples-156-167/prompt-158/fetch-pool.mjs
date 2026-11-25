import { Agent } from 'undici';

const dispatcher = new Agent({ connections: 2, pipelining: 1 });
try {
  for (let i = 0; i < 2; i++) {
    const response = await fetch('http://127.0.0.1:3000/health', {
      dispatcher,
      signal: AbortSignal.timeout(1_000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      throw new Error('HTTP ' + response.status);
    }
    console.log(await response.text());
  }
} finally {
  await dispatcher.close();
}
