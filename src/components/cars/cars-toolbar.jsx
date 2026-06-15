import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SORT_OPTIONS } from "@/lib/car-filters";
import { CircleX } from "lucide-react";

export function CarsToolbar({
  activeChips,
  filters,
  filteredCarsCount,
  onResetFilters,
  onUpdateSort,
}) {
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
            onClick={onResetFilters}
          >
            <CircleX className="h-2 w-4" />
            Clear all
          </Button>
        </div>
      ) : null}
    </div>
  );
}
