/**
 * Tests for design tokens declared in index.css (issues #17, #20)
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

describe('institutional bulletin palette (#20)', () => {
  const extractBlock = (selector: string) => {
    const match = css.match(new RegExp(`${selector}\\s*\\{([^}]+)\\}`));
    expect(match, `${selector} block should be declared in index.css`).not.toBeNull();
    return match![1];
  };

  const extractToken = (block: string, token: string) => {
    const match = block.match(new RegExp(`${token}:\\s*(#[0-9A-Fa-f]{6})`));
    expect(match, `${token} should be declared`).not.toBeNull();
    return match![1].toUpperCase();
  };

  const rootBlock = extractBlock(':root');
  const darkBlock = extractBlock('\\.dark');

  const lightTokens = {
    bg: extractToken(rootBlock, '--color-bg'),
    card: extractToken(rootBlock, '--color-card'),
    text: extractToken(rootBlock, '--color-text'),
    textSecondary: extractToken(rootBlock, '--color-text-secondary'),
    border: extractToken(rootBlock, '--color-border'),
    accent: extractToken(rootBlock, '--color-accent-theme'),
    danger: extractToken(rootBlock, '--color-danger-theme'),
    success: extractToken(rootBlock, '--color-success-theme')
  };

  const darkTokens = {
    bg: extractToken(darkBlock, '--color-bg'),
    card: extractToken(darkBlock, '--color-card'),
    text: extractToken(darkBlock, '--color-text'),
    textSecondary: extractToken(darkBlock, '--color-text-secondary'),
    border: extractToken(darkBlock, '--color-border'),
    accent: extractToken(darkBlock, '--color-accent-theme'),
    danger: extractToken(darkBlock, '--color-danger-theme'),
    success: extractToken(darkBlock, '--color-success-theme')
  };

  it('resolves the dark accent token to the institutional ochre tone', () => {
    expect(darkTokens.accent).toBe('#C9A227');
  });

  it('resolves the light accent token to its institutional ochre tone', () => {
    expect(lightTokens.accent).toBe('#96751C');
  });

  it('keeps accent distinct from danger and success in both themes', () => {
    for (const tokens of [lightTokens, darkTokens]) {
      expect(new Set([tokens.accent, tokens.danger, tokens.success]).size).toBe(3);
    }
  });

  it('defines the light theme institutional values for bg, card, text and border', () => {
    expect(lightTokens.bg).toBe('#F2EEE3');
    expect(lightTokens.card).toBe('#FBF9F2');
    expect(lightTokens.text).toBe('#241F16');
    expect(lightTokens.border).toBe('#DDD5C0');
  });

  // Relative luminance / contrast ratio per WCAG 2.x
  const relativeLuminance = (hex: string) => {
    const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((h) => {
      const c = parseInt(h, 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const contrastRatio = (hexA: string, hexB: string) => {
    const lA = relativeLuminance(hexA);
    const lB = relativeLuminance(hexB);
    const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA];
    return (lighter + 0.05) / (darker + 0.05);
  };

  it.each([
    ['light', lightTokens],
    ['dark', darkTokens]
  ] as const)('meets WCAG AA body text contrast (>= 4.5:1) on bg and card in %s theme', (_name, tokens) => {
    expect(contrastRatio(tokens.text, tokens.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.text, tokens.card)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.textSecondary, tokens.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.textSecondary, tokens.card)).toBeGreaterThanOrEqual(4.5);
  });
});
