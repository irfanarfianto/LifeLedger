import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Navbar() {
  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            LifeLedger
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link href="/auth/login">
            <Button variant="default" size="sm">
              Masuk
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
