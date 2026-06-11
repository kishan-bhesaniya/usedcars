import { useMemo, useState } from "react";
import carsData from "../../cars.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { usePageLoading } from "@/hooks/use-page-loading";
import {
  formatCurrency,
  formatList,
  getCarCategory,
  getCarImage,
  getCarName,
  getCarStatus,
} from "@/lib/cars";
import {
  ChevronDown,
  CircleX,
  Filter,
  Fuel,
  Gauge,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "best-match", label: "Best match" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "year-newest", label: "Newest registration" },
  { value: "kms-low-high", label: "Kms: Low to High" },
];

const YEAR_BUCKETS = [
  { value: "2022-2023", label: "2022 and newer", test: (year) => year >= 2022 },
  { value: "2020-2021", label: "2020 to 2021", test: (year) => year >= 2020 && year <= 2021 },
  { value: "2018-2019", label: "2018 to 2019", test: (year) => year >= 2018 && year <= 2019 },
  { value: "2017-older", label: "2017 and older", test: (year) => year <= 2017 },
];

const KMS_BUCKETS = [
  { value: "0-20000", label: "Under 20,000 km", test: (kms) => kms <= 20000 },
  { value: "20001-40000", label: "20,001 to 40,000 km", test: (kms) => kms > 20000 && kms <= 40000 },
  { value: "40001-60000", label: "40,001 to 60,000 km", test: (kms) => kms > 40000 && kms <= 60000 },
  { value: "60001+", label: "Above 60,000 km", test: (kms) => kms > 60000 },
];

function openCarDetails(carId) {
  if (!carId) {
    return;
  }

  window.history.pushState({}, "", `/car-details/${carId}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function normalizeListValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
  }

  if (value === null || value === undefined || value === "") {
    return [];
  }

  return [String(value).trim().toLowerCase()];
}

function buildInventoryMeta(cars) {
  const prices = cars.map((car) => car.price).filter((value) => typeof value === "number");
  const years = cars
    .map((car) => car.registration_year)
    .filter((value) => typeof value === "number");
  const kms = cars.map((car) => car.km_driven).filter((value) => typeof value === "number");

  return {
    brands: [...new Set(cars.map((car) => car.brand).filter(Boolean))].sort(),
    bodyTypes: [
      ...new Set(cars.flatMap((car) => normalizeListValue(car.body_type))),
    ].sort(),
    fuelTypes: [
      ...new Set(cars.flatMap((car) => normalizeListValue(car.fuel_type))),
    ].sort(),
    transmissions: [
      ...new Set(cars.flatMap((car) => normalizeListValue(car.transmission))),
    ].sort(),
    ownerships: [
      ...new Set(cars.flatMap((car) => normalizeListValue(car.ownership))),
    ].sort(),
    statuses: [...new Set(cars.map((car) => getCarStatus(car)).filter(Boolean))].sort(),
    priceMin: prices.length > 0 ? Math.min(...prices) : 0,
    priceMax: prices.length > 0 ? Math.max(...prices) : 0,
    yearMin: years.length > 0 ? Math.min(...years) : 0,
    yearMax: years.length > 0 ? Math.max(...years) : 0,
    kmsMin: kms.length > 0 ? Math.min(...kms) : 0,
    kmsMax: kms.length > 0 ? Math.max(...kms) : 0,
  };
}

function createInitialFilters(meta) {
  return {
    search: "",
    sort: "best-match",
    minPrice: meta.priceMin,
    maxPrice: meta.priceMax,
    brands: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissions: [],
    ownerships: [],
    statuses: [],
    years: [],
    kms: [],
  };
}

function formatCompactPrice(value) {
  if (typeof value !== "number") {
    return "N/A";
  }

  if (value >= 100000) {
    return `Rs ${Number(
      (value / 100000).toFixed(value >= 1000000 ? 1 : 2),
    ).toLocaleString("en-IN")}L`;
  }

  return `Rs ${value.toLocaleString("en-IN")}`;
}

function toTitleCase(value) {
  return String(value)
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

function getActiveChips(filters, meta) {
  const chips = [];

  if (filters.search.trim()) {
    chips.push({ key: "search", label: `Search: ${filters.search.trim()}` });
  }

  if (filters.minPrice !== meta.priceMin || filters.maxPrice !== meta.priceMax) {
    chips.push({
      key: "price",
      label: `${formatCompactPrice(filters.minPrice)} - ${formatCompactPrice(filters.maxPrice)}`,
    });
  }

  for (const value of filters.brands) {
    chips.push({ key: `brand-${value}`, label: value });
  }

  for (const value of filters.bodyTypes) {
    chips.push({ key: `body-${value}`, label: toTitleCase(value) });
  }

  for (const value of filters.fuelTypes) {
    chips.push({ key: `fuel-${value}`, label: toTitleCase(value) });
  }

  for (const value of filters.transmissions) {
    chips.push({ key: `trans-${value}`, label: toTitleCase(value) });
  }

  for (const value of filters.ownerships) {
    chips.push({ key: `owner-${value}`, label: toTitleCase(value) });
  }

  for (const value of filters.statuses) {
    chips.push({ key: `status-${value}`, label: value });
  }

  for (const value of filters.years) {
    const match = YEAR_BUCKETS.find((item) => item.value === value);
    if (match) {
      chips.push({ key: `year-${value}`, label: match.label });
    }
  }

  for (const value of filters.kms) {
    const match = KMS_BUCKETS.find((item) => item.value === value);
    if (match) {
      chips.push({ key: `kms-${value}`, label: match.label });
    }
  }

  return chips;
}

function toggleFilterValue(currentValues, value) {
  return currentValues.includes(value)
    ? currentValues.filter((item) => item !== value)
    : [...currentValues, value];
}

function FilterSection({ title, children, defaultOpen = true }) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-3xl border border-border/70 bg-white/88 p-4 shadow-sm"
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
          className="h-4 w-4 rounded border-border text-primary accent-[var(--color-primary)]"
        />
        <span className="text-sm text-slate-700">{label}</span>
      </span>
      {typeof count === "number" ? (
        <span className="text-xs font-medium text-muted-foreground">{count}</span>
      ) : null}
    </label>
  );
}

function FilterSidebar({
  cars,
  meta,
  filters,
  onSearchChange,
  onPriceChange,
  onToggle,
  onReset,
}) {
  const brandCounts = useMemo(() => {
    return Object.fromEntries(
      meta.brands.map((brand) => [
        brand,
        cars.filter((car) => car.brand === brand).length,
      ]),
    );
  }, [cars, meta.brands]);

  const bodyCounts = useMemo(() => {
    return Object.fromEntries(
      meta.bodyTypes.map((value) => [
        value,
        cars.filter((car) => normalizeListValue(car.body_type).includes(value)).length,
      ]),
    );
  }, [cars, meta.bodyTypes]);

  const fuelCounts = useMemo(() => {
    return Object.fromEntries(
      meta.fuelTypes.map((value) => [
        value,
        cars.filter((car) => normalizeListValue(car.fuel_type).includes(value)).length,
      ]),
    );
  }, [cars, meta.fuelTypes]);

  const transmissionCounts = useMemo(() => {
    return Object.fromEntries(
      meta.transmissions.map((value) => [
        value,
        cars.filter((car) => normalizeListValue(car.transmission).includes(value)).length,
      ]),
    );
  }, [cars, meta.transmissions]);

  const ownerCounts = useMemo(() => {
    return Object.fromEntries(
      meta.ownerships.map((value) => [
        value,
        cars.filter((car) => normalizeListValue(car.ownership).includes(value)).length,
      ]),
    );
  }, [cars, meta.ownerships]);

  const statusCounts = useMemo(() => {
    return Object.fromEntries(
      meta.statuses.map((value) => [
        value,
        cars.filter((car) => getCarStatus(car) === value).length,
      ]),
    );
  }, [cars, meta.statuses]);

  return (
    <div className="grid gap-4">
      <FilterSection title="Make & model">
        <div className="grid gap-3">
          <Input
            type="search"
            value={filters.search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search brand, model or variant"
            className="h-11 rounded-2xl bg-white"
          />
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
        </div>
      </FilterSection>

      <FilterSection title="Budget">
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min={meta.priceMin}
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(event) => onPriceChange("minPrice", Number(event.target.value))}
              className="h-11 rounded-2xl bg-white"
            />
            <Input
              type="number"
              min={filters.minPrice}
              max={meta.priceMax}
              value={filters.maxPrice}
              onChange={(event) => onPriceChange("maxPrice", Number(event.target.value))}
              className="h-11 rounded-2xl bg-white"
            />
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
            {formatCurrency(filters.minPrice)} to {formatCurrency(filters.maxPrice)}
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Model year">
        <div className="grid gap-1">
          {YEAR_BUCKETS.map((bucket) => (
            <FilterOption
              key={bucket.value}
              label={bucket.label}
              checked={filters.years.includes(bucket.value)}
              onChange={() => onToggle("years", bucket.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Kms driven">
        <div className="grid gap-1">
          {KMS_BUCKETS.map((bucket) => (
            <FilterOption
              key={bucket.value}
              label={bucket.label}
              checked={filters.kms.includes(bucket.value)}
              onChange={() => onToggle("kms", bucket.value)}
            />
          ))}
        </div>
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
        className="h-11 rounded-2xl"
        onClick={onReset}
      >
        Reset all filters
      </Button>
    </div>
  );
}

function CarCard({ car, index }) {
  const imageUrl = getCarImage(car);
  const status = getCarStatus(car);

  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-border/70 pt-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
              className="h-56 w-full object-cover"
            />
          ) : (
            <div className="bg-muted text-muted-foreground flex h-56 w-full items-center justify-center text-sm">
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
      <CardContent className="grid gap-4 p-5">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {getCarName(car, index)}
              </p>
              <p className="text-sm text-muted-foreground">
                {car.registration_year} | {getCarCategory(car)}
              </p>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {formatCurrency(car.price)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] bg-slate-50 p-3 text-sm">
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

function CarsLoadingState() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
      <SiteHeader title="Browse inventory" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full max-w-2xl" />
        </div>
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-[1.75rem]" />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden pt-0">
                <Skeleton className="h-56 w-full rounded-none" />
                <CardContent className="grid gap-3 p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full rounded-3xl" />
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

  const filteredCars = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const matches = cars.filter((car) => {
      const searchValue = [
        car.brand,
        car.model,
        car.variant,
        getCarName(car),
        getCarCategory(car),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (normalizedSearch && !searchValue.includes(normalizedSearch)) {
        return false;
      }

      if (typeof car.price === "number") {
        if (car.price < filters.minPrice || car.price > filters.maxPrice) {
          return false;
        }
      }

      if (filters.brands.length > 0 && !filters.brands.includes(car.brand)) {
        return false;
      }

      if (
        filters.bodyTypes.length > 0 &&
        !filters.bodyTypes.some((value) =>
          normalizeListValue(car.body_type).includes(value),
        )
      ) {
        return false;
      }

      if (
        filters.fuelTypes.length > 0 &&
        !filters.fuelTypes.some((value) =>
          normalizeListValue(car.fuel_type).includes(value),
        )
      ) {
        return false;
      }

      if (
        filters.transmissions.length > 0 &&
        !filters.transmissions.some((value) =>
          normalizeListValue(car.transmission).includes(value),
        )
      ) {
        return false;
      }

      if (
        filters.ownerships.length > 0 &&
        !filters.ownerships.some((value) =>
          normalizeListValue(car.ownership).includes(value),
        )
      ) {
        return false;
      }

      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(getCarStatus(car))
      ) {
        return false;
      }

      if (
        filters.years.length > 0 &&
        !YEAR_BUCKETS.some(
          (bucket) =>
            filters.years.includes(bucket.value) &&
            bucket.test(Number(car.registration_year)),
        )
      ) {
        return false;
      }

      if (
        filters.kms.length > 0 &&
        !KMS_BUCKETS.some(
          (bucket) =>
            filters.kms.includes(bucket.value) &&
            bucket.test(Number(car.km_driven)),
        )
      ) {
        return false;
      }

      return true;
    });

    const sorted = [...matches];

    switch (filters.sort) {
      case "price-low-high":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "price-high-low":
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "year-newest":
        sorted.sort((a, b) => (b.registration_year ?? 0) - (a.registration_year ?? 0));
        break;
      case "kms-low-high":
        sorted.sort((a, b) => (a.km_driven ?? 0) - (b.km_driven ?? 0));
        break;
      default:
        sorted.sort((a, b) => {
          const statusScore = String(getCarStatus(b)).localeCompare(
            String(getCarStatus(a)),
          );

          if (statusScore !== 0) {
            return statusScore;
          }

          return (b.registration_year ?? 0) - (a.registration_year ?? 0);
        });
    }

    return sorted;
  }, [cars, filters]);

  const activeChips = useMemo(() => getActiveChips(filters, meta), [filters, meta]);

  const updatePrice = (field, value) => {
    const safeValue = Number.isFinite(value) ? value : 0;

    setFilters((current) => {
      if (field === "minPrice") {
        const nextMin = Math.max(
          meta.priceMin,
          Math.min(safeValue, current.maxPrice),
        );
        return { ...current, minPrice: nextMin };
      }

      const nextMax = Math.min(
        meta.priceMax,
        Math.max(safeValue, current.minPrice),
      );
      return { ...current, maxPrice: nextMax };
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
      <SiteHeader title="Browse inventory" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-[#0d2742] px-5 py-6 text-white shadow-xl shadow-slate-900/10 sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200/90">
                Inventory
              </p>
              <h2 className="max-w-3xl text-3xl font-semibold">
                Explore used cars with a Cars24-inspired filter sidebar
              </h2>
              <p className="max-w-2xl text-sm text-white/72">
                Filter by budget, make, year, kilometers, fuel, body type,
                transmission, owners, and deal badges right on the `/car` page.
              </p>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Open filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter cars</SheetTitle>
                  <SheetDescription>
                    Narrow down inventory like the Cars24 browse page.
                  </SheetDescription>
                </SheetHeader>
                <div className="px-6 pb-6">
                  <FilterSidebar
                    cars={cars}
                    meta={meta}
                    filters={filters}
                    onSearchChange={(value) =>
                      setFilters((current) => ({ ...current, search: value }))
                    }
                    onPriceChange={updatePrice}
                    onToggle={toggleValue}
                    onReset={resetFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-white/8 px-4 py-3">
              <p className="text-2xl font-semibold">{filteredCars.length}</p>
              <p className="text-sm text-white/70">Cars matching filters</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/8 px-4 py-3">
              <p className="text-2xl font-semibold">{meta.brands.length}</p>
              <p className="text-sm text-white/70">Brands available</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/8 px-4 py-3">
              <p className="text-2xl font-semibold">
                {formatCompactPrice(meta.priceMin)} - {formatCompactPrice(meta.priceMax)}
              </p>
              <p className="text-sm text-white/70">Budget window</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <FilterSidebar
                cars={cars}
                meta={meta}
                filters={filters}
                onSearchChange={(value) =>
                  setFilters((current) => ({ ...current, search: value }))
                }
                onPriceChange={updatePrice}
                onToggle={toggleValue}
                onReset={resetFilters}
              />
            </div>
          </aside>

          <section className="grid gap-4">
            <Card className="rounded-[2rem] border-border/70 pt-0 shadow-sm">
              <CardContent className="grid gap-4 p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary/80">
                      {filteredCars.length} cars available
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900">
                      Used cars on `/car`
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-full border border-border bg-white px-4 py-2 text-sm text-slate-700">
                      Sort by
                    </div>
                    <label className="relative">
                      <select
                        value={filters.sort}
                        onChange={(event) =>
                          setFilters((current) => ({
                            ...current,
                            sort: event.target.value,
                          }))
                        }
                        className="h-11 min-w-52 appearance-none rounded-full border border-border bg-white px-4 pr-10 text-sm text-slate-800 shadow-sm outline-none"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </label>
                  </div>
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
                      size="sm"
                      className="rounded-full"
                      onClick={resetFilters}
                    >
                      <CircleX className="h-4 w-4" />
                      Clear all
                    </Button>
                  </div>
                ) : null}

                {filteredCars.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-border bg-slate-50 p-8 text-center">
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
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredCars.map((car, index) => (
                      <CarCard
                        key={car.id ?? car.name ?? index}
                        car={car}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
