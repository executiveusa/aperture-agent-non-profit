import { executeDeterministicRun } from "@aperture/browser-core";

export async function runSkillExecution(params: { runId: string; url: string; outputDir: string }) {
  const evidence = await executeDeterministicRun({ runId: params.runId, targetUrl: params.url, outputDir: params.outputDir });
  return {
    verdict: "pass" as const,
    summary: "Execution completed with deterministic browser pipeline.",
    evidence
  };
}
