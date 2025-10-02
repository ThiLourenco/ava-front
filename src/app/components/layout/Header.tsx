import { Bell, UserCircle } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-background">
      <div>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle  />
        <Bell className="h-5 w-5" />
        <Link href={"/platform/profile"}>
          <UserCircle className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
