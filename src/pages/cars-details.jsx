import { useState } from "react";
import carsData from "../../cars.json";
import { ArrowLeft, Calendar, Fuel, Gauge, Settings, Tag } from "lucide-react";
import { CarDetailsGallery } from "@/components/car-details/car-details-gallery";
import { CarDetailsNotFound } from "@/components/car-details/car-details-not-found";
import { CarDetailsOverview } from "@/components/car-details/car-details-overview";
import { CarDetailsSkeleton } from "@/components/car-details/car-details-skeleton";
import { CarDetailsSummary } from "@/components/car-details/car-details-summary";
import { SiteFooter } from "@/components/footer";
import { SiteHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { usePageLoading } from "@/hooks/use-page-loading";
import {
  formatCurrency,
  formatList,
  getCarGallery,
  getCarStatus,
} from "@/lib/cars";
import { useNavigate, useParams } from "react-router-dom";

export default function CarsDetailsPage() {
  const navigate = useNavigate();
  const { carId = "" } = useParams();
  const cars = Array.isArray(carsData?.data) ? carsData.data : [];
  const car = cars.find((item) => item.id === carId);
  const gallery = car ? getCarGallery(car) : [];
  const [photoState, setPhotoState] = useState({ carId, index: 0 });
  const isLoading = usePageLoading([carId]);
  const status = car ? getCarStatus(car) : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
        <SiteHeader title="Car details" />
        <CarDetailsSkeleton />
        <SiteFooter />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfd_0%,#eef3f7_100%)]">
        <SiteHeader title="Car details" />
        <CarDetailsNotFound onBack={() => navigate("/car")} />
        <SiteFooter />
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
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/car")}
            className="gap-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cars
          </Button>
        </div>
        <div className="grid gap-6 lg:gap-8 xl:grid-cols-[1.4fr_1fr]">
          <CarDetailsGallery
            car={car}
            carId={carId}
            gallery={gallery}
            selectedImage={selectedImage}
            selectedImageIndex={selectedImageIndex}
            onSelectImage={setPhotoState}
            onShowPreviousImage={showPreviousImage}
            onShowNextImage={showNextImage}
          />
          <CarDetailsSummary car={car} status={status} />
        </div>
        <CarDetailsOverview specs={specs} />
      </main>
      <SiteFooter />
    </div>
  );
}
