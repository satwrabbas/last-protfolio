import { createClient } from "../../utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaRulerCombined,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import ImageGallery from "../../components/ImageGallery";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  images_gallery: string[] | null;
  location: string;
  completion_date: string;
  area?: string;
}

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  const galleryImages = project.images_gallery || [];

  return (
    <main className="min-h-screen bg-slate-950" id="portfolio">
      <Navbar />

      <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
          src={project.image_url}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/30"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 md:p-16 max-w-7xl mx-auto">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-yellow-500 mb-4 md:mb-6 transition text-sm md:text-base"
          >
            <FaArrowRight />
            <span>العودة للمعرض</span>
          </Link>

          <h1 className="text-3xl md:text-6xl font-bold text-white mb-3 md:mb-4 shadow-black drop-shadow-lg leading-tight">
            {project.title}
          </h1>

          <div className="flex items-center gap-2 text-yellow-500 font-bold tracking-wider text-sm md:text-base">
            <FaTag className="text-sm md:text-base" />
            <span>{project.category}</span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 border-r-4 border-yellow-500 pr-3 md:pr-4">
                تفاصيل المشروع
              </h2>

              <p className="text-slate-300 text-base md:text-lg leading-loose whitespace-pre-line text-justify">
                {project.description || "لا يوجد وصف متاح لهذا المشروع حالياً."}
              </p>
            </div>

            <div className="mt-8 md:mt-12">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
                صور من الموقع
              </h3>

              {galleryImages.length > 0 ? (
                <ImageGallery images={galleryImages} title={project.title} />
              ) : (
                <div className="p-6 md:p-8 bg-slate-900 border border-white/5 rounded-xl text-center text-slate-500 text-sm md:text-base">
                  جاري رفع المزيد من الصور لهذا المشروع قريباً...
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 md:p-8 sticky top-24 backdrop-blur-sm">
              <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">
                بيانات المشروع
              </h3>

              <ul className="space-y-5 md:space-y-6">
                <li className="flex items-start gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 bg-blue-600/10 text-blue-500 rounded-lg shrink-0">
                    <FaMapMarkerAlt className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <span className="block text-xs md:text-sm text-slate-500 mb-1">
                      الموقع
                    </span>
                    <span className="text-white font-medium text-sm md:text-base">
                      {project.location || "مصياف"}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 bg-yellow-500/10 text-yellow-500 rounded-lg shrink-0">
                    <FaCalendarAlt className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <span className="block text-xs md:text-sm text-slate-500 mb-1">
                      تاريخ التسليم
                    </span>
                    <span className="text-white font-medium text-sm md:text-base">
                      {project.completion_date || "قيد التنفيذ"}
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 bg-green-500/10 text-green-500 rounded-lg shrink-0">
                    <FaRulerCombined className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <span className="block text-xs md:text-sm text-slate-500 mb-1">
                      المساحة التقريبية
                    </span>
                    <span className="text-white font-medium text-sm md:text-base">
                      {project.area || "غير محدد"}
                    </span>
                  </div>
                </li>
              </ul>

              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10">
                <p className="text-slate-400 text-xs md:text-sm mb-3 md:mb-4">
                  هل أعجبك هذا النمط؟
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold rounded-lg transition text-sm md:text-base"
                >
                  اطلب تصميم مماثل
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
