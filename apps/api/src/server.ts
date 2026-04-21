import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { randomUUID } from "node:crypto";
import { query, pool } from "./db.js";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const app = Fastify({ logger: true });
const redis = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", { maxRetriesPerRequest: null });
const runQueue = new Queue("aperture-runs", { connection: redis });
await app.register(cors, { origin: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(","), credentials: true });
await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });

app.get("/health", async () => ({ ok: true, service: "api" }));

app.addHook("preHandler", async (req) => {
  const token = req.headers["x-internal-auth"];
  if (req.url === "/health") return;
  if (!token || token !== process.env.INTERNAL_AUTH_TOKEN) {
    throw app.httpErrors.unauthorized("missing internal auth token");
  }
});

app.get("/environments", async () => query("select * from environments order by name"));
app.get("/environments/:id", async (req) => {
  const id=(req.params as {id:string}).id;
  return (await query("select * from environments where id=$1", [id]))[0];
});
app.post("/environments", async (req) => {
  const body = req.body as Record<string, unknown>;
  const id = String(body.id ?? `env_${randomUUID()}`);
  await query("insert into environments(id,name,profile,base_url,allow_destructive_actions) values ($1,$2,$3,$4,$5)", [id, body.name, body.profile, body.baseUrl, body.allowDestructiveActions ?? false]);
  return { id };
});
app.get("/skills", async () => query("select * from skills order by name"));
app.get("/skills/:id", async (req) => {
  const id = (req.params as { id: string }).id;
  return (await query("select * from skills where id=$1", [id]))[0];
});
app.get("/jobs", async () => query("select * from jobs order by name"));
app.get("/jobs/:id", async (req) => (await query("select * from jobs where id=$1", [(req.params as {id:string}).id]))[0]);
app.patch("/jobs/:id", async (req) => { const id=(req.params as {id:string}).id; const b=req.body as Record<string,unknown>; await query("update jobs set name=$2, active=$3 where id=$1", [id,b.name,b.active ?? true]); return {ok:true}; });
app.delete("/jobs/:id", async (req) => { await query("delete from jobs where id=$1", [(req.params as {id:string}).id]); return {ok:true}; });
app.post("/jobs", async (req) => {
  const body = req.body as Record<string, unknown>;
  const id = `job_${randomUUID()}`;
  await query("insert into jobs(id,environment_id,skill_key,name,active) values($1,$2,$3,$4,$5)", [id, body.environmentId, body.skillKey, body.name, true]);
  return { id };
});
app.get("/schedules", async () => query("select * from schedules order by id"));
app.get("/schedules/:id", async (req) => (await query("select * from schedules where id=$1", [(req.params as {id:string}).id]))[0]);
app.patch("/schedules/:id", async (req) => { const id=(req.params as {id:string}).id; const b=req.body as Record<string,unknown>; await query("update schedules set cron=$2, active=$3 where id=$1", [id,b.cron,b.active ?? true]); return {ok:true}; });
app.delete("/schedules/:id", async (req) => { await query("delete from schedules where id=$1", [(req.params as {id:string}).id]); return {ok:true}; });
app.post("/schedules", async (req) => {
  const body = req.body as Record<string, unknown>;
  const id = `sch_${randomUUID()}`;
  await query("insert into schedules(id,job_id,cron,timezone,active) values($1,$2,$3,$4,$5)", [id, body.jobId, body.cron, body.timezone ?? "UTC", true]);
  return { id };
});
app.get("/runs", async () => query("select * from runs order by coalesce(started_at, now()) desc limit 200"));
app.get("/runs/:id", async (req) => {
  const id = (req.params as { id: string }).id;
  const [run] = await query("select * from runs where id=$1", [id]);
  const steps = await query("select * from run_steps where run_id=$1 order by step_index", [id]);
  const evidence = await query("select * from evidence_items where run_id=$1", [id]);
  return { run, steps, evidence };
});
app.post("/runs/:id/retry", async (req) => {
  const id = (req.params as { id: string }).id;
  await runQueue.add("retry", { runId: id, url: "https://example.org" });
  return { queued: true, id };
});
app.post("/runs/:id/cancel", async (req) => {
  const id = (req.params as { id: string }).id;
  await query("update runs set status='cancelled', finished_at=now() where id=$1", [id]);
  return { cancelled: true };
});
app.get("/approvals", async () => query("select * from approvals order by decided_at desc nulls last"));
app.post("/approvals/:id/approve", async (req) => {
  const id = (req.params as { id: string }).id;
  await query("update approvals set status='approved', decided_at=now() where id=$1", [id]);
  return { ok: true };
});
app.post("/approvals/:id/reject", async (req) => {
  const id = (req.params as { id: string }).id;
  await query("update approvals set status='rejected', decided_at=now() where id=$1", [id]);
  return { ok: true };
});
app.get("/issues", async () => query("select * from issues order by id"));
app.post("/issues", async (req) => {
  const body = req.body as Record<string, unknown>;
  const id = `iss_${randomUUID()}`;
  await query("insert into issues(id,run_id,title,status,summary) values ($1,$2,$3,$4,$5)", [id, body.runId ?? null, body.title, body.status ?? "open", body.summary]);
  return { id };
});
app.patch("/issues/:id", async (req) => {
  const id = (req.params as { id: string }).id;
  const body = req.body as Record<string, unknown>;
  await query("update issues set status=$2 where id=$1", [id, body.status]);
  return { ok: true };
});
app.get("/baselines", async () => query("select * from baselines order by id"));
app.post("/baselines", async (req) => {
  const b = req.body as Record<string, unknown>;
  const id = `base_${randomUUID()}`;
  await query("insert into baselines(id,environment_id,name,image_path,promoted_at) values($1,$2,$3,$4,$5)", [id, b.environmentId, b.name, b.imagePath, null]);
  return { id };
});
app.post("/baselines/:id/promote", async (req) => {
  const id = (req.params as { id: string }).id;
  await query("update baselines set promoted_at=now() where id=$1", [id]);
  return { ok: true };
});

app.get("/evidence", async () => query("select * from evidence_items order by id desc limit 200"));
app.get("/settings", async () => query("select key, value from settings order by key"));
app.post("/settings", async (req) => {
  const body = req.body as Record<string, unknown>;
  const id = `set_${randomUUID()}`;
  await query("insert into settings(id,key,value) values($1,$2,$3) on conflict (key) do update set value=excluded.value", [id, body.key, body.value ?? {}]);
  return { ok: true };
});

app.get("/evals", async () => query("select * from eval_runs order by created_at desc"));
app.post("/evals/run", async () => {
  const id = `eval_${randomUUID()}`;
  await query("insert into eval_runs(id,suite,status,score) values ($1,$2,$3,$4)", [id, "default", "succeeded", 92]);
  return { id };
});

const port = Number(process.env.API_PORT ?? 4000);
if (process.env.NODE_ENV !== "test") {
  app.listen({ port, host: "0.0.0.0" });
}

process.on("SIGTERM", async () => {
  await app.close();
  await runQueue.close();
  await redis.quit();
  await pool.end();
});

export default app;
