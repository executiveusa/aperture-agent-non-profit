import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "./db.js";

const current = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(current, "schema.sql"), "utf8");

await pool.query(schema);
console.log("migrations applied");
await pool.end();
