import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatCurrency,
  formatList,
  getCarCategory,
  getCarImage,
  getCarName,
  getCarStatus,
} from "@/lib/cars";
import { toTitleCase } from "@/lib/car-filters";
import { Fuel, Gauge, Settings2, SlidersHorizontal } from "lucide-react";

function openCarDetails(carId) {
  if (!carId) {
    return;
  }

  window.history.pushState({}, "", `/car-details/${carId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function CarCard({ car, index }) {
  const imageUrl = getCarImage(car);
  const status = getCarStatus(car);

  return (
    <Card className="h-full overflow-hidden rounded-[28px] border border-border/70 pt-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => openCarDetails(car.id)}
        className="block w-full cursor-pointer text-left"
      >
        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={getCarName(car, index)}
              className="h-52 w-full object-cover"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-52 w-full items-center justify-center text-sm">
              No image available
            </div>
          )}
          {status ? (
            <Badge className="absolute top-4 left-4 rounded-full bg-white/92 px-3 text-slate-800 shadow-sm">
              {status}
            </Badge>
          ) : null}
        </div>
      </button>
      <CardContent className="grid gap-3 p-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold leading-snug text-slate-900">
                {getCarName(car, index)}
              </p>
              <p className="text-sm text-muted-foreground">
                {car.registration_year} | {getCarCategory(car)}
              </p>
            </div>
            <p className="shrink-0 text-base font-bold text-slate-900">
              {formatCurrency(car.price)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 rounded-[24px] bg-slate-50 p-3 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Gauge className="h-4 w-4 text-primary" />
            <span>{car.km_driven?.toLocaleString("en-IN")} km</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Fuel className="h-4 w-4 text-primary" />
            <span>{toTitleCase(formatList(car.fuel_type))}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Settings2 className="h-4 w-4 text-primary" />
            <span>{toTitleCase(formatList(car.transmission))}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>{formatList(car.ownership)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
