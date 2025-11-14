"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { loginUser } from "@/app/lib/api";

export default function LoginPage() {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });

      await auth.login(response.token);

    } catch (err: any) {
      console.error(err);
      setError("Email ou senha inválidos. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Bem-vindo ao LMS</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* 9. Exiba mensagens de erro */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}