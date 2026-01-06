/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "./lib/supabase";
import ProjectCard from "./components/ProjectCard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { FaRocket } from "react-icons/fa";
import { useLanguage } from "./context/LanguageContext";

const BG_IMAGE =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop";

const translations = {
  ar: {
    navHome: "الرئيسية",
    navWork: "أعمالي",
    badge: "🔥 متاح لمشروعين جديدين فقط هذا الشهر",
    titleStart: "أحول أفكارك إلى",
    titleHighlight: "واقع رقمي",
    titleEnd: "مربح",
    subtitle:
      "مطور برمجيات شامل (Full Stack). أبني تطبيقات جوال ومواقع ويب بجودة عالمية تساعد نشاطك التجاري على النمو.",
    ctaMain: "اطلب مشروعك الآن",
    ctaSecondary: "شاهد أعمالي",
    latestWork: "أحدث الأعمال",
    workSub: "مشاريع تم تنفيذها بعناية وجودة عالية",
    loading: "جاري تحميل المشاريع...",
  },
  en: {
    navHome: "Home",
    navWork: "Portfolio",
    badge: "🔥 Available for only 2 new projects this month",
    titleStart: "Turning Ideas into",
    titleHighlight: "Profitable",
    titleEnd: "Digital Reality",
    subtitle:
      "Full Stack Developer. I build high-quality mobile apps and websites that help your business grow.",
    ctaMain: "Hire Me Now",
    ctaSecondary: "View Portfolio",
    latestWork: "Latest Work",
    workSub: "Projects crafted with precision and quality",
    loading: "Loading Projects...",
  },
};

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const { lang } = useLanguage();
  const t = translations[lang];
  const supabase = createClient();

  useEffect(() => {
    document.body.style.overflowX = "hidden";
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      console.log("جاري طلب البيانات...");

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("خطأ في جلب البيانات:", error.message);
      } else {
        console.log("البيانات المستلمة:", data);
        if (data) setProjects(data);
      }
    }
    fetchProjects();
  }, []);

  const handleHireMe = async () => {
    const Swal = (await import("sweetalert2")).default;
    const isAr = lang === "ar";
    Swal.fire({
      title: isAr ? "لنبدأ العمل معاً!" : "Let's Work Together!",
      text: isAr ? "تواصل معي مباشرة عبر واتساب" : "Contact me via WhatsApp",
      icon: "success",
      background: "#18181b",
      color: "#fff",
      confirmButtonText: "WhatsApp",
      confirmButtonColor: "#22c55e",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) window.open("https://wa.me/+963938457732", "_blank");
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      <Header onContactClick={handleHireMe} />

      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 pt-16 md:pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={BG_IMAGE}
            alt="Background"
            fill
            className="object-cover opacity-500 select-none"
            priority
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs md:text-sm mb-6 md:mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-blue-500"></span>
            </span>
            {t.badge}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            {t.titleStart} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {t.titleHighlight}
            </span>{" "}
            {t.titleEnd}
          </h1>

          <p className="text-zinc-400 text-sm md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0">
            <button
              onClick={handleHireMe}
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white text-zinc-950 hover:bg-blue-50 rounded-xl font-bold text-base md:text-lg shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <FaRocket className="text-blue-600" /> {t.ctaMain}
            </button>
            <a
              href="#portfolio"
              className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-zinc-800/50 hover:bg-zinc-800 backdrop-blur-sm border border-zinc-700 rounded-xl font-bold text-base md:text-lg text-white transition-all text-center"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <section
        id="portfolio"
        className="py-12 md:py-24 bg-zinc-900/50 px-4 md:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4 border-b border-zinc-800 pb-6 md:pb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {t.latestWork}
              </h2>
              <p className="text-sm md:text-base text-zinc-400">{t.workSub}</p>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20 text-zinc-500 bg-zinc-900 rounded-2xl border border-dashed border-zinc-800">
              {t.loading}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
