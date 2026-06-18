import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";

export function CarsResults({
  cars,
  hasMoreCars,
  loadMoreRef,
  onResetFilters,
}) {
  if (cars.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-border/70 bg-slate-50 p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">No cars found</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-full"
          onClick={onResetFilters}
        >
          Reset filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {cars.map((car, index) => (
          <CarCard key={car.id ?? car.name ?? index} car={car} index={index} />
        ))}
      </div>

      {hasMoreCars ? (
        <div
          ref={loadMoreRef}
          className="flex min-h-16 items-center justify-center rounded-[20px] border border-dashed border-border/70 bg-white/70 px-4 py-5 text-sm font-medium text-slate-600"
        >
          Loading more cars...
        </div>
      ) : null}
    </div>
  );
}
