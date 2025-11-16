import { Home, BookOpen, User, LogOut } from "lucide-react";
import Link from "next/link";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/platform/dashboard" },
  { icon: BookOpen, label: "Meus Cursos", href: "/platform/courses" },
  { icon: User, label: "Perfil", href: "/platform/profile" },
  { icon: LogOut, label: "Sair", href: "/auth" },
];

export default function Sidebar() {
  return (
    <aside className="w-20 flex flex-col items-center bg-card py-6 space-y-8">
      <div className="h-10 flex items-center justify-center">
        <span className="text-primary font-bold text-3xl">TL</span>
      </div>

      <nav className="flex flex-col items-center space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}            
            className="p-3 rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            title={item.label}
          >
            <item.icon className="h-6 w-6" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
