import { test, expect } from '@playwright/test';
import { shuffle, createSeededRandom } from '../src/components/Main.reducer';

/**
 * Unit tests for the shuffle utility.
 *
 * These run in Node.js (no page fixture needed) and verify that:
 * - A seeded shuffle is deterministic (same seed → same order)
 * - Different seeds produce different orderings
 * - The production (unseeded) shuffle produces genuine variation
 */
test.describe('shuffle', () => {
  test('same seed always produces the same order', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const run1 = shuffle([...items], createSeededRandom(42));
    const run2 = shuffle([...items], createSeededRandom(42));
    expect(run1).toEqual(run2);
  });

  test('different seeds produce different orderings', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const run1 = shuffle([...items], createSeededRandom(42));
    const run2 = shuffle([...items], createSeededRandom(99));
    expect(run1).not.toEqual(run2);
  });

  test('unseeded shuffle produces variation across multiple runs', () => {
    // With 12 items the chance of any two runs being identical is 1/12! ≈ 2e-9.
    // Observing more than one distinct ordering across 10 runs confirms
    // Math.random is wired in for production builds.
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const seen = new Set<string>();
    for (let i = 0; i < 10; i++) {
      seen.add(JSON.stringify(shuffle([...items])));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  test('shuffle does not add or remove items', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const result = shuffle([...items], createSeededRandom(42));
    expect(result.sort((a, b) => a - b)).toEqual(items);
  });
});
