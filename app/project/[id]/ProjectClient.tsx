"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../lib/supabase";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaGlobe,
} from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

const translations = {
  ar: {
    techStack: "التقنيات المستخدمة",
    liveDemo: "معاينة حية",
    viewCode: "الكود المصدري",
    goBack: "العودة",
    loading: "جاري تحميل تفاصيل المشروع...",
    notFound: "المشروع غير موجود.",
  },
  en: {
    techStack: "Technology Stack",
    liveDemo: "Live Demo",
    viewCode: "Source Code",
    goBack: "Back",
    loading: "Loading project details...",
    notFound: "Project not found.",
  },
};

export default function ProjectClient({ id }: { id: string }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { lang, setLang } = useLanguage();
  const router = useRouter();
  const supabase = createClient();
  const t = translations[lang];

  useEffect(() => {
    if (!id) return;

    async function fetchProject() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching project:", error);
        setProject(null);
      } else {
        setProject(data);
      }
      setLoading(false);
    }

    fetchProject();
  }, [id]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center z-50">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 md:w-20 md:h-20 border-4 border-blue-500/20 rounded-full"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2">
          <h2 className="text-lg md:text-xl font-bold text-white tracking-wider animate-pulse">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </h2>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <p>{t.notFound}</p>
        <button onClick={() => router.push("/")} className="ml-4 text-blue-400">
          {t.goBack}
        </button>
      </div>
    );
  }

  const title = lang === "ar" ? project.title_ar : project.title_en;
  const description =
    lang === "ar" ? project.description_ar : project.description_en;

  const hasMobileImage = !!project.image_mobile_url;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500 selection:text-white pb-12 md:pb-20">
      <header className="py-3 md:py-4 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm md:text-base"
          >
            <FaArrowLeft />
            <span>{t.goBack}</span>
          </button>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-2 px-3 py-1.5 md:px-3 md:py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs font-medium transition-all text-zinc-300"
          >
            <FaGlobe className="text-blue-400" />
            <span className="uppercase">{lang === "ar" ? "EN" : "عربي"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-16">
        <h1 className="text-3xl md:text-6xl font-bold text-center mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 leading-tight">
          {title}
        </h1>

        <div className="relative w-full mb-8 md:mb-12 bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/50 rounded-xl overflow-hidden">
          {hasMobileImage && (
            <div className="block md:hidden aspect-[9/16] relative">
              <Image
                src={project.image_mobile_url}
                alt={title}
                fill
                className="object-cover object-top"
                unoptimized={true}
                priority
              />
            </div>
          )}

          <div
            className={`${
              hasMobileImage ? "hidden md:block" : "block"
            } aspect-video relative`}
          >
            <Image
              src={project.image_url}
              alt={title}
              fill
              className="object-contain object-top"
              unoptimized={true}
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 border-b-2 border-blue-600 pb-2 inline-block">
                {t.techStack}
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.tags?.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 md:px-4 md:py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs md:text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-white text-sm md:text-base shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
                >
                  <FaExternalLinkAlt /> {t.liveDemo}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 md:py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold text-white text-sm md:text-base transition-all border border-zinc-700"
                >
                  <FaGithub /> {t.viewCode}
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
