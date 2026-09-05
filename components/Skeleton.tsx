// Shared skeleton primitive. Pulse-animates, takes any size.
// Used by per-route loading.tsx files for a non-janky first paint.
export default function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = false,
  className = '',
}: {
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded ? '9999px' : '2px',
      }}
    />
  );
}
