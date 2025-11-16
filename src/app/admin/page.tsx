"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    order: 1,
    videoUrl: "",
    isFree: false,
  });

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const fetchCourses = async () => {
    const res = await fetch(`${apiBase}/courses`);
    const data = await res.json();
    setCourses(data);
  };

  const fetchModules = async (courseId: string) => {
    const res = await fetch(`${apiBase}/modules`);
    const data = await res.json();
    setModules(data.modules.filter((m: any) => m.courseId === courseId));
  };

  const fetchLessons = async (moduleId: string) => {
    const res = await fetch(`${apiBase}/lessons`);
    const data = await res.json();
    setLessons(data.lessons.filter((l: any) => l.moduleId === moduleId));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${apiBase}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        progress: 0,
        isFree: form.isFree,
      }),
    });
    setForm({ title: "", description: "", order: 1, videoUrl: "", isFree: false });
    fetchCourses();
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return alert("Selecione um curso primeiro");
    await fetch(`${apiBase}/courses/${selectedCourse}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, order: form.order }),
    });
    setForm({ title: "", description: "", order: 1, videoUrl: "", isFree: false });
    fetchModules(selectedCourse);
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModule) return alert("Selecione um módulo primeiro");
    await fetch(`${apiBase}/modules/${selectedModule}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        order: form.order,
        videoUrl: form.videoUrl,
      }),
    });
    setForm({ title: "", description: "", order: 1, videoUrl: "", isFree: false });
    fetchLessons(selectedModule);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Painel de Administração E-Learning
      </h1>

      {/* Seção de Cursos */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">📘 Cursos</h2>

        <form onSubmit={handleCreateCourse} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Título do curso"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded w-1/3"
            required
          />
          <input
            type="text"
            placeholder="Descrição"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded w-1/3"
            required
          />
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={() => setForm({ ...form, isFree: !form.isFree })}
            />
            Gratuito
          </label>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Adicionar
          </button>
        </form>

        <ul className="space-y-1">
          {courses.map((course) => (
            <li
              key={course.id}
              onClick={() => {
                setSelectedCourse(course.id);
                setSelectedModule(null);
                fetchModules(course.id);
              }}
              className={`cursor-pointer p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 ${
                selectedCourse === course.id ? "bg-blue-200 dark:bg-blue-700" : ""
              }`}
            >
              {course.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Seção de Módulos */}
      {selectedCourse && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-600">📗 Módulos</h2>

          <form onSubmit={handleCreateModule} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Título do módulo"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded w-1/2"
              required
            />
            <input
              type="number"
              placeholder="Ordem"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="border p-2 rounded w-1/4"
              required
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Adicionar
            </button>
          </form>

          <ul className="space-y-1">
            {modules.map((m) => (
              <li
                key={m.id}
                onClick={() => {
                  setSelectedModule(m.id);
                  fetchLessons(m.id);
                }}
                className={`cursor-pointer p-2 rounded hover:bg-green-100 dark:hover:bg-green-900 ${
                  selectedModule === m.id ? "bg-green-200 dark:bg-green-700" : ""
                }`}
              >
                {m.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Seção de Aulas */}
      {selectedModule && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">🎥 Aulas</h2>

          <form onSubmit={handleCreateLesson} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Título da aula"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded w-1/3"
              required
            />
            <input
              type="number"
              placeholder="Ordem"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="border p-2 rounded w-1/6"
              required
            />
            <input
              type="text"
              placeholder="URL do vídeo"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="border p-2 rounded w-1/3"
              required
            />
            <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Adicionar
            </button>
          </form>

          <ul className="space-y-1">
            {lessons.map((l) => (
              <li
                key={l.id}
                className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                {l.order}. {l.title} – 🎞️ {l.videoUrl}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
