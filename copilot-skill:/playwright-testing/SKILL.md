---
name: playwright-testing
description: 'Playwright testing best practices and patterns. USE FOR: writing Playwright tests, debugging test selectors, implementing accessibility testing, choosing proper locators, fixing test flakiness, test organization. Covers semantic locators, accessibility-first testing, anti-patterns to avoid, and efficient testing workflows.'
---

# Playwright Testing Best Practices

## When a Test Fails

1. Run `npm run dossier` to generate a summary at `playwright-report/dossier.md`.
2. Read the dossier. It contains the error, screenshot path, trace path, and reproduction command for every failing test.
3. Use the reproduction command to rerun just the failing test while iterating.
4. Do not "fix" a failing test by changing the assertion. Fix the underlying code.
5. Do not add `console.log` calls to test files to debug. The trace already has the DOM at every step; open it with `npx playwright show-trace <path>`.
6. Remove any temporary files created only for test debugging or diagnosis once tests are passing. Do not leave scratch scripts, throwaway notes, or one-off artifacts in the repository.

## Accessibility-First Testing

### ✅ PREFERRED: Semantic HTML + ARIA + Role Locators

```typescript
// Best practice: Use proper ARIA attributes in components
<button
  role="button"
  aria-expanded={isOpen}
  aria-label="Expand menu"
>

// Then test with semantic locators
page.getByRole('button', { expanded: true })
page.getByRole('button', { name: 'Expand menu' })
```

### Accessibility Testing Integration

```typescript
// getByRole automatically validates ARIA attributes - no need to test separately
page.getByRole('button', { expanded: true }); // ← This confirms aria-expanded="true" exists

// Test keyboard navigation
await card.press('Enter');
await card.press('Space');

// Test screen reader content
await expect(card).toHaveAccessibleName('Face-up card with robot 3');

// More specific locators when multiple buttons exist
page.getByTestId('card').and(page.getByRole('button', { expanded: true }));

// Efficient accessibility testing - avoid redundant checks
export const expectElementAccessible = async (element: Locator) => {
  await expect(element).toHaveAttribute('tabindex', '0');
  await expect(element).toHaveAccessibleName(); // Should have some accessible name
  // NOTE: Don't test aria-expanded separately if using getByRole({ expanded: true })
};
```

### Automated Accessibility Testing Tools

```typescript
// Option 1: Use Playwright's axe integration (recommended for comprehensive testing)
import { injectAxe, checkA11y } from 'axe-playwright';

test('accessibility compliance', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page);
});

// Option 2: Manual utility functions for specific ARIA patterns (good for targeted testing)
await expectCardAccessible(card, true); // Custom utility for specific components

// Option 3: Both together - automated scans + targeted manual checks
test('comprehensive accessibility', async ({ page }) => {
  // Automated scan first
  await injectAxe(page);
  await checkA11y(page);

  // Then specific component testing
  const cards = page.getByTestId('card');
  for (const card of await cards.all()) {
    await expectCardAccessible(card, false); // Verify each card
  }
});
```

## Locator Hierarchy (Official Playwright Recommendations)

### 1. ✅ PREFERRED: User-Facing Locators

```typescript
// Most reliable - mirrors how users interact
page.getByRole('button', { name: 'Submit' });
page.getByText('Blue Player');
page.getByLabel('Username');
page.getByPlaceholder('Enter email');
```

### 2. ✅ GOOD: Test ID Locators

```typescript
page.getByTestId('card'); // For elements without semantic roles
```

### 3. ❌ DO NOT USE: CSS Selectors

```typescript
// Do not use CSS selectors. If no semantic locator applies, add a data-testid to the
// element and use getByTestId instead.
page.locator('#app > div.main > .card:nth-child(2)'); // ❌ Brittle, breaks easily
page.locator('[data-testid="card"][data-face-up="true"]'); // ❌ Use getByTestId + filter instead
```

## Filtering Best Practices

### ✅ CORRECT: Filter by Attribute Using getByTestId + filter

```typescript
// Use getByTestId to find the element, then filter by attribute
page
  .getByTestId('card')
  .filter(async (loc) => (await loc.getAttribute('data-face-up')) === 'true');
```

### ✅ ALTERNATIVE: Filter with Function (when CSS isn't possible)

```typescript
// More complex conditions that can't be expressed in CSS
page.getByTestId('card').filter(async (locator) => {
  const text = await locator.textContent();
  return text?.includes('active');
});
```

### ❌ INCORRECT: Filter with `has` for attributes

```typescript
// This looks for CHILDREN with the attribute, not the element itself
page.getByTestId('card').filter({ has: page.locator('[data-face-up="true"]') });
```

### ✅ CORRECT: Filter with `has` for content

```typescript
// Use `has` when filtering by child elements/content
page.getByTestId('product').filter({ has: page.getByText('Sale') });
```

## Accessibility Testing Best Practices

### Essential ARIA Patterns

```typescript
// Interactive elements should have proper roles AND keyboard handlers
<div
  role="button"
  aria-expanded={isOpen}
  aria-label="Toggle menu"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>

// Form elements need labels
<input aria-label="Username" />
<select aria-label="Choose option">

// Dynamic content needs live regions
<div aria-live="polite" aria-atomic="true">Status updated</div>
```

### Keyboard Navigation Testing

```typescript
// Test all interactive elements work with keyboard
await element.press('Enter');
await element.press('Space');
await element.press('Tab');

// Verify focus management
await expect(nextElement).toBeFocused();
```

### Screen Reader Testing

```typescript
// Verify accessible names and descriptions
await expect(button).toHaveAccessibleName('Submit form');
await expect(input).toHaveAccessibleDescription('Enter your email address');

// Test ARIA states
await expect(accordion).toHaveAttribute('aria-expanded', 'false');
await expect(checkbox).toHaveAttribute('aria-checked', 'true');
```

### Color/Contrast Independence

```typescript
// Ensure functionality doesn't depend only on color
// Test with browser high contrast mode
await page.emulateMedia({ media: 'screen', colorScheme: 'dark' });

// Verify content is available to screen readers, not just visual
await expect(element).toHaveAccessibleName(); // Should exist
```

## Efficient Testing Patterns

### Trust Semantic Locators

```typescript
// ✅ GOOD: getByRole validates ARIA and accessible names automatically
const expandedButtons = page.getByRole('button', {
  expanded: true,
  name: /Face-up card/,
});
await expect(expandedButtons).toHaveCount(3);

// ❌ REDUNDANT: Don't test what the locator already validates
await expect(button).toHaveAttribute('aria-expanded', 'true'); // Unnecessary
await expect(button).toHaveAccessibleName(/Face-up card/); // Unnecessary
```

### Focus on What Matters

```typescript
// ❌ DON'T: Create separate accessibility tests that duplicate semantic locator validation
export const expectCardAccessible = async (card: Locator) => {
  await expect(card).toHaveAttribute('tabindex', '0'); // Low value isolated test
};

// ✅ DO: Use semantic locators that validate accessibility through natural usage
export const getFaceUpCards = (page: Page) =>
  page.getByTestId('card').and(
    page.getByRole('button', {
      expanded: true, // validates aria-expanded="true"
      name: /Face-up card/, // validates accessible name pattern
    })
  );

// ✅ DO: Test accessibility through real user workflows
test('card flipping behavior', async ({ page }) => {
  // This inherently tests accessibility - cards must be properly marked up to be found
  await expectFaceUpCount(page, 1); // Uses semantic locators = accessibility tested
});
```

## Common Patterns

### Counting Elements with Conditions

```typescript
// Good: Start with semantic locator, then filter
const faceUpCards = page
  .getByTestId('card')
  .filter(async (loc) => (await loc.getAttribute('data-face-up')) === 'true');
await expect(faceUpCards).toHaveCount(2);
```

### Element State Verification

```typescript
// Check attributes on specific elements
await expect(card).toHaveAttribute('data-face-up', 'true');

// Check text content
await expect(page.getByTestId('score-blue')).toHaveText('3');
```

## Anti-Patterns to Avoid

1. **CSS selectors** - All CSS selectors are fragile; use semantic locators or `getByTestId`. If only CSS would work, add a `data-testid` to the element instead.
2. **Mixing locator strategies unnecessarily** - Stick to one approach when possible
3. **Using `has` for element attributes** - Use filter functions instead
4. **Hardcoded delays** - Use `waitFor` conditions instead of `setTimeout`
5. **networkidle waits** - Use specific element/content waits instead
6. **Missing accessibility attributes** - All interactive elements need proper ARIA
7. **Testing only mouse interactions** - Always test keyboard navigation
8. **Ignoring screen reader experience** - Test accessible names and descriptions
9. **ARIA without keyboard handlers** - Adding role="button" without onKeyDown is incomplete
10. **Forgetting preventDefault()** - Space key scrolls page without preventDefault()
11. **Redundant ARIA testing** - Don't test aria-expanded separately when using getByRole({ expanded: true })
12. **Over-testing semantic locators** - getByRole locators already validate the underlying ARIA attributes
13. **Redundant accessible name testing** - Don't test accessible names when using getByRole({ name: /pattern/ })

## Visual Regression Tests (toHaveScreenshot)

### Cross-Platform Snapshot Problem

macOS and Linux render fonts differently. Snapshots generated on macOS **will fail on Linux CI** even with identical code.

### Solution: Always Generate Snapshots on Linux

Use `snapshotPathTemplate` in `playwright.config.ts` to strip OS/browser suffixes from snapshot filenames — one canonical set for all platforms:

```typescript
// playwright.config.ts
export default defineConfig({
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}-snapshots/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.002,
    },
  },
});
```

Then add a **manual workflow** to regenerate snapshots on Linux and commit them back:

```yaml
# .github/workflows/update-snapshots.yml
name: Update Visual Snapshots
'on':
  workflow_dispatch:
    inputs:
      branch:
        description: 'Branch to update snapshots on'
        required: true
        default: 'master'
permissions:
  contents: write
jobs:
  update-snapshots:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.59.1-jammy
    env:
      HOME: /root
    steps:
      - uses: actions/checkout@v6
        with:
          ref: ${{ github.event.inputs.branch }}
          token: ${{ secrets.GITHUB_TOKEN }}
      - run: npm ci
      - run: rm -rf tests/visual-smoke-baseline.spec.ts-snapshots
      - run: npm run test:visual:update
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add tests/visual-smoke-baseline.spec.ts-snapshots/
          git diff --cached --quiet || git commit -m "chore(visual): update snapshots for Linux/CI [skip ci]"
          git push
```

### Workflow

1. First time setup or after UI changes: run **Actions → Update Visual Snapshots → Run workflow**
2. Commit regenerated Linux snapshots
3. Local `npm run test:visual` compares against same snapshots (may show minor mac/linux diffs locally, but CI passes)

### Snapshot Location

- ✅ Baseline snapshots → `tests/<spec>.spec.ts-snapshots/` (committed to git)
- ✅ Failure artifacts (actual, diff) → `test-results/` (gitignored, CI artifacts only)

### View Diffs After Failure

```bash
# Local
npx playwright show-report playwright-report/html

# CI: download playwright-report artifact from failed Actions run → open html/index.html
```

### Anti-Patterns

- Never generate snapshots on macOS for a Linux CI pipeline
- Don't use default snapshot naming — it includes OS/browser suffix causing cross-platform mismatches
- Don't use `waitForLoadState('networkidle')` for image readiness — use specific element waits instead

## Test Helper Rule

Helpers live in `tests/utils.ts`. Before adding a new helper:

1. Check if an existing helper already covers the assertion.
2. Only propose a new helper if it will be called in **3 or more** distinct test locations.
3. Propose the helper (name, signature, usage sites) to the user before implementing — do not add it speculatively.
4. If a pattern appears in only 1–2 places, inline it there instead.

## Key Principles

- **Start semantic**: Use role/text locators when possible
- **Be specific**: Filter down from broad to specific
- **Be resilient**: Choose selectors that survive DOM changes
- **Be readable**: Code should express user intent clearly
- **Be accessible**: Ensure tests validate accessibility, not just functionality
- **Test like users**: Include keyboard, screen reader, and assistive technology patterns
- **Integrate accessibility**: Test accessibility through normal user workflows rather than isolation
- **Trust semantic locators**: Let getByRole validate ARIA attributes automatically
