import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type Attachment = {
  name?: string;
  contentType?: string;
  path?: string;
};

type TestResult = {
  status?: string;
  error?: { message?: string };
  attachments?: Attachment[];
};

type TestCase = {
  projectName?: string;
  results?: TestResult[];
};

type Spec = {
  title?: string;
  file?: string;
  line?: number;
  tests?: TestCase[];
};

type Suite = {
  suites?: Suite[];
  specs?: Spec[];
};

type ReportJson = {
  suites?: Suite[];
};

const reportPath = 'playwright-report/report.json';
const outputPath = 'playwright-report/dossier.md';
const outputDir = path.dirname(outputPath);

const toDossierRelativePath = (filePath: string): string =>
  path.relative(outputDir, filePath).split(path.sep).join('/');

if (!existsSync(reportPath)) {
  const message =
    '# Playwright failure dossier\n\n' +
    'No report data found at `playwright-report/report.json`.\n\n' +
    'Run `npm run test:e2e` first, then run `npm run dossier`.\n';
  writeFileSync(outputPath, message);
  console.error(
    'No Playwright JSON report found at playwright-report/report.json. ' +
      'Wrote an empty dossier with next steps.'
  );
  process.exit(0);
}

const reportJson = JSON.parse(readFileSync(reportPath, 'utf8')) as ReportJson;

function collectSpecs(suites: Suite[]): Spec[] {
  return suites.flatMap((suite) => [
    ...(suite.specs ?? []),
    ...collectSpecs(suite.suites ?? []),
  ]);
}

const failures = collectSpecs(reportJson.suites ?? []).flatMap((spec) =>
  (spec.tests ?? []).flatMap((test) => {
    const failedResult = (test.results ?? []).find(
      (result) => result.status === 'failed' || result.status === 'timedOut'
    );
    return failedResult
      ? [{ spec, failedResult, projectName: test.projectName }]
      : [];
  })
);

const screenshot = (attachments: Attachment[]): string => {
  const file = (attachments ?? []).find(
    (attachment) =>
      attachment.contentType?.startsWith('image/') && attachment.path
  );
  return file && file.path
    ? `**Screenshot**: [${path.basename(file.path)}](${toDossierRelativePath(file.path)})\n`
    : '';
};

const trace = (attachments: Attachment[]): string => {
  const file = (attachments ?? []).find(
    (attachment) => attachment.name === 'trace' && attachment.path
  );
  return file && file.path
    ? `**Trace**: [${path.basename(file.path)}](${toDossierRelativePath(file.path)})\n` +
        `**Open Trace**: \`npx playwright show-trace "${file.path}"\`\n`
    : '';
};

const markdown = failures
  .map(
    ({ spec, failedResult, projectName }) => `
## ${spec.title ?? 'Untitled spec'}

**Project**: \`${projectName ?? 'unknown'}\`

**File**: \`${spec.file ?? 'unknown'}:${spec.line ?? 0}\`

**Error**:
\`\`\`
${failedResult.error?.message ?? 'Unknown error'}
\`\`\`

${screenshot(failedResult.attachments ?? [])}${trace(failedResult.attachments ?? [])}
**Reproduce**:
\`\`\`sh
npx playwright test --project=${projectName ?? 'chromium'} ${spec.file ?? ''} -g ${JSON.stringify(spec.title ?? '')}
\`\`\`
`
  )
  .join('\n---\n');

writeFileSync(
  outputPath,
  markdown || '# Playwright failure dossier\n\nNo failing tests.\n'
);
console.error(`Wrote dossier for ${failures.length} failures`);
