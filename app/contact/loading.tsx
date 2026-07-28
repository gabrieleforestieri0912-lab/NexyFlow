export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-10 w-48 bg-gray-100 animate-pulse rounded-xl mx-auto mb-4" />
          <div className="h-6 w-64 bg-gray-100 animate-pulse rounded-xl mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-xl" />
            ))}
            <div className="h-12 w-40 bg-gray-100 animate-pulse rounded-xl" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
