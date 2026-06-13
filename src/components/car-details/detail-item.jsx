export function DetailItem({ label, value, icon: Icon }) {
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
