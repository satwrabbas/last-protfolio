"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaGlobe } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

const translations = {
  ar: {
    navContact: "تواصل معي",
  },
  en: {
    navContact: "Contact",
  },
};

interface HeaderProps {
  onContactClick: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-900/90 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative w-9 h-9 md:w-12 md:h-12 bg-white/10 rounded-xl overflow-hidden">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="text-lg md:text-xl font-bold font-mono tracking-tighter text-zinc-100">
            ABCE-S
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs md:text-sm font-medium transition-all text-zinc-300"
          >
            <FaGlobe className="text-blue-400" />
            <span className="hidden sm:inline">
              {lang === "ar" ? "English" : "العربية"}
            </span>
            <span className="sm:hidden">{lang === "ar" ? "EN" : "عربي"}</span>
          </button>

          <button
            onClick={onContactClick}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full font-bold text-xs md:text-sm shadow-lg shadow-blue-600/20 transition-all"
          >
            {t.navContact}
          </button>
        </div>
      </div>
    </header>
  );
}
