import { Worker } from "bullmq";
import IORedis from "ioredis";
import pino from "pino";
import { runSkillExecution } from "@aperture/agent-core";

const logger = pino({ name: "aperture-worker" });
const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", { maxRetriesPerRequest: null });

const worker = new Worker(
  "aperture-runs",
  async (job) => {
    logger.info({ jobId: job.id, name: job.name }, "processing run job");
    return runSkillExecution({ runId: String(job.id), url: String(job.data.url ?? "https://example.org"), outputDir: process.env.EVIDENCE_DIR ?? "./artifacts" });
  },
  { connection }
);

worker.on("completed", (job) => logger.info({ jobId: job.id }, "job completed"));
worker.on("failed", (job, err) => logger.error({ jobId: job?.id, err }, "job failed"));

process.on("SIGTERM", async () => {
  await worker.close();
  await connection.quit();
});
