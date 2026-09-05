import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-12 sm:px-10" aria-busy="true">
      <Skeleton width="140px" height="0.72rem" className="mb-3" />
      <Skeleton width="40%" height="clamp(1.6rem, 3.4vw, 2.6rem)" className="mb-10" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} height="100px" />
        ))}
      </div>
      <Skeleton width="100%" height="1px" className="my-10" />
      <Skeleton width="80px" height="0.72rem" className="mb-4" />
      <div className="space-y-2">
        <Skeleton height="48px" />
        <Skeleton height="200px" />
        <Skeleton height="48px" />
      </div>
    </div>
  );
}
