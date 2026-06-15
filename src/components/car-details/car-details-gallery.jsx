import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCarName } from "@/lib/cars";

export function CarDetailsGallery({
  car,
  carId,
  gallery,
  selectedImage,
  selectedImageIndex,
  onSelectImage,
  onShowPreviousImage,
  onShowNextImage,
}) {
  return (
    <Card className="overflow-hidden rounded-[32px] pt-0">
      {gallery.length > 0 ? (
        <div className="space-y-4 p-4 sm:space-y-5 sm:p-5 lg:p-6">
          <div className="relative overflow-hidden rounded-[24px] border bg-muted sm:rounded-3xl">
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
                  onClick={onShowPreviousImage}
                  className="absolute top-1/2 left-2 h-6 w-6 rounded-full shadow-sm sm:h-10 sm:w-10"
                  aria-label="Show previous photo"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={onShowNextImage}
                  className="absolute top-1/2 right-2 h-6 w-6 rounded-full shadow-sm sm:h-10 sm:w-10"
                  aria-label="Show next photo"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <div className="absolute right-2 bottom-2 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white sm:right-4 sm:bottom-4 sm:px-3 sm:text-xs">
                  {selectedImageIndex + 1} / {gallery.length}
                </div>
              </>
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => onSelectImage({ carId, index })}
                  className={`overflow-hidden rounded-xl border transition sm:rounded-2xl ${
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
  );
}
