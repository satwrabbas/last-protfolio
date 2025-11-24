"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';
import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';

export default function EditProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) return;
    
    // جلب البيانات الحالية
    const getProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, full_name, bio')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
        });
      }
    };
    getProfile();
  }, [user]);

  const updateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
      })
      .eq('id', user!.id);

    if (error) {
      alert('حدث خطأ!');
      console.log(error);
    } else {
      alert('تم تحديث بيانات الشخصية!');
      router.push('/profile'); // العودة للملف الشخصي
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">تعديل الشخصية</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">اسم المستخدم (اللقب)</label>
            <input 
              type="text" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-indigo-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2 text-sm">الاسم الكامل</label>
            <input 
              type="text" 
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 text-sm">نبذة عنك (Bio)</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-indigo-500 outline-none h-24"
            />
          </div>

          <button 
            onClick={updateProfile}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </button>
          
          <Link href="/profile" className="block text-center text-gray-400 hover:text-white text-sm mt-4">
            إلغاء
          </Link>
        </div>
      </div>
    </div>
  );
}