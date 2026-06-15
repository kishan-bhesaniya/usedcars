import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";

export function CarDetailsSimilarCars({ cars, onViewAll }) {
  if (cars.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-medium uppercase tracking-[0.24em] text-slate-500">
            Similar cars
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onViewAll}
          className="rounded-full cursor-pointer"
        >
          View all cars
        </Button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
        {cars.map((car, index) => (
          <CarCard key={car.id ?? car.name ?? index} car={car} index={index} />
        ))}
      </div>
    </section>
  );
}
