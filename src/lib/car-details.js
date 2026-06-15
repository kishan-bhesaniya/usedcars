import { Calendar, Fuel, Gauge, Settings, Tag } from "lucide-react";
import { formatCurrency, formatList } from "@/lib/cars";

function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
}

export function getCarSpecs(car) {
  return [
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
}

export function getSimilarCars(cars, selectedCar, limit = 3) {
  if (!selectedCar) {
    return [];
  }

  const selectedFuelTypes = toArray(selectedCar.fuel_type);
  const selectedBodyTypes = toArray(selectedCar.body_type);
  const selectedTransmission = toArray(selectedCar.transmission);

  return cars
    .filter((item) => item.id !== selectedCar.id)
    .map((item) => {
      let score = 0;

      if (item.brand && item.brand === selectedCar.brand) {
        score += 4;
      }

      if (item.model && item.model === selectedCar.model) {
        score += 3;
      }

      const itemFuelTypes = toArray(item.fuel_type);
      const itemBodyTypes = toArray(item.body_type);
      const itemTransmission = toArray(item.transmission);

      if (itemFuelTypes.some((value) => selectedFuelTypes.includes(value))) {
        score += 2;
      }

      if (itemBodyTypes.some((value) => selectedBodyTypes.includes(value))) {
        score += 2;
      }

      if (
        itemTransmission.some((value) => selectedTransmission.includes(value))
      ) {
        score += 1;
      }

      if (
        typeof item.price === "number" &&
        typeof selectedCar.price === "number" &&
        selectedCar.price > 0
      ) {
        const delta = Math.abs(item.price - selectedCar.price) / selectedCar.price;

        if (delta <= 0.1) {
          score += 2;
        } else if (delta <= 0.2) {
          score += 1;
        }
      }

      return { item, score };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
