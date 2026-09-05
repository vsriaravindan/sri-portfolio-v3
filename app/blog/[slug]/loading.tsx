import Skeleton from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-12 sm:px-10 sm:pt-16" aria-busy="true">
      <Skeleton width="120px" height="0.72rem" className="mb-3" />
      <Skeleton width="80%" height="clamp(2.25rem, 6vw, 4.5rem)" className="mb-6" />
      <div className="space-y-3">
        <Skeleton width="100%" height="1.2rem" />
        <Skeleton width="95%" height="1.2rem" />
        <Skeleton width="60%" height="1.2rem" />
      </div>
    </div>
  );
}
