import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CarDetailsSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
      <div className="mb-2">
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden rounded-[32px] pt-0">
          <div className="space-y-4 p-4">
            <Skeleton className="aspect-16/10 w-full rounded-3xl" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-4/3 w-full rounded-2xl"
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px]">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-32" />
          </CardHeader>
          <CardContent className="grid gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="border-border border-b py-4 last:border-b-0"
              >
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[32px]">
        <CardHeader>
          <Skeleton className="h-8 w-40" />
        </CardHeader>
        <CardContent className="grid gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border-border border-b py-4 last:border-b-0"
            >
              <Skeleton className="mb-2 h-4 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
