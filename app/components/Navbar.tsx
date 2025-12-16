/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const handleScrollSpy = () => {
      const sections = ["home", "about", "services"];

      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);

    handleScrollSpy();

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const navLinks = [
    { name: "الرئيسية", href: "/#home" },
    { name: "عن المكتب", href: "/#about" },
    { name: "خدماتنا", href: "/#services" },
    { name: "معرض الأعمال", href: "/portfolio" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-md border-white/10 shadow-lg"
          : "bg-transparent border-transparent py-4 md:py-5"
      }`}
      id="home"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-4 group">
            <div className="relative w-12 md:w-16 h-auto transition-all duration-300">
              <Image
                src="/logo-white.png"
                alt="Our Home Logo"
                width={300}
                height={160}
                className="object-contain w-full rounded-2xl h-auto group-hover:scale-105 transition duration-300"
                priority
              />
            </div>

            <div className="h-10 w-[1px] bg-gray-600 hidden md:block"></div>

            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold text-white tracking-wide transition-all">
                Our Home
              </span>
              <span className="text-[10px] md:text-xs text-gray-400 font-light tracking-wider whitespace-nowrap">
                للهندسة والمقاولات
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              let isActive = false;

              if (link.href.includes("#")) {
                const sectionId = link.href.split("#")[1];

                isActive = pathname === "/" && activeSection === sectionId;
              } else {
                isActive = pathname === link.href;
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-yellow-500"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]"
            >
              <FaPhoneFlip size={14} />
              <span>استشارة مجانية</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none p-2 rounded-md hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-white/10 shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2 flex flex-col items-center">
          {navLinks.map((link) => {
            let isActive = false;
            if (link.href.includes("#")) {
              const sectionId = link.href.split("#")[1];
              isActive = pathname === "/" && activeSection === sectionId;
            } else {
              isActive = pathname === link.href;
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`w-full text-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-yellow-500 bg-white/5"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="w-full pt-2">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center gap-2 w-full bg-blue-600 active:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold shadow-md mt-1"
            >
              <FaPhoneFlip size={12} />
              <span>اتصل بنا الآن</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
