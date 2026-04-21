import { query, pool } from "./db.js";

await query("insert into environments(id,name,profile,base_url,allow_destructive_actions) values ('env_local','Local Demo','local','https://example.org',false) on conflict (id) do nothing");
await query("insert into skills(id,name,version,enabled) values ('donation_guard','donation_guard','1.0.0',true) on conflict (id) do nothing");
await query("insert into jobs(id,environment_id,skill_key,name,active) values ('job_demo','env_local','donation_guard','Demo Donation Guard',true) on conflict (id) do nothing");
console.log("seed complete");
await pool.end();
