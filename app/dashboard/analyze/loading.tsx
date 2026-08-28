import { Skeleton, SkeletonCard } from '@/components/Skeleton'

export default function AnalyzeLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}