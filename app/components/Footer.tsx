"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-10 pb-6 md:pt-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src="/logo-white.png"
                  alt="Our Home Logo"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white">
                Our Home
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              مكتب هندسي رائد في مصياف، يجمع بين الخبرة الأكاديمية والتنفيذ
              المتقن. نسعى لبناء مستقبل عمراني أفضل لمدينتنا.
            </p>

            <div className="flex gap-3 md:gap-4 pt-2">
              <a
                href="https://www.facebook.com/Our.Home.masyaf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-blue-600 transition text-sm md:text-base"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/our_home_2012/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-pink-600 transition text-sm md:text-base"
              >
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/963994022889"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-green-500 transition text-sm md:text-base"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6 border-r-4 border-yellow-500 pr-3">
              روابط سريعة
            </h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
              <li>
                <Link
                  href="/#about"
                  className="text-slate-400 hover:text-yellow-500 transition block py-1"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="text-slate-400 hover:text-yellow-500 transition block py-1"
                >
                  خدماتنا
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-slate-400 hover:text-yellow-500 transition block py-1"
                >
                  معرض الأعمال
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6 border-r-4 border-yellow-500 pr-3">
              مجالات العمل
            </h3>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
              <li className="text-slate-400 hover:text-white transition cursor-default py-1">
                التصميم المعماري
              </li>
              <li className="text-slate-400 hover:text-white transition cursor-default py-1">
                الدراسات الإنشائية
              </li>
              <li className="text-slate-400 hover:text-white transition cursor-default py-1">
                الإكساء والديكور
              </li>
              <li className="text-slate-400 hover:text-white transition cursor-default py-1">
                تعهدات البناء
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6 border-r-4 border-yellow-500 pr-3">
              تواصل معنا
            </h3>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              <li className="flex items-start gap-3 text-slate-400">
                <FaMapMarkerAlt className="text-yellow-500 mt-1 shrink-0" />
                <span>سوريا، مصياف، شمال الكازية الشمالية 150 متر</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <FaPhoneAlt className="text-yellow-500 shrink-0" />
                <span dir="ltr" className="hover:text-white transition">
                  +963 994 022 889
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <FaEnvelope className="text-yellow-500 shrink-0" />
                <span className="break-all">info@abce-s.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-right gap-4 md:gap-0">
          <p className="text-slate-500 text-xs md:text-sm">
            © {new Date().getFullYear()} Our Home Engineering. جميع الحقوق
            محفوظة.
          </p>
          <p className="text-slate-600 text-xs md:text-sm">
            تم التصميم والتطوير بواسطة{" "}
            <span className="text-slate-400 font-medium">abce</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
