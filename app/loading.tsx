export default function RootLoading() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero skeleton */}
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        <div className="space-y-6 text-center">
          <div className="h-4 bg-gray-100 rounded-full w-48 mx-auto animate-pulse" />
          <div className="h-16 bg-gray-100 rounded-2xl w-3/4 mx-auto animate-pulse" />
          <div className="h-5 bg-gray-100 rounded-xl w-1/2 mx-auto animate-pulse" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="h-14 bg-gray-100 rounded-2xl w-40 animate-pulse" />
            <div className="h-14 bg-gray-100 rounded-2xl w-40 animate-pulse" />
          </div>
        </div>
      </div>
      {/* Features skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-24">
        <div className="text-center space-y-4 mb-16">
          <div className="h-4 bg-gray-100 rounded-full w-32 mx-auto animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-2xl w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
