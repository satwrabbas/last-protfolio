// app/profile/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile } from '@/app/components/AuthProvider';
import { supabase } from '@/app/lib/supabase/client';
import { useAuth } from '@/app/components/AuthProvider';

type Achievement = {
  id: string;
  title: string;
  description: string;
};

export default function ProfilePage() {
  const { user, globalLevel, globalXp, subjectsProgress } = useAuth(); // استخدام البيانات الجديدة
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const { data: achievementsData } = await supabase.from('achievements').select('*');
      const { data: myAchievements } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id);

      if (achievementsData) setAllAchievements(achievementsData);
      if (myAchievements) setUnlockedIds(myAchievements.map(item => item.achievement_id));
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center p-10 text-white">جاري تحميل الملف الشخصي...</div>;

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white pb-20">
      
      {/* بطاقة الشخصية الرئيسية */}
      <header className="max-w-4xl mx-auto mb-12 bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 z-10 relative">
          {/* دائرة المستوى الكبير */}
          <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
             <div className="text-center">
                <div className="text-xs text-indigo-300 font-bold tracking-widest uppercase">Level</div>
                <div className="text-5xl font-black text-white">{globalLevel}</div>
             </div>
          </div>

          <div className="flex-1 text-center md:text-right space-y-2">
            <h1 className="text-3xl font-bold text-white">الملف الشخصي</h1>
            <p className="text-indigo-200">{user?.email}</p>
            <div className="bg-gray-950/50 p-4 rounded-lg border border-gray-700 mt-4 inline-block w-full">
              <div className="flex justify-between text-sm mb-2 text-gray-400">
                <span>إجمالي الخبرة المكتسبة</span>
                <span className="text-white font-mono">{globalXp} XP</span>
              </div>
              <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-12">
        
        {/* قسم المهارات (المواد) */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
            <span className="text-2xl">⚡</span> القدرات العلمية (Skills)
          </h2>
          
          {subjectsProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {subjectsProgress.map((subject) => {
                // حساب نسبة التقدم للمستوى التالي لهذه المادة
                const nextLvl = Math.pow(subject.level * 5, 2);
                const percent = Math.min(100, (subject.xp / nextLvl) * 100);

                return (
                  <div key={subject.id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-900/10 group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-100 group-hover:text-indigo-400 transition-colors">{subject.name}</h3>
                      <div className="bg-gray-800 px-3 py-1 rounded-md border border-gray-700">
                        <span className="text-xs text-gray-500 uppercase mr-1">LVL</span>
                        <span className="font-bold text-indigo-400">{subject.level}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{subject.xp} XP</span>
                        <span>{nextLvl} XP</span>
                      </div>
                      <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors" 
                          style={{ width: `${percent}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-dashed border-gray-700 text-gray-500">
              لم تبدأ في دراسة أي مادة بعد. أكمل الدروس لرفع مستوياتك!
            </div>
          )}
        </section>

        {/* قسم الإنجازات (Achievements) */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
            <span className="text-2xl">🏆</span> الأوسمة والإنجازات
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAchievements.map((achievement) => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              return (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                    isUnlocked 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-600/50 shadow-lg shadow-yellow-900/10' 
                      : 'bg-gray-900 border-gray-800 opacity-60'
                  }`}
                >
                  {isUnlocked && <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full -mr-8 -mt-8"></div>}
                  
                  <div className="flex justify-between items-start relative z-10">
                    <h3 className={`font-bold ${isUnlocked ? 'text-yellow-500' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    {isUnlocked ? <span className="text-xl">🥇</span> : <span className="text-xl grayscale opacity-30">🔒</span>}
                  </div>
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}