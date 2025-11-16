"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

import { CheckCircle, Circle } from "lucide-react";
import { useLessonProgress } from "@/hooks/useLessonProgress";

type Props = {
  type: "video" | "text";
  url?: string;
  content?: string;
  title: string;
  autoplay?: boolean;
  lessonId: string;
  courseId: string;
  moduleId: string;
  onProgressUpdate?: () => void;

};

export default function LessonPlayer({
  type,
  url,
  content,
  title,
  autoplay = false,
  lessonId,
  courseId,
  moduleId
}: Props) {
  const { user } = useAuth();
  const playerRef = useRef<any>(null);
  const pollTimerRef = useRef<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);


  const {
    progress,
    completed,
    updateProgress,
    markAsCompleted,
  } = useLessonProgress(lessonId, user?.id, moduleId, courseId ?? "");

  const COMPLETION_THRESHOLD = 90; // %
  const POLL_INTERVAL_MS = 1000;

  const getYouTubeId = (u?: string | null) => {
    if (!u) return null;
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const m = u.match(regex);
    return m ? m[1] : null;
  };

  const videoId = getYouTubeId(url);

  const startPolling = () => {
  if (pollTimerRef.current || duration <= 0) return;
  pollTimerRef.current = window.setInterval(() => {
    const p = playerRef.current;
    if (p && typeof p.getCurrentTime === "function" && duration > 0) {
      const t = p.getCurrentTime();
      const perc = Math.min(100, Math.round((t / duration) * 100));
      updateProgress(perc, perc >= COMPLETION_THRESHOLD);
    }
  }, POLL_INTERVAL_MS);
};

  const stopPolling = () => {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    const dur = playerRef.current.getDuration();
    setDuration(dur || 0);
    if (autoplay) playerRef.current.playVideo();
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    const state = event.data;
    if (state === 1) startPolling();
    else if (state === 2) stopPolling();
    else if (state === 0) {
      stopPolling();
      markAsCompleted();
    }
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  if (type === "text") {
    return (
      <div className="prose max-w-none">
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: content || "" }} />
      </div>
    );
  }

  if (!videoId) {
    return <div>URL de vídeo inválida</div>;
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho com animação e feedback visual */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <h3 className="font-semibold text-lg flex items-center gap-2">
          {completed ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <Circle className="text-gray-400" size={20} />
          )}
          {title}
        </h3>

        {!completed && (
          <button
            onClick={markAsCompleted}
            className="text-xs text-blue-500 hover:underline"
          >
            Marcar como concluído
          </button>
        )}
      </motion.div>

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="w-full flex justify-center"
>
  <div className="relative w-[1100px] h-[620px] max-w-full rounded-xl overflow-hidden shadow-2xl bg-black">
    <YouTube
      videoId={videoId}
      className="absolute top-0 left-0 w-full h-full"
      opts={{
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          modestbranding: 1,
          rel: 0,
        },
      }}
      onReady={onPlayerReady}
      onStateChange={onStateChange}
    />
  </div>
</motion.div>



      {/* Barra de progresso alinhada ao vídeo */}
      {/* <div className="flex flex-col gap-1">
        <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {Math.round(currentTime)}s / {Math.round(duration)}s
          </span>
          <span>Progresso: {progress}%</span>
        </div>
      </div> */}
    </div>
  );
}
