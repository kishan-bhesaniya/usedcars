import { useMemo, useState } from "react";
import carsData from "../../cars.json";
import { getCarCategory, getCarName } from "@/lib/cars";
import { siteNavigation } from "@/lib/site";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { SearchIcon, XIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function createSearchItems() {
  const cars = Array.isArray(carsData?.data) ? carsData.data : [];
  const carItems = cars.map((car, index) => ({
    id: `car-${car.id ?? index}`,
    title: getCarName(car, index),
    subtitle: getCarCategory(car),
    url: car.id ? `/car-details/${car.id}` : "/car",
    type: "Car",
  }));

  return carItems;
}

const searchItems = createSearchItems();

function SearchResults({ items, onSelect, onClear }) {
  if (items.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 z-30 mt-2 rounded-3xl border bg-background p-4 shadow-xl">
        <p className="text-sm text-muted-foreground">No matches found.</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 z-30 mt-2 overflow-hidden rounded-3xl border bg-background shadow-xl">
      <div className="max-h-96 overflow-y-auto p-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onSelect(item.url);
              onClear();
            }}
            className="hover:bg-muted/80 flex w-full items-start justify-between gap-3 rounded-2xl px-3 py-3 text-left transition"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            </div>
            <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
              {item.type}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HeaderSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const normalizedQuery = query.trim();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return searchItems
      .filter((item) =>
        `${item.title} ${item.subtitle} ${item.type}`
          .toLowerCase()
          .includes(normalizedQuery.toLowerCase()),
      )
      .slice(0, 8);
  }, [normalizedQuery]);

  const submitSearch = () => {
    const firstMatch = results[0];

    if (!firstMatch) {
      return;
    }

    navigate(firstMatch.url);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-xl">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={query}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            submitSearch();
          }

          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
        placeholder="Search models,brands or variants"
        className="h-12 rounded-full border border-border/70 bg-background/90 pr-12 pl-11 shadow-sm backdrop-blur"
        aria-label="Global search"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setIsOpen(false);
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
          aria-label="Clear search"
        >
          <XIcon className="h-4 w-4" />
        </button>
      ) : null}
      {isOpen && normalizedQuery ? (
        <SearchResults
          items={results}
          onSelect={navigate}
          onClear={() => {
            setIsOpen(false);
            setQuery("");
          }}
        />
      ) : null}
    </div>
  );
}

function DesktopNavigation({ pathname }) {
  return (
    <NavigationMenu viewport={false} className="hidden md:flex">
      <NavigationMenuList className="gap-2">
        {siteNavigation.map((item) => (
          <NavigationMenuItem key={item.url}>
            <NavigationMenuLink asChild>
              <Link
                to={item.url}
                data-active={pathname === item.url}
                className="rounded-full px-4 py-2 font-medium"
              >
                {item.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-4 lg:px-6">
        <Link
          to="/"
          className="flex min-w-0 flex-1 items-center gap-3 md:flex-none"
        >
          <img
            src="/logo.png"
            alt="UsedCars logo"
            className="h-10 w-auto shrink-0 object-contain sm:h-11"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.24em] text-primary uppercase">
              UsedCars
            </p>
          </div>
        </Link>
        <DesktopNavigation pathname={pathname} />
        <div className="order-3 w-full md:order-0 md:ml-auto md:flex md:flex-1 md:items-center md:justify-end md:gap-3">
          <HeaderSearch />
        </div>
      </div>
    </header>
  );
}
