import Image from "next/image";
import {
  FaRulerCombined,
  FaHandshake,
  FaLightbulb,
  FaUserTie,
} from "react-icons/fa";

export default function AboutSection() {
  const features = [
    {
      icon: <FaRulerCombined />,
      title: "دقة هندسية",
      desc: "تصاميم تراعي أدق التفاصيل وتستغل كل سنتيمتر.",
    },
    {
      icon: <FaHandshake />,
      title: "شفافية مطلقة",
      desc: "عقود واضحة، جداول زمنية دقيقة، وتقارير دورية.",
    },
    {
      icon: <FaLightbulb />,
      title: "حلول إبداعية",
      desc: "أفكار إكساء عصرية تناسب ميزانيتك وتواكب الموضة.",
    },
    {
      icon: <FaUserTie />,
      title: "إشراف مباشر",
      desc: "مهندسون مختصون في الموقع لضمان الجودة.",
    },
  ];

  return (
    <section
      id="about"
      className="py-12 md:py-20 bg-slate-950 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div>
              <h4 className="text-yellow-500 font-bold tracking-wider uppercase mb-2 text-sm md:text-base">
                من نحن
              </h4>
              <h2 className="text-2xl md:text-5xl font-bold text-white leading-tight">
                أكثر من مجرد مكتب هندسي.. <br />
                <span className="text-blue-500">نحن شركاء طموحك</span>
              </h2>
            </div>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed text-justify">
              من قلب مدينة مصياف، انطلق مكتب{" "}
              <span className="text-white font-bold">Our Home</span> برؤية تهدف
              للارتقاء بالواقع العمراني. ندرك أن البناء في مناطقنا يتطلب فهماً
              خاصاً لطبيعة الأرض والمناخ، ولذوق المجتمع المحلي.
            </p>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed text-justify">
              تخصصنا لا يقتصر على صب الخرسانة؛ بل يمتد ليشمل{" "}
              <span className="text-yellow-500">فنون الإكساء الداخلي</span>، حيث
              نحول المساحات الصامتة إلى منازل تنبض بالحياة، مع الالتزام الصارم
              بالميزانية.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-yellow-500/30 transition duration-300 group"
                >
                  <div className="text-yellow-500 text-xl md:text-2xl mt-1 group-hover:scale-110 transition shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-1 text-sm md:text-base">
                      {item.title}
                    </h5>
                    <p className="text-slate-500 text-xs md:text-sm leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop"
                alt="مهندسون في الموقع"
                className="w-full h-full object-cover hover:scale-105 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

              <div className="absolute bottom-6 right-6 left-6">
                <p className="text-white font-bold text-base md:text-xl leading-relaxed">
                  &quot;الجودة ليست صدفة، بل هي نتيجة نية عالية وجهد صادق.&quot;
                </p>
                <p className="text-yellow-500 mt-2 text-xs md:text-sm font-semibold">
                  - إدارة المكتب
                </p>
              </div>
            </div>

            <div className="absolute -bottom-4 left-4 md:-bottom-10 md:-left-10 z-20 bg-slate-800 p-4 md:p-6 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 md:gap-4 max-w-[200px] md:max-w-none">
              <div className="text-3xl md:text-5xl font-bold text-blue-500">
                15+
              </div>
              <div className="text-slate-300 text-xs md:text-sm font-medium leading-snug">
                مشروع سكني
                <br />
                تم تسليمه
              </div>
            </div>

            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 z-0 opacity-20">
              <svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 md:w-24 md:h-24"
              >
                <pattern
                  id="dot-pattern"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="2"
                    cy="2"
                    r="2"
                    className="text-white"
                    fill="currentColor"
                  />
                </pattern>
                <rect width="100" height="100" fill="url(#dot-pattern)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
