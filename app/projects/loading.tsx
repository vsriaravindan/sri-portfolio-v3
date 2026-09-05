import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36" aria-busy="true">
      <Skeleton width="120px" height="0.72rem" className="mb-4" />
      <Skeleton width="50%" height="clamp(1.6rem, 3.4vw, 2.6rem)" className="mb-6" />
      <Skeleton width="80%" height="1rem" className="mb-2" />
      <Skeleton width="60%" height="1rem" className="mb-16" />

      {/* Lead card */}
      <Skeleton width="100%" height="280px" className="mb-16" />

      {/* Grouped sections */}
      {[0, 1].map((g) => (
        <div key={g} className="mb-16">
          <Skeleton width="160px" height="1.35rem" className="mb-6" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Skeleton height="200px" />
            <Skeleton height="200px" />
          </div>
        </div>
      ))}
    </div>
  );
}
