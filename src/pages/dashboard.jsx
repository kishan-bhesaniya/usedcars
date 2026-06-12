import carsData from "../../cars.json";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageLoading } from "@/hooks/use-page-loading";
import {
  formatCurrency,
  formatList,
  getCarCategory,
  getCarImage,
  getCarName,
} from "@/lib/cars";
import { SearchIcon, SparklesIcon } from "lucide-react";

function navigateTo(url) {
  if (!url || window.location.pathname === url) {
    return;
  }

  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function openCarsPage() {
  navigateTo("/car");
}

function focusGlobalSearch() {
  const searchInput = document.querySelector(
    'input[aria-label="Global search"]',
  );

  if (searchInput instanceof HTMLInputElement) {
    searchInput.focus();
  }
}

function getCarsSummary(data) {
  const cars = Array.isArray(data?.data) ? data.data : [];
  const brands = new Set();

  for (const car of cars) {
    if (car?.brand) {
      brands.add(car.brand);
    }
  }

  return {
    totalCars: cars.length,
    totalBrands: brands.size,
  };
}

const carsSummary = getCarsSummary(carsData);
const cars = Array.isArray(carsData?.data) ? carsData.data : [];
const featuredCar =
  cars.length > 0 ? cars[Math.floor(Math.random() * cars.length)] : null;

export default function Dashboard01() {
  const isLoading = usePageLoading();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(12,82,151,0.22),transparent_32%),linear-gradient(180deg,#f7fafc_0%,#eef4f8_52%,#ffffff_100%)]">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 lg:px-6 lg:py-8">
          <section className="overflow-hidden rounded-[40px] bg-[#092746] shadow-2xl shadow-slate-900/15">
            <div className="grid gap-10 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
              <div className="space-y-6">
                <Skeleton className="h-8 w-40 bg-white/15" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full max-w-xl bg-white/15" />
                  <Skeleton className="h-12 w-4/5 max-w-lg bg-white/12" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Skeleton className="h-11 w-44 rounded-full bg-white/15" />
                  <Skeleton className="h-11 w-44 rounded-full bg-white/12" />
                </div>
                <div className="grid gap-4 pt-2 sm:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="space-y-2">
                      <Skeleton className="h-8 w-20 bg-white/15" />
                      <Skeleton className="h-4 w-28 bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md space-y-4 rounded-[32px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <Skeleton className="aspect-4/3 w-full rounded-[24px] bg-white/12" />
                  <div className="space-y-3">
                    <Skeleton className="h-7 w-2/3 bg-white/15" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                    <div className="grid grid-cols-2 gap-3">
                      <Skeleton className="h-20 rounded-2xl bg-white/10" />
                      <Skeleton className="h-20 rounded-2xl bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(12,82,151,0.22),transparent_32%),linear-gradient(180deg,#f7fafc_0%,#eef4f8_52%,#ffffff_100%)]">
      <SiteHeader title="" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 lg:px-6 lg:py-8">
        {/* Hero section. */}
        <section className="overflow-hidden rounded-[40px] bg-[#092746] text-white shadow-2xl shadow-slate-900/15">
          <div className="grid gap-10 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
            <div className="relative">
              <div className="absolute -top-10 -left-6 h-40 w-40 rounded-full bg-cyan-400/18 blur-3xl" />
              <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
              <div className="relative max-w-2xl space-y-6">
                <Badge className="rounded-md w-fit border border-white/15 bg-white/10 px-4 py-1 text-white">
                  <SparklesIcon className="mr-2 h-4 w-4" />
                  Trusted cars, clean buying
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-xl text-4xl leading-tight font-semibold sm:text-5xl">
                    Explore your car products from one clear, customer-friendly
                    home page.
                  </h1>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={openCarsPage}
                    className="rounded-full cursor-pointer bg-white px-6 text-slate-900 hover:bg-white/90"
                  >
                    Explore Car
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={focusGlobalSearch}
                    className="rounded-full cursor-pointer border-white/20 bg-white/6 px-6 text-white hover:bg-white/10 hover:text-white"
                  >
                    <SearchIcon className="h-4 w-4" />
                    Search any model
                  </Button>
                </div>
                <div className="grid gap-4 pt-2 sm:grid-cols-3">
                  <div>
                    <p className="text-3xl font-semibold">
                      {carsSummary.totalCars}+
                    </p>
                    <p className="text-sm text-white/68">Products in stock</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">
                      {carsSummary.totalBrands}+
                    </p>
                    <p className="text-sm text-white/68">Popular brands</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">3-Step</p>
                    <p className="text-sm text-white/68">Simple buying flow</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Featured card highlights. */}
            {featuredCar ? (
              <div className="relative flex items-center justify-center">
                <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/8 shadow-2xl shadow-slate-950/25 backdrop-blur">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={getCarImage(featuredCar)}
                      alt={getCarName(featuredCar)}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/70 to-transparent" />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="space-y-1">
                      <p className="text-2xl font-semibold">
                        {getCarName(featuredCar)}
                      </p>
                      <p className="text-sm text-white/70">
                        {getCarCategory(featuredCar)}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-white/78">
                      <div className="rounded-2xl bg-white/6 p-3">
                        <p className="text-white/60">Price</p>
                        <p className="mt-1 font-medium text-white">
                          {formatCurrency(featuredCar.price)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/6 p-3">
                        <p className="text-white/60">Fuel</p>
                        <p className="mt-1 font-medium text-white">
                          {formatList(featuredCar.fuel_type)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
