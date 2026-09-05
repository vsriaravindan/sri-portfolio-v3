import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-28 sm:px-10 sm:pt-36" aria-busy="true">
      <Skeleton width="80px" height="0.72rem" className="mb-4" />
      <Skeleton width="80%" height="clamp(2.25rem, 6vw, 4.5rem)" className="mb-3" />
      <Skeleton width="50%" height="0.85rem" className="mb-8" />
      <div className="mb-12 flex gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} width="80px" height="1.5rem" rounded />
        ))}
      </div>
      {/* Article body */}
      <div className="space-y-3">
        <Skeleton width="100%" height="1.2rem" />
        <Skeleton width="95%" height="1.2rem" />
        <Skeleton width="98%" height="1.2rem" />
        <Skeleton width="40%" height="1.2rem" />
        <div className="my-6" />
        <Skeleton width="100%" height="1.2rem" />
        <Skeleton width="90%" height="1.2rem" />
        <Skeleton width="60%" height="1.2rem" />
      </div>
    </div>
  );
}
