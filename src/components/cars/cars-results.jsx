import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";

export function CarsResults({ cars, onResetFilters }) {
  if (cars.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-border/70 bg-slate-50 p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">No cars found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try widening your budget or removing a few filters.
        </p>
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
    <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {cars.map((car, index) => (
        <CarCard key={car.id ?? car.name ?? index} car={car} index={index} />
      ))}
    </div>
  );
}
