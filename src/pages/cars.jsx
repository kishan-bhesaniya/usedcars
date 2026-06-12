import { useMemo, useState } from "react";
import carsData from "../../cars.json";
import { CarCard } from "@/components/car-card";
import { CarsFilterSidebar } from "@/components/cars-filter-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { usePageLoading } from "@/hooks/use-page-loading";
import {
  SORT_OPTIONS,
  buildInventoryMeta,
  createInitialFilters,
  filterAndSortCars,
  getActiveChips,
  toggleFilterValue,
} from "@/lib/car-filters";
import { CircleX, Filter, XIcon } from "lucide-react";

function CarsLoadingState() {
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
    </div>
  );
}

export default function CarsPage() {
  const cars = useMemo(
    () => (Array.isArray(carsData?.data) ? carsData.data : []),
    [],
  );
  const meta = useMemo(() => buildInventoryMeta(cars), [cars]);
  const [filters, setFilters] = useState(() => createInitialFilters(meta));
  const isLoading = usePageLoading();

  const filteredCars = useMemo(
    () => filterAndSortCars(cars, filters),
    [cars, filters],
  );
  const activeChips = useMemo(
    () => getActiveChips(filters, meta),
    [filters, meta],
  );

  const updateSort = (value) => {
    setFilters((current) => ({ ...current, sort: value }));
  };

  const updateRange = (field, minValue, maxValue) => {
    setFilters((current) => {
      if (field === "price") {
        const nextMin = Math.max(0, Math.min(minValue, meta.priceMax));
        const nextMax = Math.min(meta.priceMax, Math.max(maxValue, 0));

        return {
          ...current,
          minPrice: Math.min(nextMin, nextMax),
          maxPrice: Math.max(nextMin, nextMax),
        };
      }

      if (field === "year") {
        const nextMin = Math.max(
          meta.yearMin,
          Math.min(minValue, meta.yearMax),
        );
        const nextMax = Math.min(
          meta.yearMax,
          Math.max(maxValue, meta.yearMin),
        );

        return {
          ...current,
          minYear: Math.min(nextMin, nextMax),
          maxYear: Math.max(nextMin, nextMax),
        };
      }

      const nextMin = Math.max(0, Math.min(minValue, meta.kmsMax));
      const nextMax = Math.min(meta.kmsMax, Math.max(maxValue, 0));

      return {
        ...current,
        minKms: Math.min(nextMin, nextMax),
        maxKms: Math.max(nextMin, nextMax),
      };
    });
  };

  const toggleValue = (field, value) => {
    setFilters((current) => ({
      ...current,
      [field]: toggleFilterValue(current[field], value),
    }));
  };

  const resetFilters = () => {
    setFilters(createInitialFilters(meta));
  };

  if (isLoading) {
    return <CarsLoadingState />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(12,82,151,0.08),transparent_24%),linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        {/* side-bar for mobile */}
        <div className="flex justify-end lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
              >
                <Filter className="h-4 w-4" />
                Open filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-sm overflow-y-auto px-0"
              showCloseButton={false}
            >
              <SheetHeader className="relative">
                <SheetTitle>Filter cars</SheetTitle>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-4 right-4 bg-secondary"
                  >
                    <XIcon />
                    <span className="sr-only">Close filters</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <div className="px-6 pb-6">
                <CarsFilterSidebar
                  cars={cars}
                  meta={meta}
                  filters={filters}
                  onRangeChange={updateRange}
                  onToggle={toggleValue}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <CarsFilterSidebar
                cars={cars}
                meta={meta}
                filters={filters}
                onRangeChange={updateRange}
                onToggle={toggleValue}
              />
            </div>
          </aside>

          {/* sorting,filters and car cards. */}
          <section className="grid gap-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 text-sm font-medium text-primary/80">
                  {filteredCars.length} cars available
                </p>

                <label className="relative shrink-0">
                  <select
                    value={filters.sort}
                    onChange={(event) => updateSort(event.target.value)}
                    className="h-11 min-w-40 appearance-none rounded-xl border border-border bg-white px-4 text-sm text-slate-800 shadow-sm outline-none sm:min-w-52"
                  >
                    <option value="">Select filter</option>
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {activeChips.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeChips.map((chip) => (
                    <Badge
                      key={chip.key}
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {chip.label}
                    </Badge>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="[2px]"
                    className="rounded-full gap-1 px-2"
                    onClick={resetFilters}
                  >
                    <CircleX className="h-2 w-4" />
                    Clear all
                  </Button>
                </div>
              ) : null}

              {filteredCars.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-border/70 bg-slate-50 p-8 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    No cars found
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try widening your budget or removing a few filters.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 rounded-full"
                    onClick={resetFilters}
                  >
                    Reset filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCars.map((car, index) => (
                    <CarCard
                      key={car.id ?? car.name ?? index}
                      car={car}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
