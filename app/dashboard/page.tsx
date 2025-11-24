"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase/client';

type Subject = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchSubjects = async () => {
      const { data, error } = await supabase.from('subjects').select('*').order('name');
      if (data) setSubjects(data);
      setLoading(false);
    };

    fetchSubjects();
  }, [user, router]);

  if (loading) return <div className="text-center p-10 text-white">جاري تحميل المنصة...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            لوحة القيادة
          </h1>
          <p className="text-gray-400 mt-1">مرحباً، مستكشف العلم!</p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/leaderboard" className="px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-600/50 rounded-lg hover:bg-yellow-600/30 transition-all flex items-center gap-2">
            <span>🏆</span> المتصدرين
          </Link>
          <Link href="/profile" className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-600/50 rounded-lg hover:bg-indigo-600/30 transition-all flex items-center gap-2">
            <span>👤</span> ملفي
          </Link>
        </div>
      </header>
      
      <main>
        <h2 className="text-xl font-bold mb-6 border-l-4 border-indigo-500 pl-3">المواد الدراسية</h2>
        
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Link 
                key={subject.id} 
                href={`/units/${subject.id}`} // رابط لصفحة المادة
                className="group bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-900/20 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-200 group-hover:text-white">{subject.name}</h3>
                  <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
                </div>
                <p className="text-gray-500 mt-4 text-sm group-hover:text-indigo-300 transition-colors">
                  اضغط للدخول إلى الوحدات والدروس &larr;
                </p>
              </Link>
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