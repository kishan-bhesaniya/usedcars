import { getCarCategory, getCarName, getCarStatus } from "@/lib/cars";

export const SORT_OPTIONS = [
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "year-newest", label: "Newest registration" },
  { value: "kms-low-high", label: "Kms: Low to High" },
];

export const YEAR_BUCKETS = [
  { value: "2022-2023", label: "2022 and newer", test: (year) => year >= 2022 },
  {
    value: "2020-2021",
    label: "2020 to 2021",
    test: (year) => year >= 2020 && year <= 2021,
  },
  {
    value: "2018-2019",
    label: "2018 to 2019",
    test: (year) => year >= 2018 && year <= 2019,
  },
  {
    value: "2017-older",
    label: "2017 and older",
    test: (year) => year <= 2017,
  },
];

export const KMS_BUCKETS = [
  { value: "0-20000", label: "Under 20,000 km", test: (kms) => kms <= 20000 },
  {
    value: "20001-40000",
    label: "20,001 to 40,000 km",
    test: (kms) => kms > 20000 && kms <= 40000,
  },
  {
    value: "40001-60000",
    label: "40,001 to 60,000 km",
    test: (kms) => kms > 40000 && kms <= 60000,
  },
  { value: "60001+", label: "Above 60,000 km", test: (kms) => kms > 60000 },
];

export function normalizeListValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim().toLowerCase())
      .filter(Boolean);
  }

  if (value === null || value === undefined || value === "") {
    return [];
  }

  return [String(value).trim().toLowerCase()];
}

export function toTitleCase(value) {
  return String(value)
    .split(" ")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}

export function formatCompactPrice(value) {
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

export function buildInventoryMeta(cars) {
  const prices = cars
    .map((car) => car.price)
    .filter((value) => typeof value === "number");
  const years = cars
    .map((car) => car.registration_year)
    .filter((value) => typeof value === "number");
  const kms = cars
    .map((car) => car.km_driven)
    .filter((value) => typeof value === "number");

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
    statuses: [
      ...new Set(cars.map((car) => getCarStatus(car)).filter(Boolean)),
    ].sort(),
    priceMin: prices.length > 0 ? Math.min(...prices) : 0,
    priceMax: prices.length > 0 ? Math.max(...prices) : 0,
    yearMin: years.length > 0 ? Math.min(...years) : 0,
    yearMax: years.length > 0 ? Math.max(...years) : 0,
    kmsMin: kms.length > 0 ? Math.min(...kms) : 0,
    kmsMax: kms.length > 0 ? Math.max(...kms) : 0,
  };
}

export function createInitialFilters(meta) {
  return {
    search: "",
    sort: "",
    minPrice: 0,
    maxPrice: meta.priceMax,
    minYear: meta.yearMin,
    maxYear: meta.yearMax,
    minKms: 0,
    maxKms: meta.kmsMax,
    brands: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissions: [],
    ownerships: [],
    statuses: [],
  };
}

export function toggleFilterValue(currentValues, value) {
  return currentValues.includes(value)
    ? currentValues.filter((item) => item !== value)
    : [...currentValues, value];
}

export function getActiveChips(filters, meta) {
  const chips = [];

  if (filters.search.trim()) {
    chips.push({ key: "search", label: `Search: ${filters.search.trim()}` });
  }

  if (filters.minPrice !== 0 || filters.maxPrice !== meta.priceMax) {
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

  if (filters.minYear !== meta.yearMin || filters.maxYear !== meta.yearMax) {
    chips.push({
      key: "year",
      label: `${filters.minYear} - ${filters.maxYear}`,
    });
  }

  if (filters.minKms !== 0 || filters.maxKms !== meta.kmsMax) {
    chips.push({
      key: "kms",
      label: `${filters.minKms.toLocaleString("en-IN")} km - ${filters.maxKms.toLocaleString("en-IN")} km`,
    });
  }

  return chips;
}

export function buildFacetCounts(cars, values, getValues) {
  return Object.fromEntries(
    values.map((value) => [
      value,
      cars.filter((car) => getValues(car).includes(value)).length,
    ]),
  );
}

export function filterAndSortCars(cars, filters) {
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

    if (typeof car.registration_year === "number") {
      if (
        car.registration_year < filters.minYear ||
        car.registration_year > filters.maxYear
      ) {
        return false;
      }
    }

    if (typeof car.km_driven === "number") {
      if (car.km_driven < filters.minKms || car.km_driven > filters.maxKms) {
        return false;
      }
    }

    if (
      typeof car.registration_year !== "number" &&
      (filters.minYear !== 0 || filters.maxYear !== 0)
    ) {
      return false;
    }

    if (
      typeof car.km_driven !== "number" &&
      (filters.minKms !== 0 || filters.maxKms !== 0)
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
      sorted.sort(
        (a, b) => (b.registration_year ?? 0) - (a.registration_year ?? 0),
      );
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
}
