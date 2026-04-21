export function gradeVerdict(verdict: "pass" | "fail" | "needs_patch" | "false_positive"): number {
  return verdict === "pass" ? 100 : verdict === "false_positive" ? 70 : 0;
}
