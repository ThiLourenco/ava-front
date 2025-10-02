"use client"; 

import { useState, ChangeEvent, FormEvent } from "react";
import { User } from "@/app/lib/types";
import { MOCK_USER } from "@/app/lib/api";
import Image from "next/image";
import { Mail, Phone, User as UserIcon } from "lucide-react";

const user: User = MOCK_USER;

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Dados do perfil salvos:", formData);
    alert("Perfil atualizado com sucesso! (Simulação)");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
      
      {/* Card Principal */}
      <div className="bg-backgroud border p-8 rounded-2xl shadow-sm max-w-3xl mx-auto ">
        <form onSubmit={handleSubmit}>
          
          {/* Seção de Avatar e Identificação */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Image
                src={imagePreview || user.avatarUrl}
                alt="Foto do usuário"
                width={128}
                height={128}
                className="rounded-full ring-4 ring-primary/20 dark:ring-dark-primary/20"
              />
              <label 
                htmlFor="avatarInput" 
                className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                <UserIcon size={16}/>
              </label>
               <input 
                 type="file" 
                 id="avatarInput" 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleImageChange}
               />
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">CPF: {user.cpf}</p>
          </div>
          
          <hr className="my-8 border-gray-200 dark:border-gray-700"/>

          {/* Campos Editáveis do Formulário */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text" id="name" name="name"
                  value={formData.name} onChange={handleInputChange}
                  className="w-full pl-10 p-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleInputChange}
                  className="w-full pl-10 p-3 bg-background border  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold  mb-2">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone} onChange={handleInputChange}
                  placeholder="(00) 90000-0000"
                  className="w-full pl-10 p-3 bg-background border  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          
          {/* Botão de Ação */}
          <div className="flex justify-end mt-8">
            <button type="submit" className="bg-primary border cursor-pointer dark:bg-dark-primary font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}