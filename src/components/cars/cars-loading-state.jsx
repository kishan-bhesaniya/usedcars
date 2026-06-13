import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CarsLoadingState() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full max-w-2xl" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-[28px]" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
