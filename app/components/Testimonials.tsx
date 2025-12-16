import { createClient } from "../utils/supabase/server";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import Image from "next/image";

export default async function Testimonials() {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="py-12 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-white/10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl translate-x-[-50%] translate-y-[-50%] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 w-96 h-1 bg-blue-500/20 blur-xl -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-yellow-500 font-bold tracking-wider uppercase mb-2 text-sm md:text-base">
            قالوا عنا
          </h2>
          <h3 className="text-2xl md:text-5xl font-bold text-white leading-tight">
            شركاء النجاح{" "}
            <span className="text-slate-500 block md:inline">
              وشهادات نعتز بها
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="relative bg-slate-900/50 p-6 md:p-8 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition duration-300 group"
            >
              <div className="absolute top-4 left-4 md:top-6 md:left-6 text-slate-700 text-2xl md:text-4xl opacity-50 group-hover:text-yellow-500/20 transition-colors">
                <FaQuoteRight />
              </div>

              <div className="flex gap-1 mb-4 md:mb-6 text-yellow-500 text-sm md:text-base">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed relative z-10 min-h-0 md:min-h-[80px]">
                &quot;{review.content}&quot;
              </p>

              <div className="flex items-center gap-3 md:gap-4 border-t border-white/5 pt-4 md:pt-0 md:border-none">
                {review.image_url ? (
                  <img
                    src={review.image_url}
                    alt={review.client_name}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-blue-500/20 shadow-lg shadow-blue-900/20 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-blue-500 to-blue-800 flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg shadow-blue-900/20 shrink-0">
                    {review.client_name.charAt(0)}
                  </div>
                )}

                <div>
                  <h4 className="text-white font-bold text-sm md:text-base">
                    {review.client_name}
                  </h4>
                  <span className="text-xs text-slate-500">{review.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
