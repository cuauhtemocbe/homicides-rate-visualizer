/**
 * Tests for design tokens declared in index.css (issue #17)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, './index.css'), 'utf-8');

describe('--font-display token', () => {
  it('is declared with a documented system fallback chain', () => {
    const match = css.match(/--font-display:\s*([^;]+);/);
    expect(match, '--font-display custom property should be declared in index.css').not.toBeNull();

    const value = match![1];
    const systemFallbacks = ['sans-serif', 'serif', 'monospace', 'system-ui'];
    const hasSystemFallback = systemFallbacks.some((fallback) => value.includes(fallback));

    expect(hasSystemFallback).toBe(true);
  });
});
