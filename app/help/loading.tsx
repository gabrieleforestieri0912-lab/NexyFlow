export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-xl mx-auto mb-4" />
          <div className="h-12 w-full max-w-md bg-gray-100 animate-pulse rounded-xl mx-auto" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-8">
            <div className="h-6 w-32 bg-gray-100 animate-pulse rounded-lg mb-4" />
            {[1, 2].map((j) => (
              <div key={j} className="h-16 bg-gray-100 animate-pulse rounded-xl mb-2" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
