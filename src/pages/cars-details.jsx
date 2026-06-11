import { useState } from "react";
import carsData from "../../cars.json";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Gauge,
  Settings,
  Tag,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageLoading } from "@/hooks/use-page-loading";
import {
  formatCurrency,
  formatList,
  getCarCategory,
  getCarGallery,
  getCarName,
  getCarStatus,
} from "@/lib/cars";

function getCurrentCarId() {
  const pathname = window.location.pathname || "";
  const segments = pathname.split("/").filter(Boolean);

  return segments[1] || "";
}

function navigateToCars() {
  window.history.pushState({}, "", "/car");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="border-border border-b py-4 last:border-b-0">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}

export default function CarsDetailsPage() {
  const cars = Array.isArray(carsData?.data) ? carsData.data : [];
  const carId = getCurrentCarId();
  const car = cars.find((item) => item.id === carId);
  const gallery = car ? getCarGallery(car) : [];
  const [photoState, setPhotoState] = useState({ carId, index: 0 });
  const isLoading = usePageLoading([carId]);
  const status = car ? getCarStatus(car) : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
        <SiteHeader title="Car details" />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
          <div className="mb-2">
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Card className="overflow-hidden rounded-[32px] pt-0">
              <div className="space-y-4 p-4">
                <Skeleton className="aspect-16/10 w-full rounded-3xl" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="aspect-4/3 w-full rounded-2xl"
                    />
                  ))}
                </div>
              </div>
            </Card>

            <Card className="rounded-[32px]">
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-32" />
              </CardHeader>
              <CardContent className="grid gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-border border-b py-4 last:border-b-0"
                  >
                    <Skeleton className="mb-2 h-4 w-1/3" />
                    <Skeleton className="h-5 w-2/3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[32px]">
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent className="grid gap-x-6 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="border-border border-b py-4 last:border-b-0"
                >
                  <Skeleton className="mb-2 h-4 w-1/3" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
        <SiteHeader title="Car details" />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
          <Card className="rounded-[32px]">
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <p className="text-lg font-semibold">Car not found</p>
              <p className="text-muted-foreground text-sm">
                The selected car could not be loaded.
              </p>
              <Button
                type="button"
                className="rounded-full"
                onClick={navigateToCars}
              >
                Back to Cars
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const selectedImageIndex = photoState.carId === carId ? photoState.index : 0;
  const selectedImage = gallery[selectedImageIndex] || "";

  const showPreviousImage = () => {
    if (gallery.length === 0) {
      return;
    }

    setPhotoState({
      carId,
      index:
        selectedImageIndex === 0 ? gallery.length - 1 : selectedImageIndex - 1,
    });
  };

  const showNextImage = () => {
    if (gallery.length === 0) {
      return;
    }

    setPhotoState({
      carId,
      index:
        selectedImageIndex === gallery.length - 1 ? 0 : selectedImageIndex + 1,
    });
  };

  const specs = [
    {
      label: "Price",
      value: formatCurrency(car.price),
      icon: Tag,
    },
    {
      label: "Registration Year",
      value: car.registration_year || "N/A",
      icon: Calendar,
    },
    {
      label: "Fuel Type",
      value: formatList(car.fuel_type),
      icon: Fuel,
    },
    {
      label: "Transmission",
      value: formatList(car.transmission),
      icon: Settings,
    },
    {
      label: "Kilometers Driven",
      value:
        typeof car.km_driven === "number"
          ? `${car.km_driven.toLocaleString("en-IN")} km`
          : "N/A",
      icon: Gauge,
    },
    {
      label: "Body Type",
      value: formatList(car.body_type),
      icon: Tag,
    },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
      <SiteHeader title="Car details" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:px-6 lg:py-8">
        <div className="mb-2">
          <Button
            type="button"
            variant="outline"
            onClick={navigateToCars}
            className="gap-2 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          {/*left side:main gallery image and thumbnail navigation. */}
          <Card className="overflow-hidden rounded-[32px] pt-0">
            {gallery.length > 0 ? (
              <div className="space-y-4 p-4">
                <div className="relative overflow-hidden rounded-3xl border bg-muted">
                  <img
                    src={selectedImage}
                    alt={`${getCarName(car)} image ${selectedImageIndex + 1}`}
                    className="aspect-16/10 w-full object-cover"
                  />

                  {gallery.length > 1 ? (
                    <>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={showPreviousImage}
                        className="absolute top-1/2 left-4 h-10 w-10 -translate-y-1/2 rounded-full shadow-sm"
                        aria-label="Show previous photo"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={showNextImage}
                        className="absolute top-1/2 right-4 h-10 w-10 -translate-y-1/2 rounded-full shadow-sm"
                        aria-label="Show next photo"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div className="absolute right-4 bottom-4 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
                        {selectedImageIndex + 1} / {gallery.length}
                      </div>
                    </>
                  ) : null}
                </div>

                {gallery.length > 1 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {gallery.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setPhotoState({ carId, index })}
                        className={`overflow-hidden rounded-2xl border transition ${
                          selectedImageIndex === index
                            ? "ring-primary border-primary ring-2"
                            : "border-border hover:border-primary/50"
                        }`}
                        aria-label={`Show photo ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt={`${getCarName(car)} view ${index + 1}`}
                          className="aspect-4/3 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="bg-muted text-muted-foreground flex aspect-16/10 items-center justify-center">
                No image available
              </div>
            )}
          </Card>

          {/* Right side:car title, price, and key purchase details. */}
          <Card className="rounded-[32px]">
            <CardHeader className="gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-2xl">{getCarName(car)}</CardTitle>
                {status ? <Badge variant="">{status}</Badge> : null}
              </div>
              <p className="text-muted-foreground text-sm">
                {getCarCategory(car)}
              </p>
              <p className="text-3xl font-bold">{formatCurrency(car.price)}</p>
            </CardHeader>
            <CardContent className="grid gap-0">
              <DetailItem
                label="Variant"
                value={car.variant || "N/A"}
                icon={Tag}
              />
              <DetailItem
                label="Ownership"
                value={formatList(car.ownership)}
                icon={Tag}
              />
              <DetailItem
                label="Engine"
                value={car.engine || "N/A"}
                icon={Settings}
              />
              <DetailItem
                label="EMI Per Month"
                value={car.emi_per_month || "N/A"}
                icon={Tag}
              />
              <DetailItem
                label="Original Price"
                value={car.original_price || "N/A"}
                icon={Tag}
              />
              <DetailItem
                label="Discount"
                value={car.discount_price || "N/A"}
                icon={Tag}
              />
            </CardContent>
          </Card>
        </div>

        {/* Section overview. */}
        <Card className="rounded-[32px]">
          <CardHeader>
            <CardTitle className="text-2xl">Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-x-6 md:grid-cols-2 xl:grid-cols-3">
            {specs.map((spec) => (
              <DetailItem
                key={spec.label}
                label={spec.label}
                value={spec.value}
                icon={spec.icon}
              />
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
