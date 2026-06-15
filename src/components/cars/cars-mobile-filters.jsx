import { CarsFilterSidebar } from "@/components/cars-filter-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, XIcon } from "lucide-react";

export function CarsMobileFilters({
  cars,
  meta,
  filters,
  onRangeChange,
  onToggle,
}) {
  return (
    <div className="flex justify-end lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button type="button" variant="secondary" className="rounded-full">
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
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
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
              onRangeChange={onRangeChange}
              onToggle={onToggle}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
