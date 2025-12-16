"use client";

import { useState, useEffect, use } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaSave,
  FaArrowRight,
  FaCloudUploadAlt,
  FaImages,
  FaTrash,
} from "react-icons/fa";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    image_url: "",
    images_gallery: [] as string[],
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("فشل تحميل المشروع، تأكد من الرقم");
        router.push("/admin/projects");
      } else if (data) {
        setFormData({
          title: data.title,
          category: data.category,
          location: data.location || "",
          description: data.description || "",
          image_url: data.image_url,
          images_gallery: data.images_gallery || [],
        });
      }
      setLoading(false);
    };

    fetchProject();
  }, [id, supabase, router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formElement = new FormData(e.currentTarget);

    const updates: any = {
      title: formElement.get("title"),
      category: formElement.get("category"),
      location: formElement.get("location"),
      description: formElement.get("description"),
    };

    const mainImageFile = formElement.get("new_image") as File;
    if (mainImageFile && mainImageFile.size > 0) {
      const fileExt = mainImageFile.name.split(".").pop();
      const fileName = `main_${Date.now()}_update.${fileExt}`;
      const { error: upError } = await supabase.storage
        .from("projects")
        .upload(fileName, mainImageFile);

      if (!upError) {
        updates.image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${fileName}`;
      }
    }

    const newGalleryFiles = formElement.getAll("new_gallery") as File[];
    const validGalleryFiles = newGalleryFiles.filter((f) => f.size > 0);

    const updatedGallery = [...formData.images_gallery];

    if (validGalleryFiles.length > 0) {
      const uploadPromises = validGalleryFiles.map(async (file) => {
        const fileName = `gallery_${Date.now()}_${Math.random()}.${file.name
          .split(".")
          .pop()}`;
        const { error } = await supabase.storage
          .from("projects")
          .upload(fileName, file);
        if (!error)
          return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${fileName}`;
        return null;
      });

      const newUrls = await Promise.all(uploadPromises);
      newUrls.forEach((url) => {
        if (url) updatedGallery.push(url);
      });

      updates.images_gallery = updatedGallery;
    }

    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id);

    if (error) {
      alert("حدث خطأ أثناء التحديث");
      console.error(error);
    } else {
      alert("تم تعديل المشروع بنجاح!");
      router.push("/admin/projects");
      router.refresh();
    }
    setSaving(false);
  };

  const removeGalleryImage = async (imgUrl: string) => {
    if (!confirm("هل تريد حذف هذه الصورة من المعرض؟ (سيتم الحفظ فوراً)"))
      return;

    const newGallery = formData.images_gallery.filter((url) => url !== imgUrl);

    const { error } = await supabase
      .from("projects")
      .update({ images_gallery: newGallery })
      .eq("id", id);

    if (!error) {
      setFormData((prev) => ({ ...prev, images_gallery: newGallery }));
    }
  };

  if (loading)
    return (
      <div className="text-white text-center py-20">جاري تحميل البيانات...</div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-white"
        >
          <FaArrowRight size={20} />
        </button>
        <h1 className="text-3xl font-bold text-white">
          تعديل المشروع: {formData.title}
        </h1>
      </div>

      <form
        onSubmit={handleUpdate}
        className="space-y-8 bg-slate-900 p-8 rounded-2xl border border-white/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm text-slate-300">
              اسم المشروع
            </label>
            <input
              name="title"
              defaultValue={formData.title}
              required
              className="w-full bg-slate-950 p-3 rounded-lg border border-white/10 text-white focus:border-yellow-500 outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-slate-300">الموقع</label>
            <input
              name="location"
              defaultValue={formData.location}
              className="w-full bg-slate-950 p-3 rounded-lg border border-white/10 text-white focus:border-yellow-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm text-slate-300">التصنيف</label>
          <select
            name="category"
            defaultValue={formData.category}
            className="w-full bg-slate-950 p-3 rounded-lg border border-white/10 text-white focus:border-yellow-500 outline-none"
          >
            <option value="بناء سكني">بناء سكني</option>
            <option value="إكساء داخلي">إكساء داخلي</option>
            <option value="تصميم معماري">تصميم معماري</option>
            <option value="تجاري">تجاري</option>
            <option value="ترميم">ترميم</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm text-slate-300">الوصف</label>
          <textarea
            name="description"
            defaultValue={formData.description}
            className="w-full bg-slate-950 p-3 rounded-lg border border-white/10 text-white h-32 focus:border-yellow-500 outline-none"
          ></textarea>
        </div>

        <div className="p-6 border border-white/10 rounded-xl bg-slate-950/30">
          <label className="block mb-4 text-sm text-yellow-500 font-bold">
            الصورة الرئيسية الحالية
          </label>
          <div className="flex gap-6 items-start">
            <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-white/20">
              <Image
                src={formData.image_url}
                alt="Current"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm text-slate-400">
                تغيير الصورة (اختياري)
              </label>
              <input
                name="new_image"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-400 file:bg-slate-800 file:text-white file:border-0 file:rounded-full file:px-4 file:py-2 hover:file:bg-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border border-white/10 rounded-xl bg-slate-950/30">
          <label className="block mb-4 text-sm text-blue-400 font-bold">
            صور المعرض ({formData.images_gallery.length})
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {formData.images_gallery.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden group border border-white/10"
              >
                <Image src={url} alt="gallery" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(url)}
                  className="absolute top-1 right-1 bg-red-600/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  title="حذف الصورة"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-4">
            <label className="block mb-2 text-sm text-slate-400 flex items-center gap-2">
              <FaCloudUploadAlt />
              <span>إضافة صور جديدة للمعرض</span>
            </label>
            <input
              name="new_gallery"
              type="file"
              multiple
              accept="image/*"
              className="block w-full text-sm text-slate-400 file:bg-blue-600/20 file:text-blue-400 file:border-0 file:rounded-full file:px-4 file:py-2 hover:file:bg-blue-600/30 cursor-pointer"
            />
          </div>
        </div>

        <button
          disabled={saving}
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {saving ? (
            "جاري الحفظ..."
          ) : (
            <>
              <FaSave />
              <span>حفظ التعديلات</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
