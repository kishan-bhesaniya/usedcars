import { useEffect, useMemo, useState } from "react";
import carsData from "../../cars.json";
import { CarsLoadingState } from "@/components/cars/cars-loading-state";
import { CarsMobileFilters } from "@/components/cars/cars-mobile-filters";
import { CarsResults } from "@/components/cars/cars-results";
import { CarsToolbar } from "@/components/cars/cars-toolbar";
import { CarsFilterSidebar } from "@/components/cars-filter-sidebar";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { usePageLoading } from "@/hooks/use-page-loading";
import {
  buildInventoryMeta,
  createInitialFilters,
  filterAndSortCars,
  toggleFilterValue,
} from "@/lib/car-filters";

export default function CarsPage() {
  const INITIAL_CARS_COUNT = 6;
  const CARS_PER_LOAD = 3;

  const cars = useMemo(
    () => (Array.isArray(carsData?.data) ? carsData.data : []),
    [],
  );
  const meta = useMemo(() => buildInventoryMeta(cars), [cars]);
  const [filters, setFilters] = useState(() => createInitialFilters(meta));
  const isLoading = usePageLoading();
  const [visibleCarsCount, setVisibleCarsCount] = useState(INITIAL_CARS_COUNT);

  const filteredCars = useMemo(
    () => filterAndSortCars(cars, filters),
    [cars, filters],
  );
  const visibleCars = useMemo(
    () => filteredCars.slice(0, visibleCarsCount),
    [filteredCars, visibleCarsCount],
  );
  const hasMoreCars = visibleCarsCount < filteredCars.length;

  useEffect(() => {
    if (isLoading || !hasMoreCars) {
      return undefined;
    }

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 240;

      if (scrollPosition >= threshold) {
        setVisibleCarsCount((current) =>
          Math.min(current + CARS_PER_LOAD, filteredCars.length),
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const frameId = window.requestAnimationFrame(handleScroll);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredCars.length, hasMoreCars, isLoading]);

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
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 xl:px-10">
        <CarsMobileFilters
          cars={cars}
          meta={meta}
          filters={filters}
          onRangeChange={updateRange}
          onToggle={toggleValue}
        />

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
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
            <CarsToolbar
              filters={filters}
              filteredCarsCount={filteredCars.length}
              onResetFilters={resetFilters}
              onUpdateSort={updateSort}
            />
            <CarsResults
              cars={visibleCars}
              hasMoreCars={hasMoreCars}
              onResetFilters={resetFilters}
            />
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
