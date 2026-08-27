import { cp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const source = path.join(
  workspaceRoot,
  "artifacts",
  "northstar-dashboard",
  "vercel",
  "api",
);
const destination = path.join(workspaceRoot, "api");

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });