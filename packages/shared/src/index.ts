import { z } from "zod";

export const RunStatus = z.enum(["queued", "running", "succeeded", "failed", "cancelled"]);
export const VerdictStatus = z.enum(["pass", "fail", "needs_patch", "false_positive"]);

export const EnvironmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  profile: z.enum(["staging", "production", "sandbox", "local"]),
  baseUrl: z.string().url(),
  allowDestructiveActions: z.boolean().default(false)
});

export const JobSchema = z.object({
  id: z.string(),
  environmentId: z.string(),
  skillKey: z.string(),
  name: z.string(),
  cron: z.string().nullable(),
  active: z.boolean()
});

export const RunSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  status: RunStatus,
  verdict: VerdictStatus.nullable(),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable()
});

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional()
});

export type Environment = z.infer<typeof EnvironmentSchema>;
export type Job = z.infer<typeof JobSchema>;
export type Run = z.infer<typeof RunSchema>;
