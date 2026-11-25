import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  InMemorySpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace";
export async function telemetry() {
  const exporter = new InMemorySpanExporter();
  const processor = new SimpleSpanProcessor({ exporter });
  const sdk = new NodeSDK({ spanProcessors: [processor] });
  await sdk.start();
  return { sdk, exporter, processor };
}
