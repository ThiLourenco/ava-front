"use client";

interface LessonPlayerProps {
  type: "video" | "text";
  url?: string;
  content?: string;
  title: string;
  autoplay?: boolean;
}

const getYouTubeId = (url: string): string | null => {
  const embedMatch = url.match(/embed\/([^?]+)/);
  if (embedMatch) return embedMatch[1];

  const normalMatch = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return normalMatch ? normalMatch[1] : null;
};

export default function LessonPlayer({
  type,
  url,
  content,
  title,
  autoplay = false,
}: LessonPlayerProps) {
  if (type === "text" && content) {
    return (
      <div className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-dark-background rounded-md overflow-auto">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  if (type === "video" && url) {
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

    if (isYouTube) {
      const videoId = getYouTubeId(url);
      if (!videoId) return <p>Vídeo inválido</p>;

      const src = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0
        }&modestbranding=0&rel=0&iv_load_policy=0&showinfo=0&controls=1`;

      return (
        <div className="flex mb-6">
          <div className="w-[900px] h-[600px] rounded-md overflow-hidden bg-black">
            <iframe
              src={src}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

      );
    }


    return (
      <div className="aspect-video rounded-md overflow-hidden bg-black mb-6">
        <video src={url} controls autoPlay={autoplay} className="w-full h-full">
          Seu navegador não suporta vídeo.
        </video>
      </div>
    );
  }

  return <p>Conteúdo não disponível</p>;
}
