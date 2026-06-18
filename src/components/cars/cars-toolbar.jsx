import { SORT_OPTIONS } from "@/lib/car-filters";

export function CarsToolbar({ filters, filteredCarsCount, onUpdateSort }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-sm font-medium text-primary/80">
          {filteredCarsCount} cars available
        </p>

        <label className="relative shrink-0">
          <select
            value={filters.sort}
            onChange={(event) => onUpdateSort(event.target.value)}
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
    </div>
  );
}
