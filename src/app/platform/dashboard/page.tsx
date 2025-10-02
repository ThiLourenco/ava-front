import { getCourses, getUser } from "@/app/lib/api";
import { User } from "@/app/lib/types";
import { PlayCircle, DollarSign, HelpCircle, Info } from "lucide-react";
import CourseCard from "@/app/components/course/CourseCard";
import Image from "next/image";
import Link from "next/link";

const InfoCard = ({
  title,
  text,
  icon: Icon,
  linkText,
  linkHref,
}: {
  title: string;
  text: string;
  icon: React.ElementType;
  linkText: string;
  linkHref: string;
}) => (
  <div className="bg-foreground p-4 rounded-lg shadow-md flex flex-col h-full">
    <div className="flex justify-between items-start">
      <h3 className="font-bold text-lg text-foreground">{title}</h3>
      <Icon className="h-6 w-6 text-foreground/50" />
    </div>
    <p className="text-sm text-foreground/70 mt-2 flex-grow">{text}</p>
    <Link href={linkHref}>
      <span className="text-sm font-semibold text-primary mt-4 inline-block hover:underline">
        {linkText}
      </span>
    </Link>
  </div>
);

const ProfileSummaryCard = ({ user }: { user: User }) => (
  <div className="bg-foreground p-4 rounded-lg shadow-md flex flex-col h-full items-center text-center">
    <Image
      src={user.avatarUrl}
      alt="Foto do usuário"
      width={80}
      height={80}
      className="rounded-full"
    />
    <h3 className="font-bold mt-4 text-foreground">{user.name}</h3>
    <p className="text-xs text-foreground/70">CPF: {user.cpf}</p>
    <div className="bg-success text-success-foreground text-xs font-bold px-4 py-1 rounded-full my-3">
      Meu Cadastro
    </div>
    <div className="w-full bg-border rounded-full h-2 my-2">
      <div className="bg-success h-2 rounded-full" style={{ width: "100%" }}></div>
    </div>
    <div className="w-full space-y-2 mt-4">
      <Link href={"/platform/profile"}>
        <button className="w-full border border-zinc-400  text-primary font-semibold py-2 rounded-lg text-sm">
          Editar Perfil
        </button>
      </Link>
    </div>
    <div className="w-full space-y-2 mt-2">
      <Link href={"/platform/dashboard/#"}>
        <button className="w-full border border-zinc-400  text-primary font-semibold py-2 rounded-lg text-sm">
          Mensagens
        </button>
      </Link>
    </div>
  </div>
);

export default async function DashboardPage() {
  const user = await getUser();
  const courses = await getCourses();

  const completedCourses = courses.filter((c) => c.progress === 100);
  const inProgressCourses = courses.filter((c) => c.progress < 100);

  const lastAccessedCourse =
    inProgressCourses.length > 0 ? inProgressCourses[0] : completedCourses[0];

  return (
    <div className="space-y-8 w-auto">
      <h1 className="text-3xl font-bold text-foreground">
        Boas-vindas, {user.name.split(" ")[0]}!
      </h1>

      {/* Grid Principal de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 e 2 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-foreground p-4 rounded-lg shadow-md flex flex-col h-full">
            <p className="text-sm text-foreground/70">Seu último acesso</p>
            <div className="flex items-center justify-between mt-2">
              <h3 className="font-bold text-lg text-primary">{lastAccessedCourse.title}</h3>
              <Link href={`/platform/courses/${lastAccessedCourse.id}`}>
                <PlayCircle className="h-8 w-8 text-primary cursor-pointer" />
              </Link>
            </div>
            <p className="text-sm text-foreground/60">
              {lastAccessedCourse.description.substring(0, 40)}...
            </p>
          </div>

          <div className="bg-foreground p-4 rounded-lg shadow-sm flex flex-col h-full">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-foreground">Financeiro</h3>
                <p className="text-sm text-foreground/70 mt-2">
                  Acompanhe suas faturas e pagamentos.
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-foreground/50" />
            </div>
            <div className="mt-4 bg-success text-success-foreground font-bold text-sm text-center py-2 rounded-lg">
              PARCELAS EM DIA!
            </div>
          </div>

          <InfoCard
            title="Solicitação de Serviços"
            text="Solicite documentos, entre outros itens."
            icon={Info}
            linkText="Acessar Serviços"
            linkHref="#"
          />

          <InfoCard
            title="Precisa de ajuda?"
            text="Fale com a nossa equipe de atendimento."
            icon={HelpCircle}
            linkText="Acessar FAQ"
            linkHref="#"
          />
        </div>

        {/* Coluna 3 */}
        <div className="lg:col-span-1">
          <ProfileSummaryCard user={user} />
        </div>
      </div>

      {/* Seção de Cursos Finalizados */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Cursos Finalizados</h2>
        <div className="grid grid-cols- md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {completedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
