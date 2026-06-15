import { Settings, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatList, getCarCategory, getCarName } from "@/lib/cars";
import { DetailItem } from "./detail-item";

export function CarDetailsSummary({ car, status }) {
  return (
    <Card className="rounded-[32px]">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-2xl">{getCarName(car)}</CardTitle>
          {status ? <Badge variant="">{status}</Badge> : null}
        </div>
        <p className="text-muted-foreground text-sm">{getCarCategory(car)}</p>
        <p className="text-3xl font-bold">{formatCurrency(car.price)}</p>
      </CardHeader>
      <CardContent className="grid gap-0">
        <DetailItem label="Variant" value={car.variant || "N/A"} icon={Tag} />
        <DetailItem
          label="Ownership"
          value={formatList(car.ownership)}
          icon={Tag}
        />
        <DetailItem label="Engine" value={car.engine || "N/A"} icon={Settings} />
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
  );
}
