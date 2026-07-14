/**
 * OdometerValue - rolls digits vertically to a new value (issue #19)
 *
 * Non-digit characters (thousand separators) render statically; each digit
 * gets its own fixed-height, overflow-hidden "reel" of 0-9 that's translated
 * to the target digit. When `animate` is false the same transform is applied
 * without a transition, so the number still lands on the right value with no
 * visible roll (initial load, reduced motion).
 */

interface DigitReelProps {
  digit: string;
  animate: boolean;
}

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

const DigitReel = ({ digit, animate }: DigitReelProps) => (
  <span className="inline-block h-[1em] overflow-hidden align-bottom leading-none">
    <span
      className={`flex flex-col ${animate ? 'transition-transform duration-500 ease-out' : ''}`}
      style={{ transform: `translateY(-${Number(digit)}em)` }}
    >
      {DIGITS.map((n) => (
        <span key={n} className="h-[1em] leading-none">
          {n}
        </span>
      ))}
    </span>
  </span>
);

interface Props {
  value: number;
  animate: boolean;
  locale?: string;
  className?: string;
}

export const OdometerValue = ({ value, animate, locale = 'es-MX', className = '' }: Props) => {
  const formatted = value.toLocaleString(locale);

  return (
    <span className={`relative inline-block ${className}`} data-testid="odometer-value">
      <span aria-hidden="true">
        {formatted.split('').map((char, index) =>
          /[0-9]/.test(char) ? (
            <DigitReel key={index} digit={char} animate={animate} />
          ) : (
            <span key={index} className="inline-block">
              {char}
            </span>
          )
        )}
      </span>
      <span className="sr-only">{formatted}</span>
    </span>
  );
};
