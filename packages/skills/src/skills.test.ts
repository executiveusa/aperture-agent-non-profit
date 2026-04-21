import test from "node:test";
import assert from "node:assert/strict";
import { skillKeys } from "./index.js";

test("skills include donation_guard", () => {
  assert.ok(skillKeys.includes("donation_guard"));
});
