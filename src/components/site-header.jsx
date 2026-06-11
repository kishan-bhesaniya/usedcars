import { useMemo, useState } from "react";
import carsData from "../../cars.json";
import { getCarCategory, getCarName } from "@/lib/cars";
import { siteNavigation, siteUser } from "@/lib/site";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  EllipsisVerticalIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

function navigateTo(url) {
  if (!url || window.location.pathname === url) {
    return;
  }

  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

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

    navigateTo(firstMatch.url);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-xl">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
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
        placeholder="Search models or brands "
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
          onSelect={navigateTo}
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
            <NavigationMenuLink
              href={item.url}
              data-active={pathname === item.url}
              className="rounded-full px-4 py-2 font-medium"
            >
              {item.title}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNavigation({ pathname }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full md:hidden"
          aria-label="Open navigation menu"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Jump across the UsedCars experience.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-6 pb-6">
          {siteNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <SheetClose asChild key={item.url}>
                <a
                  href={item.url}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    pathname === item.url
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border hover:bg-muted/70"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </a>
              </SheetClose>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-auto rounded-full border border-border/70 px-2 py-1.5"
        >
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={siteUser.avatar} alt={siteUser.name} />
            <AvatarFallback className="rounded-full bg-primary/10 text-primary">
              UC
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium">{siteUser.name}</p>
            <p className="text-xs text-muted-foreground">{siteUser.email}</p>
          </div>
          <EllipsisVerticalIcon className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-2xl">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-full">
              <AvatarImage src={siteUser.avatar} alt={siteUser.name} />
              <AvatarFallback className="rounded-full bg-primary/10 text-primary">
                UC
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{siteUser.name}</p>
              <p className="text-xs text-muted-foreground">{siteUser.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigateTo("/car")}>
          Browse cars
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const pathname = window.location.pathname || "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-4 lg:px-6">
        <MobileNavigation pathname={pathname} />
        <a href="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt="UsedCars logo"
            className="h-11 w-auto shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[0.24em] text-primary uppercase">
              UsedCars
            </p>
          </div>
        </a>
        <DesktopNavigation pathname={pathname} />
        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <HeaderSearch />
        </div>
      </div>
    </header>
  );
}
