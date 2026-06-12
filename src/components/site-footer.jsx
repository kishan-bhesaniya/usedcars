import { Copyright } from "lucide-react";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-[#081f35] text-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center border-t border-white/10 px-4 py-8 pt-5 text-sm text-slate-400">
        <div>
          <p className="flex items-center justify-center">
            <Copyright className="h-4 w-4 shrink-0" />
            <span> {currentYear} UsedCars, All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
