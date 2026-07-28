export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
      <div className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />
    </div>
  )
}
