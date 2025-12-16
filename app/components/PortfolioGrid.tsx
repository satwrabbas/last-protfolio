"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaFilter } from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  category: string;
  image_url: string;
  location: string;
}

interface PortfolioGridProps {
  projects: Project[];
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = [
    "الكل",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filteredProjects =
    activeCategory === "الكل"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
              activeCategory === category
                ? "bg-yellow-500 text-slate-900 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105"
                : "bg-transparent text-slate-400 border-white/10 hover:border-yellow-500 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <Link
            href={`/portfolio/${project.id}`}
            key={project.id}
            className="group relative block aspect-4/5 rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl hover:border-yellow-500/50 transition-all duration-500"
          >
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs font-bold bg-slate-950/50 backdrop-blur-md text-white border border-white/10 rounded-full">
                {project.category}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">
                {project.title}
              </h3>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span>{project.location || "مصياف"}</span>
                </div>
                <span className="text-xs text-white bg-blue-600 px-3 py-1 rounded-full">
                  عرض التفاصيل
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-xl">
          <FaFilter className="mx-auto text-4xl mb-4 opacity-50" />
          <p>لا توجد مشاريع ضمن هذا التصنيف حالياً.</p>
        </div>
      )}
    </div>
  );
}
