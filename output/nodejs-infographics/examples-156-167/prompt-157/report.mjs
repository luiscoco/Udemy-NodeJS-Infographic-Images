import { mkdir } from 'node:fs/promises';

await mkdir('./reports', { recursive: true });
process.report.directory = './reports';
process.report.excludeEnv = true;

const data = process.report.getReport(new Error('Lab checkpoint'));
console.log(data.header.nodejsVersion);
console.log(Array.isArray(data.libuv));
console.log(process.report.writeReport());
