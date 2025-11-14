"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { User as UserIcon, Loader2 } from "lucide-react";
import apiClient from "@/app/lib/apiClient";

interface User {
  id: string;
  name: string;
  email: string;
  cpf: number;
  phone?: string;
  avatarUrl?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await apiClient.get("/users/me");
        setUser(data);
        setFormData({ name: data.name, email: data.email || "" });
        if (data.avatarUrl) setAvatarPreview(`http://localhost:5000${data.avatarUrl}`);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }
    loadUser();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
       setIsLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      if (avatarFile) data.append("file", avatarFile);

      const response = await apiClient.put(`/users/${user.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data);
      console.log(response.data)
      // toast({ title: "Perfil atualizado com sucesso!" });
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      // toast({ title: "Erro ao atualizar perfil", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  }


  if (!user) return <p>Carregando...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>

      <div className="bg-background border p-8 rounded-2xl shadow-sm max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 relative">
                <Image
                  src={avatarPreview || "/default-avatar.png"}
                  alt="Foto do usuário"
                  fill
                  className="rounded-full ring-4 ring-primary/20 object-cover"
                  // style={{ width: "auto", height: "auto" }}
                />
              </div>

              <label
                htmlFor="avatarInput"
                className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <UserIcon size={16} />
              </label>
              <input
                type="file"
                id="avatarInput"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">CPF: {user.cpf}</p>
            <p className="text-sm text-gray-500">E-mail: {user.email}</p>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Formulário */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  className="w-full pl-10 p-3 bg-gray-100 border rounded-lg cursor-not-allowed"
                />
              </div>
            </div> */}
          </div>

          {/* Botão */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity text-white flex items-center gap-2"
            >
              { isLoading && <Loader2 className="animate-spin" size={18} />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
