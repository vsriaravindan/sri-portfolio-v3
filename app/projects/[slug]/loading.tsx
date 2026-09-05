import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36" aria-busy="true">
      <Skeleton width="100px" height="0.72rem" className="mb-4" />
      <Skeleton width="60%" height="clamp(1.6rem, 3.4vw, 2.6rem)" className="mb-6" />
      <Skeleton width="90%" height="1rem" className="mb-2" />
      <Skeleton width="70%" height="1rem" className="mb-12" />
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="80px" />
        ))}
      </div>
    </div>
  );
}
