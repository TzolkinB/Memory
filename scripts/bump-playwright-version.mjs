import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const ciWorkflowPath = resolve(repoRoot, '.github/workflows/cicd.yml');

const rawVersion = process.argv[2];
if (!rawVersion) {
  console.error('Usage: npm run bump:playwright -- <x.y.z>');
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(rawVersion)) {
  console.error(`Invalid version "${rawVersion}". Expected format: x.y.z`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
if (!packageJson.devDependencies || !packageJson.devDependencies['@playwright/test']) {
  console.error('Missing devDependency: @playwright/test in package.json');
  process.exit(1);
}

const previousNpmVersion = packageJson.devDependencies['@playwright/test'];
packageJson.devDependencies['@playwright/test'] = `^${rawVersion}`;
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');

const workflowBefore = readFileSync(ciWorkflowPath, 'utf8');
const imageRegex = /(mcr\.microsoft\.com\/playwright:v)(\d+\.\d+\.\d+)(-[^\s'"\n]+)/;
const imageMatch = workflowBefore.match(imageRegex);

if (!imageMatch) {
  console.error(
    'Could not find Playwright Docker image tag in .github/workflows/cicd.yml',
  );
  process.exit(1);
}

const previousImageVersion = imageMatch[2];
const workflowAfter = workflowBefore.replace(imageRegex, `$1${rawVersion}$3`);
writeFileSync(ciWorkflowPath, workflowAfter, 'utf8');

console.log('Playwright versions updated.');
console.log(`- @playwright/test: ${previousNpmVersion} -> ^${rawVersion}`);
console.log(`- Docker image: v${previousImageVersion} -> v${rawVersion}`);
console.log('Run `npm install` to refresh package-lock.json if needed.');
