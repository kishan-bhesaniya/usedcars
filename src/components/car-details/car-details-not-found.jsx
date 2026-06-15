import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CarDetailsNotFound({ onBack }) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
      <Card className="rounded-[32px]">
        <CardContent className="flex flex-col items-start gap-4 p-6">
          <p className="text-lg font-semibold">Car not found</p>
          <p className="text-muted-foreground text-sm">
            The selected car could not be loaded.
          </p>
          <Button type="button" className="rounded-full " onClick={onBack}>
            Back to Cars
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
