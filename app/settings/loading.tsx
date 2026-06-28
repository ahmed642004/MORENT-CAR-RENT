export default function SettingsLoading() {
  return (
    <div className="container px-6 lg:px-16 py-8 animate-pulse">
      {/* Title Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-secondary-200/50 rounded-lg mb-2"></div>
        <div className="h-4 w-96 bg-secondary-200/50 rounded-lg"></div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column Skeletons */}
        <div className="flex flex-col gap-8">
          {/* Section 1: Profile Information Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100/50">
            <div className="h-6 w-40 bg-secondary-200/50 rounded-lg mb-6"></div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-secondary-200/50"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-32 bg-secondary-200/50 rounded-lg"></div>
                <div className="h-3 w-48 bg-secondary-200/50 rounded-lg"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="h-4 w-24 bg-secondary-200/50 rounded-lg mb-2"></div>
                <div className="h-11 w-full bg-secondary-100/80 rounded-xl"></div>
              </div>
              <div>
                <div className="h-4 w-24 bg-secondary-200/50 rounded-lg mb-2"></div>
                <div className="h-11 w-full bg-secondary-100/80 rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Section 2: Security Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100/50">
            <div className="h-6 w-28 bg-secondary-200/50 rounded-lg mb-6"></div>
            
            <div className="space-y-4">
              <div>
                <div className="h-4 w-28 bg-secondary-200/50 rounded-lg mb-2"></div>
                <div className="h-11 w-full bg-secondary-100/80 rounded-xl"></div>
              </div>
              <div>
                <div className="h-4 w-36 bg-secondary-200/50 rounded-lg mb-2"></div>
                <div className="h-11 w-full bg-secondary-100/80 rounded-xl"></div>
              </div>
              <div className="h-11 w-32 bg-secondary-200/50 rounded-xl pt-4"></div>
            </div>
          </div>
        </div>

        {/* Right Column Skeletons */}
        <div className="flex flex-col gap-8">
          {/* Section 3: Account Details Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100/50">
            <div className="h-6 w-36 bg-secondary-200/50 rounded-lg mb-6"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-secondary-100/50">
                <div className="h-4 w-24 bg-secondary-200/50 rounded-lg"></div>
                <div className="h-4 w-40 bg-secondary-200/50 rounded-lg"></div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-secondary-100/50">
                <div className="h-4 w-24 bg-secondary-200/50 rounded-lg"></div>
                <div className="h-4 w-32 bg-secondary-200/50 rounded-lg"></div>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="h-4 w-20 bg-secondary-200/50 rounded-lg"></div>
                <div className="h-8 w-48 bg-secondary-100/80 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Section 4: Preferences Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-100/50">
            <div className="h-6 w-32 bg-secondary-200/50 rounded-lg mb-6"></div>
            
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-36 bg-secondary-200/50 rounded-lg"></div>
                    <div className="h-3 w-56 bg-secondary-200/50 rounded-lg"></div>
                  </div>
                  <div className="w-11 h-6 bg-secondary-200/50 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Danger Zone Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
            <div className="h-6 w-32 text-red-500 bg-red-100/50 rounded-lg mb-4"></div>
            <div className="h-3 w-72 bg-secondary-200/50 rounded-lg mb-6"></div>
            <div className="h-11 w-full bg-red-100/80 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
