"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { deleteProject } from "../actions";

interface DeleteButtonProps {
  id: string;
  imageUrl: string;
}

export default function DeleteButton({ id, imageUrl }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف المشروع والصورة المرتبطة به نهائياً!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      background: "#1e293b",
      color: "#fff",
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("image_url", imageUrl);

        await deleteProject(formData);

        Swal.fire({
          title: "تم الحذف!",
          text: "لقد تم حذف المشروع بنجاح.",
          icon: "success",
          background: "#1e293b",
          color: "#fff",
        });
      } catch (error) {
        Swal.fire({
          title: "خطأ",
          text: "حدثت مشكلة أثناء الحذف",
          icon: "error",
          background: "#1e293b",
          color: "#fff",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDeleteClick}
      disabled={isDeleting}
      className="flex items-center gap-1 text-red-500 hover:text-red-400 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition disabled:opacity-50"
    >
      {isDeleting ? (
        <span className="animate-pulse">جاري الحذف...</span>
      ) : (
        <>
          <FaTrash size={14} />
          <span>حذف</span>
        </>
      )}
    </button>
  );
}
