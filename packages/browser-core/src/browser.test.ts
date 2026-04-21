import test from "node:test";
import assert from "node:assert/strict";
import { executeDeterministicRun } from "./index.js";

test("executeDeterministicRun returns expected evidence paths", async () => {
  const evidence = await executeDeterministicRun({ runId: "run_1", targetUrl: "https://example.org", outputDir: "artifacts" });
  assert.equal(evidence.tracePath, "artifacts/run_1/trace.zip");
});
