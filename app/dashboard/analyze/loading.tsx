export default function AnalyzeLoading() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-xl" />
      <div className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
        <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
      </div>
    </div>
  )
}
