// app/components/AuthProvider.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase/client';
import { User } from '@supabase/supabase-js';

// ... (بعد الـ imports)

// هذا النوع يصف شكل البيانات القادمة من الاستعلام المتداخل
type XPDataResponse = {
  lessons: {
    xp_value: number;
    units: {
      subjects: {
        id: string;
        name: string;
      } | null;
    } | null;
  } | null;
};
// 1. تعريف شكل بيانات تقدم المادة الواحدة
export type SubjectProgress = {
  id: string;
  name: string;
  xp: number;
  level: number;
};

export type Profile = {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_xp: number; // سنجلب الـ XP من هنا مستقبلاً
  is_admin: boolean; 
};

// 2. تحديث نوع الـ Context ليشمل البيانات الجديدة

type AuthContextType = {
  user: User | null;
  profile: Profile | null; // <-- إضافة البروفايل
  globalXp: number;
  globalLevel: number;
  subjectsProgress: SubjectProgress[];
  refreshXP: () => Promise<void>;
  updateLocalXP: (amount:number) => void;
  isAdmin: boolean;
};


// قيم افتراضية
const AuthContext = createContext<AuthContextType>({ 
  user: null,
  profile: null,
  globalXp: 0,
  globalLevel: 1,
  subjectsProgress: [],
  refreshXP: async () => {},
  updateLocalXP : () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
   const [isAdmin, setIsAdmin] = useState(false);
  // حالات جديدة للـ XP والمستويات
  const [globalXp, setGlobalXp] = useState(0);
  const [globalLevel, setGlobalLevel] = useState(1);
  const [subjectsProgress, setSubjectsProgress] = useState<SubjectProgress[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  // معادلة حساب المستوى: كلما زاد الـ XP أصبح الصعود للمستوى التالي أصعب قليلاً
  const calculateLevel = (xp: number) => Math.floor(1 + Math.sqrt(xp) / 5);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();
    
    if (data?.is_admin) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };
  // 3. الدالة الأساسية لحساب الخبرة
  const fetchXPData = async (userId: string) => {
    // نجلب الدروس المكتملة، ونطلب من Supabase جلب تفاصيل الدرس، الوحدة، والمادة المرتبطة به
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select(`
        lesson_id,
        lessons (
          xp_value,
          units (
            subjects (
              id,
              name
            )
          )
        )
      `)
      .eq('user_id', userId)
      .eq('completed', true);

    if (error) {
      console.error('Error fetching XP:', error);
      return;
    }
    

    // أضف هذا الجزء داخل fetchXPData أو بجانبه
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileData) {
      setProfile(profileData);
      // ملاحظة: حالياً سنبقي حساب الـ XP كما هو (ديناميكي) حتى نربط التحديث بقاعدة البيانات
      // لكن وجود البروفايل هنا يسمح لنا بعرض الاسم والصورة
    }

    let totalGlobalXP = 0;
    const subjectsMap: Record<string, SubjectProgress> = {};

    // تجميع البيانات
// 1. أزل ": XPDataResponse" من داخل القوسين واتركها (row) أو (item) بدون نوع
    data?.forEach((row) => {
      
      // 2. هنا نقوم بالتحويل السحري.
      // نخبره: خذ "row" (مهما كان شكله) وعامله كأنه "XPDataResponse"
      const item = row as unknown as XPDataResponse;

      // ... الآن الكود سيعمل كما كان سابقاً دون أي تغيير ...
      const lesson = item.lessons;
      if (lesson && lesson.units && lesson.units.subjects) {
        const xpValue = lesson.xp_value || 0;
        const subject = lesson.units.subjects;

        // زيادة المجموع العام
        totalGlobalXP += xpValue;

        // تجميع النقاط للمادة المحددة
        if (!subjectsMap[subject.id]) {
          subjectsMap[subject.id] = {
            id: subject.id,
            name: subject.name,
            xp: 0,
            level: 1
          };
        }
        subjectsMap[subject.id].xp += xpValue;
      }
    });

    // حساب مستوى كل مادة وتحديث الحالة
    const processedSubjects = Object.values(subjectsMap).map(sub => ({
      ...sub,
      level: calculateLevel(sub.xp)
    }));

    setGlobalXp(totalGlobalXP);
    setGlobalLevel(calculateLevel(totalGlobalXP));
    setSubjectsProgress(processedSubjects);
  };

  const updateLocalXP = (amount: number) => {
    // نحدث القيم محلياً فوراً ليرى المستخدم النتيجة بسرعة البرق
    setGlobalXp((prev) => {
      const newXp = prev + amount;
      setGlobalLevel(calculateLevel(newXp)); // نعيد حساب المستوى أيضاً
      return newXp;
    });
    
  };
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      // إذا وجدنا مستخدماً، نجلب نقاطه فوراً
      if (session?.user) {
        fetchXPData(session.user.id);
      }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // عند تسجيل الدخول، اجلب النقاط
        fetchXPData(session.user.id);
        checkAdmin(session.user.id);
      } else {
        // عند تسجيل الخروج، صفر العدادات
        setGlobalXp(0);
        setGlobalLevel(1);
        setSubjectsProgress([]);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // دالة التحديث اليدوي (سنستخدمها في صفحة الدرس عند الإكمال)
  const refreshXP = async () => {
    if (user) {
      await fetchXPData(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, globalXp, globalLevel, subjectsProgress, refreshXP,updateLocalXP, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};