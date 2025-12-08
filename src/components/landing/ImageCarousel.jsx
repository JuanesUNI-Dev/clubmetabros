"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ImageCarousel
 * Props:
 *  - images: string | string[]
 *  - spaceName: string
 *  - onImageClick: function(index)
 */
const ImageCarousel = ({ images = [], spaceName = "", onImageClick, isZoomed = false }) => {

  // 1️⃣ Asegurar que sea array y limpio
  const imageList = Array.isArray(images) ? images : [images];

  // 2️⃣ Filtrar URLs válidas
  const validImages = imageList.filter(u => typeof u === "string" && u.trim() !== "");

  const length = validImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch swipe
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [spaceName]);

  const goPrev = () => {
    setCurrentIndex(i => (i === 0 ? length - 1 : i - 1));
  };

  const goNext = () => {
    setCurrentIndex(i => (i === length - 1 ? 0 : i + 1));
  };

  const onTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = e => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (dx > threshold) goNext();
    else if (dx < -threshold) goPrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (length === 0) {
    return (
      <div className="h-64 md:h-80 w-full bg-gray-300 flex items-center justify-center">
        <p className="text-gray-600">No hay imágenes disponibles para {spaceName}</p>
      </div>
    );
  }

  return (
    <div
      className={`relative h-64 md:h-80 w-full overflow-hidden ${
        isZoomed ? "md:h-230" : "cursor-pointer"
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Imagen actual */}
      <img
        src={validImages[currentIndex]}
        alt={`${spaceName} - Vista ${currentIndex + 1}`}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          isZoomed ? "object-contain bg-black" : "object-cover"
        }`}
        onClick={() => onImageClick?.(currentIndex)}
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/800x600/CCCCCC/666666?text=No+Image";
        }}
      />

      {/* Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

      {/* Flechas */}
      {length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-30"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-30"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentIndex ? "bg-white scale-110" : "bg-gray-400 opacity-60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
