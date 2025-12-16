"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaExpandArrowsAlt,
} from "react-icons/fa";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length]
  );

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextImage, prevImage]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((imgUrl, index) => (
          <div
            key={index}
            onClick={() => openGallery(index)}
            className="relative h-56 md:h-64 rounded-xl overflow-hidden group cursor-pointer border-2 border-transparent hover:border-yellow-500/70 transition-all duration-300 shadow-sm hover:shadow-yellow-500/10 hover:shadow-lg"
          >
            <Image
              src={imgUrl}
              alt={`${title} - ${index}`}
              fill
              className="object-cover group-hover:scale-105 transition duration-700 ease-in-out"
            />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/60 backdrop-blur-[2px] text-yellow-500 p-3 rounded-full transform scale-75 group-hover:scale-100 transition duration-300 shadow-xl border border-white/10">
                <FaExpandArrowsAlt size={20} />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 md:p-3 rounded-full transition z-50"
          >
            <FaTimes className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-2 md:left-8 text-white/70 hover:text-yellow-500 bg-black/20 hover:bg-black/50 p-2 md:p-4 rounded-full transition z-50 
             border border-white/5"
          >
            <FaArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`Full screen ${currentIndex}`}
              fill
              className="object-contain"
              priority
              quality={100}
            />
            <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white/60 text-sm tracking-widest font-light">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-2 md:right-8 text-white/70 hover:text-yellow-500 bg-black/20 hover:bg-black/50 p-2 md:p-4 rounded-full transition z-50  border border-white/5"
          >
            <FaArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      )}
    </>
  );
}
