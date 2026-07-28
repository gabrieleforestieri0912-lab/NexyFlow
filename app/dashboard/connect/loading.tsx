export default function ConnectLoading() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-xl" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
