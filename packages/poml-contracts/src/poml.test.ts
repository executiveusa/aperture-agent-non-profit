import test from "node:test";
import assert from "node:assert/strict";
import { APERTURE_POML_VERSION } from "./index.js";

test("poml version is set", () => {
  assert.match(APERTURE_POML_VERSION, /^\d+\.\d+\.\d+$/);
});
