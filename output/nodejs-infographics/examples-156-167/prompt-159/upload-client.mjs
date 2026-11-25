const blob = new Blob(['hello\n'], { type: 'text/plain' });
const file = new File([blob], 'note.txt', { type: blob.type });
const form = new FormData();
form.append('file', file);

const request = new Request('http://127.0.0.1:3000/upload', {
  method: 'POST',
  headers: new Headers({ Accept: 'application/json' }),
  body: form,
  signal: AbortSignal.timeout(1_000),
});
console.log(request.headers.get('content-type')
  .startsWith('multipart/form-data; boundary='));
const response = await fetch(request);
console.log(response.status);
await response.body?.cancel();
