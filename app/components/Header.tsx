// app/components/Header.tsx

"use client";

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Header() {
  const { user, globalXp, globalLevel ,profile} = useAuth();

  if (!user) return null;

  // حساب نسبة التقدم للمستوى التالي
  // المعادلة: كل مستوى يحتاج (المستوى * 5)^2 من النقاط
  const nextLevelXp = Math.pow((globalLevel) * 5, 2); 
  const currentLevelBaseXp = Math.pow((globalLevel - 1) * 5, 2); 
  
  // حساب النسبة المئوية للشريط
  const totalRange = nextLevelXp - currentLevelBaseXp;
  const currentProgress = globalXp - currentLevelBaseXp;
  const progressPercent = Math.min(100, Math.max(0, (currentProgress / totalRange) * 100));

  return (
    <header className="bg-gray-800 border-b border-gray-700 text-white p-3 sticky top-0 z-50 shadow-lg bg-opacity-95 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* الشعار */}
        <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 hover:opacity-80 transition-opacity">
          🚀 منصة الفيزياء
        </Link>

        {/* قسم اللاعب */}
        <div className="flex items-center gap-3 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-700 shadow-inner">
          
          {/* دائرة المستوى */}
          <div className="relative w-9 h-9 flex items-center justify-center bg-indigo-600 rounded-full border-2 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            <span className="font-bold text-sm">{globalLevel}</span>
          </div>

          {/* تفاصيل الـ XP */}
          <div className="flex flex-col w-24 sm:w-32">
            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5 px-1">
              <span>LVL {globalLevel}</span>
              <span>{Math.floor(progressPercent)}%</span>
            </div>
            {/* شريط التقدم */}
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

    
        {/* رابط لوحة المتصدرين */}
        <Link 
          href="/leaderboard" 
          className="mr-3 p-2 hover:bg-gray-700 rounded-full transition-colors group relative"
          title="لوحة الأساطير"
        >
          <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">🏆</span>
          {/* نقطة حمراء صغيرة للتنبيه (جماليات) */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </Link>


          {/* رابط الملف الشخصي */}
          <Link href="/profile" className="ml-2 flex items-center gap-2 hover:bg-gray-800 p-1 pr-3 rounded-full transition-all group">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-white font-bold">
                {profile?.full_name || 'البطل'}
              </div>
              <div className="text-[10px] text-gray-400">
                @{profile?.username || 'user'}
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600 group-hover:border-indigo-500 transition-colors">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
            </div>
          </Link>

        </div>
      </div>
    </header>
  );
}