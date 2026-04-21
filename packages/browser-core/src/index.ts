export interface BrowserEvidence {
  fullPageScreenshotPath: string;
  stepScreenshotPaths: string[];
  tracePath: string;
  domSnapshotPath: string;
  consoleLogPath: string;
  failedNetworkPath: string;
  actionLogPath: string;
}

export interface ExecuteOptions {
  runId: string;
  targetUrl: string;
  outputDir: string;
}

export async function executeDeterministicRun(options: ExecuteOptions): Promise<BrowserEvidence> {
  return {
    fullPageScreenshotPath: `${options.outputDir}/${options.runId}/full.png`,
    stepScreenshotPaths: [`${options.outputDir}/${options.runId}/step-1.png`],
    tracePath: `${options.outputDir}/${options.runId}/trace.zip`,
    domSnapshotPath: `${options.outputDir}/${options.runId}/dom.html`,
    consoleLogPath: `${options.outputDir}/${options.runId}/console.json`,
    failedNetworkPath: `${options.outputDir}/${options.runId}/network-failures.json`,
    actionLogPath: `${options.outputDir}/${options.runId}/actions.json`
  };
}
