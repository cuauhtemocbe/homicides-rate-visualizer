/**
 * Tests for DualChart (issue #18: on-brand loading states)
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DualChart } from './DualChart';

describe('DualChart', () => {
  it('shows a branded loading indicator with role="status" while the chart module loads', () => {
    render(<DualChart />);

    const status = screen.getByRole('status', { name: 'Cargando gráfica...' });
    expect(status).toBeInTheDocument();
  });
});
