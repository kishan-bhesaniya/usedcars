import { siteUser } from "@/lib/site";
import { Copyright } from "lucide-react";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-[#081f35] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 px-4 py-8 pt-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center">
            <Copyright className="h-4 w-4 shrink-0" />
            <span> {currentYear} UsedCars.</span>
          </p>
          <p>Built for smoother used-car discovery.</p>
        </div>
        <p>Managed by {siteUser.name}</p>
      </div>
    </footer>
  );
}
