import { createClient } from "../utils/supabase/server";
import Link from "next/link";
import {
  FaArrowDown,
  FaCheckCircle,
  FaProjectDiagram,
  FaHardHat,
} from "react-icons/fa";
import { FaFileDownload, FaStar } from "react-icons/fa";
import Image from "next/image";

export default async function Hero() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .limit(3)
    .order("created_at", { ascending: false });
  return (
    <div id="home">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />

        <div className="relative z-20 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
            نبني رؤيتك.. حجراً تلو الآخر
          </h1>
          <p className="text-xl text-text-muted mb-8 leading-relaxed">
            مكتب هندسي متكامل في مصياف. ندمج بين عراقة البناء وحداثة التصميم
            لنقدم لك مساحات سكنية وتجارية استثنائية.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-full font-bold transition"
            >
              احجز استشارة
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-3 border border-white/20 hover:bg-white/10 rounded-full font-bold transition backdrop-blur-sm"
            >
              شاهد أعمالنا
            </Link>
          </div>
        </div>
      </section>

      <section className="md:py-20 py-10 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="md:text-3xl text-xl font-bold border-r-4 border-accent pr-4">
              آخر مشاريعنا
            </h2>
            <Link
              href="/portfolio"
              className="text-primary hover:text-accent transition"
            >
              عرض الكل &larr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="group relative aspect-4/3 overflow-hidden rounded-xl bg-gray-900"
              >
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <span className="text-accent text-sm font-medium">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-slate-950/70 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs md:text-sm text-gray-200 font-medium">
              متاحون لاستلام مشاريع جديدة في مصياف وريفها
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            نحول الخيال إلى{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-yellow-600">
              واقع معماري
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            مكتب هندسي متكامل في مصياف. نقدم خدمات التصميم المعماري، الإكساء
            الداخلي، والحلول العقارية بأعلى معايير الجودة والاحترافية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-8">
            <a
              href="/company-profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-8 py-4 bg-linear-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-slate-900 font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] flex items-center justify-center gap-3"
            >
              <span>تحميل بروفايل الشركة</span>

              <FaFileDownload className="text-lg transition-transform group-hover:scale-110" />
            </a>

            <Link
              href="/#testimonials"
              className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-yellow-500/50 text-white font-bold rounded-xl backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3"
            >
              <FaStar className="text-yellow-500 group-hover:text-yellow-400 transition-colors" />
              <span>ماذا يقول عملاؤنا؟</span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-slate-900/80 backdrop-blur-md border-t border-r border-l border-white/10 rounded-t-2xl p-6 md:p-8 flex justify-around items-center text-white shadow-2xl">
              <div className="flex items-center gap-4 group cursor-default">
                <div className="p-3 rounded-full bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <FaProjectDiagram size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">+50</span>
                  <span className="text-sm text-gray-400">مشروع منجز</span>
                </div>
              </div>

              <div className="w-px h-12 bg-white/10"></div>

              <div className="flex items-center gap-4 group cursor-default">
                <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors duration-300">
                  <FaHardHat size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">+10</span>
                  <span className="text-sm text-gray-400">سنوات خبرة</span>
                </div>
              </div>

              <div className="w-px h-12 bg-white/10"></div>

              <div className="flex items-center gap-4 group cursor-default">
                <div className="p-3 rounded-full bg-green-500/20 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <FaCheckCircle size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">100%</span>
                  <span className="text-sm text-gray-400">
                    التزام بالمواعيد
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 md:bottom-32 animate-bounce z-10 text-white/50">
          <FaArrowDown size={24} />
        </div>
      </section>
    </div>
  );
}
