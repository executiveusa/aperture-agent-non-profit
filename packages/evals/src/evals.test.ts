import test from "node:test";
import assert from "node:assert/strict";
import { gradeVerdict } from "./index.js";

test("grade verdict", () => {
  assert.equal(gradeVerdict("pass"), 100);
});
