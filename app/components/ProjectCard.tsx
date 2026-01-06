import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

interface ProjectProps {
  project: {
    id: number;
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
    image_url: string;
    image_mobile_url?: string;
    tags: string[];
    demo_url?: string;
    github_url?: string;
  };
  lang: "ar" | "en";
}

export default function ProjectCard({ project, lang }: ProjectProps) {
  const isAr = lang === "ar";

  const title = isAr
    ? project.title_ar || project.title_en
    : project.title_en || project.title_ar;
  const description = isAr
    ? project.description_ar || project.description_en
    : project.description_en || project.description_ar;

  const hasMobileImage = !!project.image_mobile_url;

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-xl md:rounded-2xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 flex flex-col">
      
      {/* 
         التعديل الأول:
         جعلنا z-10 بدلاً من z-0
         هذا يجعل الرابط الشفاف "يطفو" فوق الصور والنصوص
      */}
      <Link
        href={`/project/${project.id}`}
        className="absolute inset-0 z-10"
        aria-label={title}
      />

      {/* منطقة الصور */}
      <div className="relative w-full border-b border-zinc-800 bg-zinc-950">
        {hasMobileImage && (
          <div className="block md:hidden aspect-[9/16] relative">
            <Image
              src={project.image_mobile_url!}
              alt={title}
              fill
              className="object-cover object-top"
              unoptimized={true}
            />
          </div>
        )}

        <div
          className={`${
            hasMobileImage ? "hidden md:block" : "block"
          } aspect-video relative`}
        >
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={title}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              unoptimized={true}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-600">
              No Preview
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
      </div>

      {/* المحتوى النصي */}
      {/* pointer-events-none مهمة جداً هنا لتمرير النقرة للرابط الخلفي */}
      <div className="p-4 md:p-6 relative pointer-events-none flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-bold text-zinc-100 mb-1 md:mb-2 group-hover:text-white transition-colors truncate">
          {title}
        </h3>

        <p className="text-zinc-400 text-sm mb-3 md:mb-5 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6 mt-auto">
          {project.tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 md:px-2.5 md:py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] md:text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 
            التعديل الثاني:
            جعلنا z-20 بدلاً من z-10
            لكي تكون الأزرار فوق الرابط الشفاف (الذي أصبح z-10) فتستجيب للنقر
        */}
        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-zinc-800 relative z-20 pointer-events-auto">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] md:text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {isAr ? "معاينة" : "Demo"}
            </a>
          )}

          <div className="flex gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaGithub className="text-base md:text-lg" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}