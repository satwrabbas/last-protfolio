"use client";

import Image from "next/image";
import { FaGithub, FaRocket, FaEnvelope } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="relative bg-zinc-950 pt-12 md:pt-20 pb-8 md:pb-10 overflow-hidden border-t border-zinc-900">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] h-[200px] md:h-[300px] bg-blue-600/10 blur-[80px] md:blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-0.5 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="object-contain w-8 h-8 md:w-10 md:h-10"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  ABCE-S
                </h2>
                <p className="text-[10px] md:text-xs text-blue-400 font-mono">
                  CODE & DESIGN
                </p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm mb-6">
              {lang === "ar"
                ? "نبتكر حلولاً رقمية ذكية تساعد الشركات الناشئة ورواد الأعمال على تحويل أفكارهم إلى منتجات ناجحة ومربحة."
                : "We craft smart digital solutions helping startups and entrepreneurs turn their ideas into successful, profitable products."}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-900 border border-zinc-800 rounded-full">
              <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs md:text-sm font-medium text-emerald-400">
                {lang === "ar"
                  ? "متاح لاستلام مشاريع الآن"
                  : "Available for work"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 md:mb-6">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  {lang === "ar" ? "الرئيسية" : "Home"}
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  {lang === "ar" ? "أعمالي" : "Portfolio"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  {lang === "ar" ? "خدماتي" : "Services"}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-blue-400 transition-colors"
                >
                  {lang === "ar" ? "عن المطور" : "About"}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 md:mb-6">
              {lang === "ar" ? "تواصل معي" : "Connect"}
            </h3>
            <div className="flex flex-col gap-3 md:gap-4 text-sm md:text-base">
              <a
                href="https://github.com"
                target="_blank"
                className="flex items-center gap-3 text-zinc-400 hover:text-white group transition-colors"
              >
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-white/30 transition-all">
                  <FaGithub />
                </span>
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                className="flex items-center gap-3 text-zinc-400 hover:text-blue-400 group transition-colors"
              >
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-blue-400/30 transition-all">
                  <FaRocket />
                </span>
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:contact@abce-s.com"
                className="flex items-center gap-3 text-zinc-400 hover:text-orange-400 group transition-colors"
              >
                <span className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-orange-400/30 transition-all">
                  <FaEnvelope />
                </span>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs md:text-sm">
            © {new Date().getFullYear()} ABCE-S.{" "}
            {lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">
              {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              {lang === "ar" ? "شروط الاستخدام" : "Terms of Service"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
