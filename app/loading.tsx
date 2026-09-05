import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36" aria-busy="true">
      {/* Hero skeleton */}
      <Skeleton width="180px" height="0.72rem" className="mb-6" />
      <Skeleton width="90%" height="clamp(2.85rem, 10.5vw, 9.5rem)" className="mb-2" />
      <Skeleton width="70%" height="clamp(2.85rem, 10.5vw, 9.5rem)" className="mb-8" />
      <Skeleton width="60%" height="1.25rem" className="mb-2" />
      <Skeleton width="40%" height="1.25rem" className="mb-10" />
      <div className="flex gap-4">
        <Skeleton width="140px" height="2.5rem" />
        <Skeleton width="140px" height="2.5rem" />
      </div>

      {/* Featured Work */}
      <div className="mt-24">
        <Skeleton width="160px" height="0.72rem" className="mb-8" />
        <Skeleton width="100%" height="280px" className="mb-5" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height="200px" />
          ))}
        </div>
      </div>

      {/* Blog strip */}
      <div className="mt-24">
        <Skeleton width="180px" height="0.72rem" className="mb-6" />
        <div className="space-y-1">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height="64px" />
          ))}
        </div>
      </div>
    </div>
  );
}
