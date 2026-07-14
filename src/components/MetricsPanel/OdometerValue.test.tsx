/**
 * Tests for OdometerValue (issue #19: rolling digit animation)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OdometerValue } from './OdometerValue';

describe('OdometerValue', () => {
  it('renders the formatted value in a screen-reader-only element', () => {
    render(<OdometerValue value={23616} animate={false} />);

    const srText = screen.getByTestId('odometer-value').querySelector('.sr-only');
    expect(srText).toHaveTextContent('23,616');
  });

  it('positions each digit reel at the correct digit via transform', () => {
    const { container } = render(<OdometerValue value={5} animate={false} />);

    const reelInner = container.querySelector('[aria-hidden="true"] > span > span');
    expect(reelInner).toHaveStyle({ transform: 'translateY(-5em)' });
  });

  it('does not apply a transition class when animate is false', () => {
    const { container } = render(<OdometerValue value={100} animate={false} />);

    expect(container.querySelector('.transition-transform')).not.toBeInTheDocument();
  });

  it('applies a transition class to each digit reel when animate is true', () => {
    const { container } = render(<OdometerValue value={100} animate={true} />);

    const reels = container.querySelectorAll('.transition-transform');
    expect(reels.length).toBeGreaterThan(0);
  });

  it('renders non-digit characters (thousand separators) statically', () => {
    render(<OdometerValue value={23616} animate={false} />);

    const srText = screen.getByTestId('odometer-value').querySelector('.sr-only');
    expect(srText?.textContent).toContain(',');
  });
});
