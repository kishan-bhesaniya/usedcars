import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CarsLoadingState() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full max-w-2xl" />
        </div>
        <div className="grid gap-6 lg:gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="border-r-0 bg-transparent px-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="border-b border-slate-200 py-4 last:border-b-0"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="mt-4 space-y-3">
                  {index === 1 || index === 2 ? (
                    <>
                      <Skeleton className="h-12 w-full rounded-xl" />
                      <div className="relative h-7">
                        <Skeleton className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full" />
                        <Skeleton className="absolute top-1/2 left-[18%] h-2 w-[52%] -translate-y-1/2 rounded-full" />
                        <Skeleton className="absolute top-1/2 left-[18%] h-5 w-5 -translate-y-1/2 rounded-full" />
                        <Skeleton className="absolute top-1/2 left-[70%] h-5 w-5 -translate-y-1/2 rounded-full" />
                      </div>
                    </>
                  ) : (
                    Array.from({ length: 4 }).map((__, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-4 w-4 rounded-sm" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-3 w-6" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden pt-0">
                <Skeleton className="h-52 w-full rounded-none" />
                <CardContent className="grid gap-3 p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-22 w-full rounded-3xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
