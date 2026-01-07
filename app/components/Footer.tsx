"use client";

import Image from "next/image";
import { FaGithub, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  const t = {
    ar: {
      ready: "جاهز لإطلاق مشروعك القادم؟",
      sub: "تواصل معي فوراً لنناقش التفاصيل.",
      rights: "جميع الحقوق محفوظة.",
      available: "متاح للعمل",
    },
    en: {
      ready: "?Ready to launch your next project",
      sub: "Contact me now to discuss details",
      rights: ".All rights reserved",
      available: "Available for work",
    },
  };

  const txt = t[lang];

  return (
    <footer className="relative bg-zinc-950 pt-16 pb-8 px-6 border-t border-zinc-900 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-zinc-800/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-4 tracking-tight">
            {txt.ready}
          </h2>
          <p className="text-zinc-400 text-lg mb-8">{txt.sub}</p>

          <a
            href="https://wa.me/+963938457732"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-xl shadow-white/5"
          >
            <FaWhatsapp className="text-2xl text-emerald-600" />
            <span>+963 938 457 732</span>
          </a>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="font-bold text-zinc-100 tracking-tighter">
                ABCE-S
              </span>
            </div>
            <div className="h-4 w-px bg-zinc-800"></div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-zinc-300 font-medium">
                {txt.available}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <SocialLink
              href="https://github.com"
              icon={<FaGithub />}
              label="Github"
            />
            <SocialLink
              href="mailto:satwrabbas@gmail.com"
              icon={<FaEnvelope />}
              label="Email"
            />
          </div>
        </div>

        <div className="mt-8 text-center md:text-right">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} ABCE-S. {txt.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
