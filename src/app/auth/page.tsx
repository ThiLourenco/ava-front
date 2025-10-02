"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    router.push("/platform/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Bem-vindo ao LMS</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="seuemail@exemplo.com" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="********" />
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
