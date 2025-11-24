// app/lessons/[unitId]/page.tsx

"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase/client';
import { useAuth } from '@/app/components/AuthProvider';

// تعريف مستويات الثقة الخمسة
const CONFIDENCE_LEVELS = [
  { value: '🤯', label: 'ضائع تماماً', color: 'bg-red-900/50 border-red-500' },
  { value: '🤔', label: 'غير متأكد', color: 'bg-orange-900/50 border-orange-500' },
  { value: '😐', label: 'عادي', color: 'bg-yellow-900/50 border-yellow-500' },
  { value: '🙂', label: 'جيد', color: 'bg-blue-900/50 border-blue-500' },
  { value: '😎', label: 'واثق جداً', color: 'bg-green-900/50 border-green-500' },
];

type Lesson = {
  id: string;
  title: string;
  xp_value: number;
  order: number;
  completed: boolean;
  note: string | null;
  confidence: string | null; // إضافة الثقة
  isNoteDirty?: boolean; // خاصية للواجهة فقط: هل تم تعديل الملاحظة ولم تُحفظ؟
};

type Unit = {
  subject_id: string;
  title: string;
};

export default function UnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { user ,updateLocalXP } = useAuth();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { unitId } = React.use(params);

  useEffect(() => {
    if (!user || !unitId) return;

    const fetchUnitAndLessons = async () => {
      setLoading(true);

      // 1. جلب الدروس
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, xp_value, order')
        .eq('unit_id', unitId)
        .order('order', { ascending: true });

      // 2. جلب التقدم (بما في ذلك الثقة والملاحظات)
      const lessonIds = lessonsData?.map(l => l.id) || [];
      const { data: progressData, error: progressError } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, completed, note, confidence') // <-- جلب confidence
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds);

      // 3. جلب الوحدة
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select('title, subject_id')
        .eq('id', unitId)
        .single();
      
      if (lessonsError || progressError || unitError) {
        console.error('Error fetching data:', lessonsError || progressError || unitError);
      } else {
        const enrichedLessons = lessonsData.map(lesson => {
          const progress = progressData?.find(p => p.lesson_id === lesson.id);
          return {
            ...lesson,
            completed: progress?.completed || false,
            note: progress?.note || null,
            confidence: progress?.confidence || null, // القيمة الافتراضية
            isNoteDirty: false, // عند التحميل، الملاحظة غير معدلة
          };
        });
        setUnit(unitData);
        setLessons(enrichedLessons);
      }
      setLoading(false);
    };

    fetchUnitAndLessons();
  }, [user, unitId]);

  // --- الدوال المساعدة ---

  // دالة التحقق من الإنجازات (مختصرة هنا للتركيز على التغييرات الجديدة)
  const checkAndUnlockAchievements = async () => {
    // ... (نفس منطق الإنجازات السابق) ...
  };

  // 1. تحديث الإكمال
  const handleToggleComplete = async (lessonId: string, currentStatus: boolean) => {
    if (!user) return;

    // 1. العثور على الدرس لمعرفة قيمة الـ XP الخاصة به
    const lesson = lessons.find(l => l.id === lessonId);
    const xpAmount = lesson?.xp_value || 0;

    const newStatus = !currentStatus;

    // تحديث محلي فوري
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, completed: newStatus } : l));

        // 3. ▼▼▼ التحديث الفوري للـ Header ▼▼▼
    if (newStatus) {
      // إذا أكمل الدرس، أضف النقاط
      updateLocalXP(xpAmount);
    } else {
      // إذا ألغى الإكمال، اطرح النقاط
      updateLocalXP(-xpAmount);
    }

    const { data: existingProgress } = await supabase.from('user_lesson_progress').select('id').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle();
    
    let error;
    if (existingProgress) {
      ({ error } = await supabase.from('user_lesson_progress').update({ completed: newStatus }).eq('id', existingProgress.id));
    } else {
      ({ error } = await supabase.from('user_lesson_progress').insert({ user_id: user.id, lesson_id: lessonId, completed: newStatus }));
    }

    if (error) console.error('Error:', error);
    if (newStatus) checkAndUnlockAchievements();
  };

  // 2. تحديث مستوى الثقة (جديد)
  const handleChangeConfidence = async (lessonId: string, newConfidence: string) => {
    if (!user) return;

    // تحديث محلي فوري
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, confidence: newConfidence } : l));

    const { data: existingProgress } = await supabase.from('user_lesson_progress').select('id').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle();

    if (existingProgress) {
      await supabase.from('user_lesson_progress').update({ confidence: newConfidence }).eq('id', existingProgress.id);
    } else {
      await supabase.from('user_lesson_progress').insert({ user_id: user.id, lesson_id: lessonId, confidence: newConfidence });
    }
  };

  // 3. الكتابة في الملاحظة (تحديث محلي فقط + تفعيل زر الحفظ)
  const handleNoteChange = (lessonId: string, newNote: string) => {
    setLessons(prevLessons =>
      prevLessons.map(l =>
        l.id === lessonId 
          ? { ...l, note: newNote, isNoteDirty: true } // <-- جعل الزر يظهر
          : l
      )
    );
  };

  // 4. حفظ الملاحظة (إخفاء الزر بعد الحفظ)
  const handleSaveNote = async (lessonId: string) => {
    if (!user) return;
    const lessonToSave = lessons.find(l => l.id === lessonId);
    if (!lessonToSave) return;
    
    const { error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        note: lessonToSave.note,
        // نحافظ على القيم الأخرى إذا كان السجل جديداً
        completed: lessonToSave.completed,
        confidence: lessonToSave.confidence
      }, { onConflict: 'user_id, lesson_id' });

    if (error) {
      alert('حدث خطأ أثناء حفظ الملاحظة!');
    } else {
      // إخفاء الزر بعد النجاح
      setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, isNoteDirty: false } : l));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">جاري تحميل البيانات...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100">
      <header className="mb-8 max-w-4xl mx-auto">
        <Link href={`/units/${unit?.subject_id}`} className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2 mb-4">
          <span>&larr;</span> العودة للوحدات
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{unit?.title || '...'}</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {lessons.map((lesson) => (
          <div 
            key={lesson.id} 
            className={`rounded-xl overflow-hidden border border-gray-700 shadow-lg transition-all duration-300 ${
              lesson.completed ? 'bg-gray-800/50' : 'bg-gray-800'
            }`}
          >
            {/* شريط الحالة العلوي */}
            <div className={`h-2 w-full ${lesson.completed ? 'bg-green-500' : 'bg-gray-700'}`} />

            <div className="p-5 md:p-6">
              {/* العنوان وزر الإكمال */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  {/* تم إزالة الرابط كما طلبت */}
                  <h2 className={`text-xl font-bold transition-all ${lesson.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {lesson.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-gray-300">{lesson.xp_value} XP</span>
                    {lesson.completed && <span className="text-green-400 flex items-center gap-1">✓ مكتمل</span>}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleToggleComplete(lesson.id, lesson.completed)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all transform active:scale-95 shadow-md ${
                    lesson.completed 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-green-600 text-white hover:bg-green-500 hover:shadow-green-900/20'
                  }`}
                >
                  {lesson.completed ? 'إلغاء الإكمال' : 'إتمام الدرس'}
                </button>
              </div>

              <hr className="border-gray-700/50 my-4" />

              {/* قسم مستوى الثقة */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">
                  مستوى الفهم والثقة:
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONFIDENCE_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleChangeConfidence(lesson.id, level.value)}
                      className={`
                        px-3 py-2 rounded-lg border transition-all flex items-center gap-2 text-sm
                        ${lesson.confidence === level.value 
                          ? `${level.color} border-opacity-100 scale-105 shadow-md` // العنصر المختار
                          : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-700 hover:border-gray-500 opacity-70 hover:opacity-100' // غير المختار
                        }
                      `}
                      title={level.label}
                    >
                      <span className="text-lg">{level.value}</span>
                      <span className={`hidden md:inline ${lesson.confidence === level.value ? 'font-bold text-white' : ''}`}>
                        {level.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* قسم الملاحظات */}
              <div className="relative group">
                 <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block flex justify-between">
                  <span>📝 ملاحظاتك الخاصة:</span>
                  {/* زر الحفظ يظهر فقط عند التعديل */}
                  {lesson.isNoteDirty && (
                    <span className="text-yellow-500 text-[10px] animate-pulse">● تم التعديل (غير محفوظ)</span>
                  )}
                </label>
                
                <textarea
                  placeholder="سجل أفكارك، قوانين مهمة، أو أسئلة للمراجعة..."
                  value={lesson.note || ''}
                  onChange={(e) => handleNoteChange(lesson.id, e.target.value)}
                  className="w-full bg-gray-900/50 text-gray-200 p-4 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y min-h-[100px] text-sm leading-relaxed placeholder-gray-600"
                />

                {/* زر الحفظ المشروط */}
                {lesson.isNoteDirty && (
                  <div className="absolute bottom-3 left-3 animate-fade-in">
                    <button 
                      onClick={() => handleSaveNote(lesson.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-lg shadow-indigo-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      <span>حفظ الملاحظة</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </main>
    </div>
  );
}