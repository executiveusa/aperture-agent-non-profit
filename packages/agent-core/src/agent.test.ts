import test from "node:test";
import assert from "node:assert/strict";
import { runSkillExecution } from "./index.js";

test("runSkillExecution returns pass verdict", async () => {
  const result = await runSkillExecution({ runId: "run_2", url: "https://example.org", outputDir: "artifacts" });
  assert.equal(result.verdict, "pass");
});
