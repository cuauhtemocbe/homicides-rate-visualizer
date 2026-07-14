/**
 * Tests for DataSourceFooter (issue #24: center the projections note as its own block)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataSourceFooter } from './DataSourceFooter';

describe('DataSourceFooter', () => {
  it('renders the "Nota sobre Proyecciones" label as its own block element, separate from the paragraph', () => {
    render(<DataSourceFooter />);

    const label = screen.getByText('Nota sobre Proyecciones');
    expect(label.tagName).toBe('P');
    expect(label.textContent).not.toMatch(/proyectados/);

    const paragraph = label.nextElementSibling;
    expect(paragraph).not.toBeNull();
    expect(paragraph!.tagName).toBe('P');
    expect(paragraph!.textContent).toMatch(/proyectados/);
    expect(label).not.toBe(paragraph);
  });

  it('centers both the label and the explanatory paragraph', () => {
    render(<DataSourceFooter />);

    const label = screen.getByText('Nota sobre Proyecciones');
    const paragraph = label.nextElementSibling as HTMLElement;

    expect(label.className).toMatch(/text-center/);
    expect(paragraph.className).toMatch(/text-center/);
  });
});
