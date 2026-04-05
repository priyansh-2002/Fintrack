import { Skeleton } from '@mui/material';

export const PageSkeleton = ({ showTable = false }: { showTable?: boolean }) => (
  <div className="space-y-6">
    <Skeleton variant="rounded" height={168} className="rounded-4xl" />
    <div className="grid gap-5 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          height={146}
          className="rounded-[28px]"
        />
      ))}
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <Skeleton variant="rounded" height={320} className="rounded-[28px]" />
      <Skeleton variant="rounded" height={320} className="rounded-[28px]" />
    </div>
    <Skeleton variant="rounded" height={showTable ? 420 : 260} className="rounded-[28px]" />
  </div>
);
