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
    <aside className="w-20 flex flex-col items-center bg-background dark:bg-dark-secondary p-4 space-y-6">
      <div className="text-primary dark:text-dark-primary font-bold text-2xl">TL</div>
      <nav className="flex flex-col items-center space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="p-3 rounded-lg text-gray-500 hover:bg-secondary hover:text-primary dark:hover:bg-dark-background"
            title={item.label}
          >
            <item.icon className="h-6 w-6" />
          </Link>
        ))}
      </nav>
    </aside>
  );
}
