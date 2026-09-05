import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-12 sm:px-10" aria-busy="true">
      <Skeleton width="60%" height="clamp(1.6rem, 3.4vw, 2.6rem)" className="mb-3" />
      <Skeleton width="40%" height="0.85rem" className="mb-10" />
      <div className="space-y-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="64px" />
        ))}
      </div>
    </div>
  );
}
