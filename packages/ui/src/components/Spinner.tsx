interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-label="Loading"
      role="status"
      style={{ animation: 'spin 0.9s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="var(--color-border-default)"
        strokeWidth="2"
      />
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeDasharray="12 32"
        strokeLinecap="round"
      />
    </svg>
  );
}
