"use client";
import { useState, useRef } from "react";
import { X } from "lucide-react";
import ImageCarousel from "./ImageCarousel.jsx";

const ZoomModal = ({ isOpen, images, spaceName, onClose }) => {
  const imgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [lastScale, setLastScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      // --- PINCH (zoom con dos dedos)
      const dist =
        Math.sqrt(
          Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
            Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
        );

      if (!imgRef.current.startDistance) {
        imgRef.current.startDistance = dist;
      }

      let newScale = (dist / imgRef.current.startDistance) * lastScale;

      // Limitar zoom
      newScale = Math.max(1, Math.min(newScale, 4));
      setScale(newScale);
    }

    if (e.touches.length === 1 && scale > 1) {
      // --- PAN (arrastrar imagen)
      const touch = e.touches[0];

      const dx = touch.clientX - imgRef.current.startX;
      const dy = touch.clientY - imgRef.current.startY;

      setPosition({
        x: lastPosition.x + dx,
        y: lastPosition.y + dy,
      });
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      imgRef.current.startX = e.touches[0].clientX;
      imgRef.current.startY = e.touches[0].clientY;
    }

    if (e.touches.length === 2) {
      imgRef.current.startDistance = null;
    }
  };

  const handleTouchEnd = () => {
    setLastScale(scale);
    setLastPosition(position);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-9999 flex items-center justify-center p-4 "
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl overflow-hidden max-w-7xl w-full shadow-2xl relative "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition z-20"
        >
          <X color="black" size={24} />
        </button>

        {/* Contenedor táctil */}
        <div
          className="relative overflow-hidden touch-none "
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carrusel (solo imagen actual) */}
          <div
            ref={imgRef}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transition: scale === 1 ? "transform 0.2s ease" : "none",
            }}
          >
            <ImageCarousel
              images={images}
              spaceName={spaceName}
              fullScreen={true} // *** <- Indicamos modo sin recorte ***
              isZoomed={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomModal;

