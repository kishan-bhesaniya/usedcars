import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailItem } from "./detail-item";

export function CarDetailsOverview({ specs }) {
  return (
    <Card className="rounded-[32px]">
      <CardHeader>
        <CardTitle className="text-2xl">Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-8 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
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
  );
}
