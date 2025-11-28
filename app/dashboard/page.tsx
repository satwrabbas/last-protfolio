"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../components/AuthProvider";
import { supabase } from "../lib/supabase/client";

type Subject = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchSubjects = async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");
      if (data) setSubjects(data);
      setLoading(false);
    };

    fetchSubjects();
  }, [user, router]);

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("هل أنت متأكد؟ سيتم حذف المادة وكل الوحدات والدروس بداخلها!"))
      return;

    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (!error) {
      // تحديث القائمة محلياً لإخفاء العنصر المحذوف
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(error.message);
    }
  };

  if (loading)
    return (
      <div className="text-center p-10 text-white">جاري تحميل المنصة...</div>
    );
  return (
    <div className="min-h-screen bg-gray-900 p-2 md:p-8 text-white">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            لوحة القيادة
          </h1>
          <p className="text-gray-400 mt-1">مرحباً، مستكشف العلم!</p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/leaderboard"
            className="px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-600/50 rounded-lg hover:bg-yellow-600/30 transition-all flex items-center gap-2"
          >
            <span>🏆</span> المتصدرين
          </Link>
          <Link
            href="/profile"
            className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-600/50 rounded-lg hover:bg-indigo-600/30 transition-all flex items-center gap-2"
          >
            <span>👤</span> ملفي
          </Link>
        </div>
      </header>

      <main>
        <h2 className="text-xl font-bold mb-6 border-l-4 border-indigo-500 pl-3">
          المواد الدراسية
        </h2>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ... داخل الـ map ... */}
            {subjects.map((subject) => (
              // 1. الحاوية الرئيسية: تعطينا مرجعية للمكان (relative) وللتحويم (group)
              <div
                key={subject.id}
                className="relative group rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-indigo-500/20"
              >
                {/* 2. الرابط: يأخذ مساحة البطاقة كاملة */}
                <Link
                  href={`/units/${subject.id}`}
                  className="block bg-gray-800 p-2 md:p-6 border border-gray-700 h-full hover:border-indigo-500 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-200 group-hover:text-white">
                      {subject.name}
                    </h3>
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      📚
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1 md:mt-4 text-sm">
                    اضغط للدخول &larr;
                  </p>
                </Link>

                {/* 3. زر الحذف: مفصول عن الرابط، ويملك z-50 ليظهر فوق الجميع */}
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // منع الضغط على الرابط بالخطأ
                      handleDeleteSubject(subject.id);
                    }}
                    // لاحظ الكلاسات: absolute (عائم), z-50 (في المقدمة), top/left (المكان)
                    className="absolute top-3 left-3 z-50 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md transform hover:scale-110"
                    title="حذف المادة"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-gray-800 rounded-xl border border-dashed border-gray-700">
            <p className="text-gray-400">لا توجد مواد مضافة بعد.</p>
          </div>
        )}
      </main>
    </div>
  );
}
