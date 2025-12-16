"use client";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createBrowserClient } from "@supabase/ssr";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("inquiries").insert(data);

    setLoading(false);

    if (error) {
      alert("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.");
      console.error(error);
    } else {
      setSuccess(true);
      e.currentTarget.reset();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="pt-24 pb-8 md:pt-32 md:pb-12 bg-slate-900 text-center px-4 border-b border-white/5">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
          تواصل معنا
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          نحن هنا للإجابة على استفساراتك الهندسية. سواء كان لديك مشروع جديد أو
          تحتاج لاستشارة، لا تتردد بالاتصال.
        </p>
      </div>

      <section className="grow py-8 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <h2 className="text-xl md:text-2xl font-bold text-white border-r-4 border-yellow-500 pr-3 md:pr-4">
              بيانات التواصل
            </h2>

            <div className="grid gap-4 md:gap-6">
              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-900 rounded-xl border border-white/5 hover:border-yellow-500/30 transition group">
                <div className="bg-blue-600/20 p-2.5 md:p-3 rounded-full text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                  <FaPhoneAlt className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 text-base">
                    اتصل بنا
                  </h3>
                  <div className="flex flex-col text-slate-400 dir-ltr text-right text-sm md:text-base">
                    <span>+963 944 809 750</span>
                    <span>+963 994 022 889</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-900 rounded-xl border border-white/5 hover:border-yellow-500/30 transition group">
                <div className="bg-pink-600/20 p-2.5 md:p-3 rounded-full text-pink-500 group-hover:bg-pink-600 group-hover:text-white transition shrink-0">
                  <FaEnvelope className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 text-base">
                    البريد الإلكتروني
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base break-all">
                    info@abce-s.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-900 rounded-xl border border-white/5 hover:border-yellow-500/30 transition group">
                <div className="bg-yellow-600/20 p-2.5 md:p-3 rounded-full text-yellow-500 group-hover:bg-yellow-600 group-hover:text-white transition shrink-0">
                  <FaMapMarkerAlt className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 text-base">
                    زيارتنا
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    سوريا، مصياف، شمال الكازية الشمالية ب 150 متر
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-900 rounded-xl border border-white/5 hover:border-yellow-500/30 transition group">
                <div className="bg-green-600/20 p-2.5 md:p-3 rounded-full text-green-500 group-hover:bg-green-600 group-hover:text-white transition shrink-0">
                  <FaClock className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1 text-base">
                    أوقات العمل
                  </h3>
                  <p className="text-slate-400 text-sm md:text-base">
                    السبت - الخميس: 9:00 ص - 5:00 م
                  </p>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">
                    الجمعة: عطلة رسمية
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            <div className="bg-slate-900 p-5 md:p-8 rounded-2xl border border-white/10 shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                أرسل رسالة فورية
              </h2>

              {success ? (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-6 rounded-xl text-center animate-pulse">
                  <h3 className="font-bold text-lg md:text-xl mb-2">
                    تم الإرسال بنجاح!
                  </h3>
                  <p className="text-sm md:text-base">
                    شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت ممكن.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-sm underline"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-400 mb-1.5 md:mb-2"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-base text-white focus:outline-none focus:border-yellow-500 transition placeholder-slate-600"
                      placeholder="محمد العلي"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-slate-400 mb-1.5 md:mb-2"
                    >
                      رقم الهاتف (واتساب)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-base text-white focus:outline-none focus:border-yellow-500 transition placeholder-slate-600"
                      placeholder="09xxxxxxxx"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-400 mb-1.5 md:mb-2"
                    >
                      تفاصيل الاستفسار
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-base text-white focus:outline-none focus:border-yellow-500 transition resize-none placeholder-slate-600"
                      placeholder="أرغب بالاستفسار عن..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 md:py-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg"
                  >
                    {loading ? (
                      <span>جاري الإرسال...</span>
                    ) : (
                      <>
                        <span>إرسال الرسالة</span>
                        <FaPaperPlane className="text-base" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 h-[300px] md:h-[450px] shadow-lg relative z-0">
              <iframe
                title="موقع المكتب"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4285.4664205964045!2d36.33783050962611!3d35.07056459461836!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15239361bdb9122d%3A0x194d6fc3d2c60ff6!2sOur%20Home!5e1!3m2!1sen!2sus!4v1765527215020!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="brightness-[0.8] hover:brightness-100 transition duration-500"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 text-center border-t border-white/5 bg-slate-900/30">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-slate-700 hover:text-yellow-500 transition-colors duration-300 text-xs md:text-sm opacity-60 hover:opacity-100"
          title="دخول الإدارة فقط"
        >
          <FaLock size={10} className="md:w-3 md:h-3" />
          <span>الدخول للإدارة</span>
        </Link>
      </div>

      <Footer />
    </main>
  );
}
