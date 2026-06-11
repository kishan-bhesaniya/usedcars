import carsData from "../../cars.json";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageLoading } from "@/hooks/use-page-loading";
import {
  getCarCategory,
  getCarImage,
  getCarName,
  getCarStatus,
} from "@/lib/cars";

function openCarDetails(carId) {
  if (!carId) {
    return;
  }

  window.history.pushState({}, "", `/car-details/${carId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function CarCard({ car, index }) {
  const imageUrl = getCarImage(car);
  const status = getCarStatus(car);

  return (
    <Card className="overflow-hidden pt-0">
      <button
        type="button"
        onClick={() => openCarDetails(car.id)}
        className="block w-full cursor-pointer text-left"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={getCarName(car, index)}
            className="h-56 w-full object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-56 w-full items-center justify-center text-sm">
            No image available
          </div>
        )}
      </button>
      <CardContent className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">{getCarName(car, index)}</p>
            <p className="text-muted-foreground text-sm">
              {getCarCategory(car)}
            </p>
          </div>
          {status ? <Badge variant="secondary">{status}</Badge> : ""}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CarsPage() {
  const cars = Array.isArray(carsData?.data) ? carsData.data : [];
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
        <SiteHeader title="Browse inventory" />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full max-w-2xl" />
          </div>
          <Card className="rounded-[2rem] border-border/70 pt-0 shadow-sm">
            <CardContent className="grid gap-4 p-4 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden pt-0">
                    <Skeleton className="h-56 w-full rounded-none" />
                    <CardContent className="grid gap-3 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="w-full space-y-2">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
      <SiteHeader title="Browse inventory" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary/75">
            Inventory
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Find a pre-owned car that fits your next move
          </h2>
        </div>
        <Card className="rounded-[2rem] border-border/70 pt-0 shadow-sm">
          <CardContent className="grid gap-4 p-4 sm:p-6">
            {cars.length === 0 ? (
              <p className="text-muted-foreground text-sm">No cars found.</p>
            ) : null}

            {cars.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cars.map((car, index) => (
                  <CarCard
                    key={car.id ?? car.name ?? index}
                    car={car}
                    index={index}
                  />
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
