/**
 * Tests for DualChart (issue #18: on-brand loading states)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DualChart } from './DualChart';

describe('DualChart', () => {
  it('shows a branded loading indicator with role="status" while the chart module loads', () => {
    render(<DualChart />);

    const status = screen.getByRole('status', { name: 'Cargando gráfica...' });
    expect(status).toBeInTheDocument();
  });
});
