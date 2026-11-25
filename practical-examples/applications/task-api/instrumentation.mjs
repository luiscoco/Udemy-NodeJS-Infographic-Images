import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace";
export const sdk = new NodeSDK({ traceExporter: new ConsoleSpanExporter() });
await sdk.start();
