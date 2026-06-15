export function getImageUrl(imageValue) {
  if (!imageValue) {
    return "";
  }

  if (Array.isArray(imageValue)) {
    for (const item of imageValue) {
      const nestedUrl = getImageUrl(item);
      if (nestedUrl) {
        return nestedUrl;
      }
    }

    return "";
  }

  if (typeof imageValue === "string") {
    return imageValue;
  }

  if (typeof imageValue === "object") {
    if (typeof imageValue.url === "string") {
      return imageValue.url;
    }

    if (typeof imageValue.id === "string") {
      return imageValue.id;
    }

    if (typeof imageValue.id === "number") {
      return String(imageValue.id);
    }

    if (typeof imageValue.filename_disk === "string") {
      return imageValue.id ?? imageValue.filename_disk;
    }

    const nestedKeys = [
      "directus_files_id",
      "file",
      "files",
      "image",
      "src",
      "data",
    ];

    for (const key of nestedKeys) {
      const nestedUrl = getImageUrl(imageValue[key]);
      if (nestedUrl) {
        return nestedUrl;
      }
    }
  }

  return "";
}

export function getCarImage(car) {
  return (
    getImageUrl(car.main_image) ||
    getImageUrl(car.mainImage) ||
    getImageUrl(car.image) ||
    getImageUrl(car.image_url) ||
    getImageUrl(car.imageUrl) ||
    getImageUrl(car.thumbnail) ||
    getImageUrl(car.photo) ||
    getImageUrl(car.images) ||
    getImageUrl(car.gallery) ||
    ""
  );
}

export function getCarGallery(car) {
  const gallery = [
    getCarImage(car),
    getImageUrl(car.sub_image),
    ...(Array.isArray(car.sub_image)
      ? car.sub_image.map((item) => getImageUrl(item))
      : []),
    ...(Array.isArray(car.gallery)
      ? car.gallery.map((item) => getImageUrl(item))
      : []),
    ...(Array.isArray(car.images)
      ? car.images.map((item) => getImageUrl(item))
      : []),
  ].filter(Boolean);

  return [...new Set(gallery)];
}

export function getCarName(car, index = 0) {
  const brand = car.brand?.trim?.();
  const model = car.model?.trim?.();
  const variant = car.variant?.trim?.();

  if (brand || model || variant) {
    return [brand, model, variant].filter(Boolean).join(" ");
  }

  return car.name ?? car.title ?? `Car ${index + 1}`;
}

export function getCarCategory(car) {
  if (Array.isArray(car.body_type) && car.body_type.length > 0) {
    return car.body_type.join(", ");
  }

  return car.category ?? car.type ?? car.brand ?? "Unknown category";
}

export function getCarStatus(car) {
  return car.status ?? car.availability ?? car.additional_badge ?? "";
}

export function formatCurrency(value) {
  if (typeof value !== "number") {
    return value || "N/A";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatList(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value || "N/A";
}
