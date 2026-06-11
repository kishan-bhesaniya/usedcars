import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/cars";
import {
  buildFacetCounts,
  normalizeListValue,
  toTitleCase,
} from "@/lib/car-filters";

function FilterSection({ title, children, defaultOpen = true }) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-border/70 py-4 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-slate-900">
        <span>{title}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function FilterOption({ label, count, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-3 py-2 transition hover:bg-slate-50">
      <span className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border border-border/70 text-primary accent-(--color-primary)"
        />
        <span className="text-sm text-slate-700">{label}</span>
      </span>
      {typeof count === "number" ? (
        <span className="text-xs font-medium text-muted-foreground">
          {count}
        </span>
      ) : null}
    </label>
  );
}

function formatNumber(value) {
  return Number(value).toLocaleString("en-IN");
}

function RangeSlider({
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChange,
  formatValue = (value) => value,
}) {
  const safeMin = Math.min(valueMin, valueMax);
  const safeMax = Math.max(valueMin, valueMax);
  const range = Math.max(max - min, 1);
  const start = ((safeMin - min) / range) * 100;
  const end = ((safeMax - min) / range) * 100;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
        <span>{formatValue(safeMin)}</span>
        <span>{formatValue(safeMax)}</span>
      </div>

      <div className="relative h-7">
        <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
          style={{
            left: `${start}%`,
            width: `${Math.max(end - start, 0)}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMin}
          onChange={(event) => onChange([Number(event.target.value), safeMax])}
          className="pointer-events-none absolute inset-0 h-7 w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMax}
          onChange={(event) => onChange([safeMin, Number(event.target.value)])}
          className="pointer-events-none absolute inset-0 h-7 w-full appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}

export function CarsFilterSidebar({
  cars,
  meta,
  filters,
  onRangeChange,
  onToggle,
  onReset,
}) {
  const brandCounts = useMemo(
    () => buildFacetCounts(cars, meta.brands, (car) => [car.brand]),
    [cars, meta.brands],
  );
  const bodyCounts = useMemo(
    () =>
      buildFacetCounts(cars, meta.bodyTypes, (car) =>
        normalizeListValue(car.body_type),
      ),
    [cars, meta.bodyTypes],
  );
  const fuelCounts = useMemo(
    () =>
      buildFacetCounts(cars, meta.fuelTypes, (car) =>
        normalizeListValue(car.fuel_type),
      ),
    [cars, meta.fuelTypes],
  );
  const transmissionCounts = useMemo(
    () =>
      buildFacetCounts(cars, meta.transmissions, (car) =>
        normalizeListValue(car.transmission),
      ),
    [cars, meta.transmissions],
  );
  const ownerCounts = useMemo(
    () =>
      buildFacetCounts(cars, meta.ownerships, (car) =>
        normalizeListValue(car.ownership),
      ),
    [cars, meta.ownerships],
  );
  const statusCounts = useMemo(
    () =>
      buildFacetCounts(cars, meta.statuses, (car) => [
        car.status ??
          car.availability ??
          car.additional_badge ??
          "Unknown Status",
      ]),
    [cars, meta.statuses],
  );

  return (
    <div className="rounded-[28px] border border-border/70 bg-white px-4 shadow-sm">
      <FilterSection title="Model">
        <div className="grid gap-1">
          {meta.brands.map((brand) => (
            <FilterOption
              key={brand}
              label={brand}
              count={brandCounts[brand]}
              checked={filters.brands.includes(brand)}
              onChange={() => onToggle("brands", brand)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Budget">
        <RangeSlider
          min={meta.priceMin}
          max={meta.priceMax}
          step={10000}
          valueMin={filters.minPrice}
          valueMax={filters.maxPrice}
          onChange={([minValue, maxValue]) =>
            onRangeChange("price", minValue, maxValue)
          }
          formatValue={formatCurrency}
        />
      </FilterSection>

      <FilterSection title="Model year">
        <RangeSlider
          min={meta.yearMin}
          max={meta.yearMax}
          valueMin={filters.minYear}
          valueMax={filters.maxYear}
          onChange={([minValue, maxValue]) =>
            onRangeChange("year", minValue, maxValue)
          }
        />
      </FilterSection>

      <FilterSection title="Kms driven">
        <RangeSlider
          min={meta.kmsMin}
          max={meta.kmsMax}
          step={1000}
          valueMin={filters.minKms}
          valueMax={filters.maxKms}
          onChange={([minValue, maxValue]) =>
            onRangeChange("kms", minValue, maxValue)
          }
          formatValue={(value) => `${formatNumber(value)} km`}
        />
      </FilterSection>

      <FilterSection title="Fuel">
        <div className="grid gap-1">
          {meta.fuelTypes.map((value) => (
            <FilterOption
              key={value}
              label={toTitleCase(value)}
              count={fuelCounts[value]}
              checked={filters.fuelTypes.includes(value)}
              onChange={() => onToggle("fuelTypes", value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Body type">
        <div className="grid gap-1">
          {meta.bodyTypes.map((value) => (
            <FilterOption
              key={value}
              label={toTitleCase(value)}
              count={bodyCounts[value]}
              checked={filters.bodyTypes.includes(value)}
              onChange={() => onToggle("bodyTypes", value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Transmission">
        <div className="grid gap-1">
          {meta.transmissions.map((value) => (
            <FilterOption
              key={value}
              label={toTitleCase(value)}
              count={transmissionCounts[value]}
              checked={filters.transmissions.includes(value)}
              onChange={() => onToggle("transmissions", value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Owners">
        <div className="grid gap-1">
          {meta.ownerships.map((value) => (
            <FilterOption
              key={value}
              label={toTitleCase(value)}
              count={ownerCounts[value]}
              checked={filters.ownerships.includes(value)}
              onChange={() => onToggle("ownerships", value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Deals & badges" defaultOpen={false}>
        <div className="grid gap-1">
          {meta.statuses.map((value) => (
            <FilterOption
              key={value}
              label={value}
              count={statusCounts[value]}
              checked={filters.statuses.includes(value)}
              onChange={() => onToggle("statuses", value)}
            />
          ))}
        </div>
      </FilterSection>

      <Button
        type="button"
        variant="outline"
        className="my-4 h-11 rounded-2xl"
        onClick={onReset}
      >
        Reset all filters
      </Button>
    </div>
  );
}
