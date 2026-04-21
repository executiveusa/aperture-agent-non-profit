export const skillKeys = [
  "donation_guard",
  "checkout_guard",
  "lead_form_guard",
  "ui_regression_guard",
  "bug_repro_capture",
  "backoffice_ops",
  "post_deploy_smoke",
  "release_gate_report"
] as const;

export type SkillKey = (typeof skillKeys)[number];

export function getSkillDescription(skill: SkillKey): string {
  return `${skill} executes Execute -> Verify -> Capture Evidence -> Report pipeline.`;
}
