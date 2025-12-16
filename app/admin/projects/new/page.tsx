"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import {
  FaCloudUploadAlt,
  FaImages,
  FaStar,
  FaRulerCombined,
  FaUserTie,
  FaCalendarAlt,
} from "react-icons/fa";

export default function NewProject() {
  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setProgress(0);
    setStatusMessage("جاري بدء العملية...");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const formData = new FormData(e.currentTarget);

    try {
      const title = formData.get("title") as string;
      const slug =
        title.trim().replace(/\s+/g, "-").toLowerCase() +
        "-" +
        Math.floor(Math.random() * 1000);

      const description = formData.get("description") as string;
      const category = formData.get("category") as string;
      const location = formData.get("location") as string;
      const client_name = formData.get("client_name") as string;
      const area = formData.get("area") as string;
      const completion_date =
        (formData.get("completion_date") as string) || null;
      const status = formData.get("status") as string;
      const is_featured = formData.get("is_featured") === "on";

      setStatusMessage("جاري رفع الصورة الرئيسية...");
      const mainImageFile = formData.get("image") as File;
      let mainImageUrl = "";

      if (!mainImageFile || mainImageFile.size === 0) {
        throw new Error("يرجى اختيار الصورة الرئيسية للمشروع");
      }

      const mainFileExt = mainImageFile.name.split(".").pop();
      const mainFileName = `main_${Date.now()}_${Math.random()}.${mainFileExt}`;

      const { error: mainUploadError } = await supabase.storage
        .from("projects")
        .upload(mainFileName, mainImageFile);

      if (mainUploadError) throw mainUploadError;

      mainImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${mainFileName}`;

      setProgress(30);

      const galleryFiles = formData.getAll("gallery") as File[];
      const validGalleryFiles = galleryFiles.filter((file) => file.size > 0);
      const galleryUrls: string[] = [];

      if (validGalleryFiles.length > 0) {
        setStatusMessage(
          `جاري رفع صور المعرض (0/${validGalleryFiles.length})...`
        );

        const progressStep = 60 / validGalleryFiles.length;
        let uploadedCount = 0;

        const uploadPromises = validGalleryFiles.map(async (file) => {
          const fileExt = file.name.split(".").pop();
          const fileName = `gallery_${Date.now()}_${Math.random()}.${fileExt}`;

          const { error } = await supabase.storage
            .from("projects")
            .upload(fileName, file);

          if (error) return null;

          uploadedCount++;
          const currentProgress = 30 + uploadedCount * progressStep;
          setProgress(Math.round(currentProgress));
          setStatusMessage(
            `جاري رفع صور المعرض (${uploadedCount}/${validGalleryFiles.length})...`
          );

          return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${fileName}`;
        });

        const results = await Promise.all(uploadPromises);
        results.forEach((url) => {
          if (url) galleryUrls.push(url);
        });
      } else {
        setProgress(90);
      }

      setStatusMessage("جاري حفظ بيانات المشروع...");
      const { error: dbError } = await supabase.from("projects").insert({
        title,
        slug,
        description,
        category,
        location,
        client_name,
        area,
        completion_date,
        status,
        is_featured,
        image_url: mainImageUrl,
        images_gallery: galleryUrls,
      });

      if (dbError) throw dbError;

      setProgress(100);
      setStatusMessage("تم النشر بنجاح!");

      setTimeout(() => {
        alert("تم نشر المشروع بنجاح!");
        router.push("/admin/projects");
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error("Error:", error);
      alert(`حدث خطأ: ${error.message || "فشل في العملية"}`);
      setUploading(false);
      setProgress(0);
      setStatusMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">إضافة مشروع جديد</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-slate-900 p-8 rounded-2xl border border-white/10 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm text-slate-300">
              اسم المشروع <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              className="w-full bg-slate-950 p-4 rounded-xl border border-white/10 text-white focus:border-yellow-500 outline-none transition"
              placeholder="مثال: فيلا الجبل"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">الموقع</label>
            <input
              name="location"
              type="text"
              required
              className="w-full bg-slate-950 p-4 rounded-xl border border-white/10 text-white focus:border-yellow-500 outline-none"
              placeholder="مثال: مصياف - الحي الغربي"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">التصنيف</label>
            <select
              name="category"
              className="w-full bg-slate-950 p-4 rounded-xl border border-white/10 text-white focus:border-yellow-500 outline-none appearance-none"
            >
              <option value="بناء سكني">بناء سكني</option>
              <option value="إكساء داخلي">إكساء داخلي</option>
              <option value="تصميم معماري">تصميم معماري</option>
              <option value="تجاري">تجاري</option>
              <option value="ترميم">ترميم</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-950/50 p-6 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-sm text-blue-400 flex items-center gap-2">
              <FaUserTie /> اسم العميل (اختياري)
            </label>
            <input
              name="client_name"
              type="text"
              className="w-full bg-slate-900 p-3 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none"
              placeholder="السيد محمد..."
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-blue-400 flex items-center gap-2">
              <FaRulerCombined /> المساحة
            </label>
            <input
              name="area"
              type="text"
              className="w-full bg-slate-900 p-3 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none"
              placeholder="150 م²"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-blue-400 flex items-center gap-2">
              <FaCalendarAlt /> تاريخ التسليم
            </label>
            <input
              name="completion_date"
              type="date"
              className="w-full bg-slate-900 p-3 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">
              حالة المشروع
            </label>
            <select
              name="status"
              className="w-full bg-slate-900 p-3 rounded-lg border border-white/10 text-white focus:border-blue-500 outline-none"
            >
              <option value="completed">مكتمل (تم التسليم)</option>
              <option value="ongoing">قيد الإنشاء (ورشة قائمة)</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center p-3 bg-slate-900 rounded-lg border border-white/10">
            <input
              type="checkbox"
              name="is_featured"
              id="is_featured"
              className="w-5 h-5 accent-yellow-500 cursor-pointer"
            />
            <label
              htmlFor="is_featured"
              className="mr-3 text-white cursor-pointer select-none flex items-center gap-2"
            >
              <FaStar className="text-yellow-500" />
              <span>تثبيت في الصفحة الرئيسية (مشروع مميز)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-slate-300">
            وصف تفصيلي
          </label>
          <textarea
            name="description"
            className="w-full bg-slate-950 p-4 rounded-xl border border-white/10 text-white h-40 focus:border-yellow-500 outline-none leading-relaxed"
            placeholder="اكتب تفاصيل المشروع، المواد المستخدمة، التحديات..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-2 border-dashed border-yellow-500/30 rounded-xl bg-slate-950/30 hover:bg-slate-950/50 transition text-center">
            <FaCloudUploadAlt className="text-4xl text-yellow-500 mx-auto mb-4" />
            <label className="block mb-2 text-sm font-bold text-white">
              الصورة الرئيسية (الغلاف)
            </label>
            <p className="text-xs text-slate-500 mb-4">
              ستظهر في واجهة الموقع وبطاقة المشروع
            </p>
            <input
              name="image"
              type="file"
              accept="image/*"
              required
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-slate-900 hover:file:bg-yellow-400 cursor-pointer"
            />
          </div>

          <div className="p-6 border-2 border-dashed border-blue-500/30 rounded-xl bg-slate-950/30 hover:bg-slate-950/50 transition text-center">
            <FaImages className="text-4xl text-blue-500 mx-auto mb-4" />
            <label className="block mb-2 text-sm font-bold text-white">
              صور المعرض (متعددة)
            </label>
            <p className="text-xs text-slate-500 mb-4">
              اختر صوراً من زوايا مختلفة (اختياري)
            </p>
            <input
              name="gallery"
              type="file"
              accept="image/*"
              multiple
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-3">
          {uploading && (
            <div className="w-full bg-slate-950 rounded-full h-4 overflow-hidden border border-white/10 relative">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full transition-all duration-300 ease-out flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                <span className="text-[10px] font-bold text-slate-900">
                  {progress}%
                </span>
              </div>
            </div>
          )}

          <button
            disabled={uploading}
            type="submit"
            className={`w-full font-bold py-5 rounded-xl transition shadow-xl shadow-yellow-500/10 disabled:opacity-50 text-lg flex justify-center items-center gap-2
              ${
                uploading
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-slate-900"
              }
            `}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{statusMessage}</span>
              </>
            ) : (
              "نشر المشروع الآن"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
