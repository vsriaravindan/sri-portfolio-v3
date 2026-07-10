import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
      <p className="mono-label text-[var(--accent)]">404</p>
      <h1 className="display-head mt-4 text-[length:var(--type-display-lg)] leading-[var(--leading-display-lg)]">
        Not <em>Found</em>
      </h1>
      <p className="mt-4 max-w-md text-sm text-[var(--text-secondary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn btn-solid mt-8">
        Go Home
      </Link>
    </div>
  );
}
