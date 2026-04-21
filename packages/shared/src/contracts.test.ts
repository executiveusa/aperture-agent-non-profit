import test from "node:test";
import assert from "node:assert/strict";
import { EnvironmentSchema } from "./index.js";

test("environment schema validates", () => {
  const parsed = EnvironmentSchema.parse({
    id: "env_local",
    name: "Local",
    profile: "local",
    baseUrl: "https://example.org",
    allowDestructiveActions: false
  });
  assert.equal(parsed.profile, "local");
});
