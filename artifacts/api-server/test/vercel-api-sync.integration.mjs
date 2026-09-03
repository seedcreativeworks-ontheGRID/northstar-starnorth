import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const deployedApi = path.join(workspaceRoot, "api");
const sourceApi = path.join(
  workspaceRoot,
  "artifacts/northstar-dashboard/vercel/api",
);
const rootManifest = path.join(workspaceRoot, "package.json");

async function listFiles(root) {
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.relative(root, path.join(entry.parentPath ?? entry.path, entry.name)))
    .sort();
}

test("the deployed /api tree matches its tested source under artifacts/northstar-dashboard/vercel/api", async () => {
  const [deployedFiles, sourceFiles] = await Promise.all([
    listFiles(deployedApi),
    listFiles(sourceApi),
  ]);
  assert.deepEqual(
    deployedFiles,
    sourceFiles,
    "Vercel only discovers /api from the committed repository root -- copy the full artifacts/northstar-dashboard/vercel/api tree into /api whenever either changes.",
  );

  for (const file of sourceFiles) {
    const [deployed, source] = await Promise.all([
      readFile(path.join(deployedApi, file), "utf8"),
      readFile(path.join(sourceApi, file), "utf8"),
    ]);
    assert.equal(
      deployed,
      source,
      `/api/${file} has drifted from its tested source at artifacts/northstar-dashboard/vercel/api/${file}`,
    );
  }
});

test("root Vercel functions declare every external runtime package they load", async () => {
  const manifest = JSON.parse(await readFile(rootManifest, "utf8"));
  const dependencies = manifest.dependencies ?? {};

  for (const packageName of ["@upstash/redis", "hash-wasm", "pg"]) {
    assert.equal(
      typeof dependencies[packageName],
      "string",
      `Root Vercel functions load ${packageName}; declare it in root package.json so Vercel bundles it.`,
    );
  }
});
