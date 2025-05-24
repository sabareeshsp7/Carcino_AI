import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />

        <div className="flex flex-wrap gap-3 my-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>

        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/6 flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </div>
                <div className="md:w-3/6 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="md:w-2/6 space-y-4">
                  <div className="text-right">
                    <Skeleton className="h-4 w-32 ml-auto" />
                    <Skeleton className="h-6 w-16 ml-auto mt-1" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
