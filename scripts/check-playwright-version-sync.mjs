import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const workflowPath = resolve(repoRoot, '.github/workflows/cicd.yml');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const workflow = readFileSync(workflowPath, 'utf8');

const playwrightSpec = packageJson.devDependencies?.['@playwright/test'];
if (typeof playwrightSpec !== 'string') {
  console.error('Missing devDependency: @playwright/test in package.json');
  process.exit(1);
}

const versionMatch = playwrightSpec.match(/\d+\.\d+\.\d+/);
if (!versionMatch) {
  console.error(
    `Could not parse a concrete version from @playwright/test spec: ${playwrightSpec}`,
  );
  process.exit(1);
}

const expectedVersion = versionMatch[0];
const imageMatch = workflow.match(/mcr\.microsoft\.com\/playwright:v(\d+\.\d+\.\d+)-/);
if (!imageMatch) {
  console.error(
    'Could not find Playwright Docker image tag in .github/workflows/cicd.yml',
  );
  process.exit(1);
}

const imageVersion = imageMatch[1];
if (expectedVersion !== imageVersion) {
  console.error(
    [
      'Playwright version mismatch detected:',
      `- @playwright/test: ${playwrightSpec} (parsed ${expectedVersion})`,
      `- Docker image: mcr.microsoft.com/playwright:v${imageVersion}-...`,
      'Keep both values aligned in package.json and .github/workflows/cicd.yml.',
    ].join('\n'),
  );
  process.exit(1);
}

console.log(
  `Playwright versions are in sync: @playwright/test=${expectedVersion}, image=v${imageVersion}`,
);
