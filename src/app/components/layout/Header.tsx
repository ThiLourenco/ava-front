import { Bell, UserCircle } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-background/95 px-6 backdrop-blur-sm">
      <div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-full h-9 w-9 text-muted-foreground transition-colors hover:text-primary hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <Link
          href={"/platform/profile"}
          className="inline-flex items-center justify-center rounded-full h-9 w-9 text-muted-foreground transition-colors hover:text-primary hover:bg-muted"
        >
          <UserCircle className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
