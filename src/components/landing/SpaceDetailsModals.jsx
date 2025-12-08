"use client";

import { X, MapPin, CheckCircle, Users, Clock, Calendar } from "lucide-react";
import ImageCarousel from "./ImageCarousel"; 
import { useState } from "react";
import ZoomModal from "./ZoomModal";

const SpaceDetailsModal = ({ space, onClose, onBook }) => {
  if (!space) return null;

  // El merge trae: name, descrip, url_img, tarifas, capacidad_max
  const allImages = Array.isArray(space.url_img)
  ? space.url_img
  : [space.url_img];

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  const handleImageClick = (index) => {
    setZoomIndex(index);
    setZoomOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-[rgba(0,0,0,0.19)] bg-opacity-50 flex items-center justify-center z-60 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] my-8 relative overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full text-[rgb(25,50,90)] hover:bg-gray-200 transition z-10 shadow-lg"
          >
            <X size={24} />
          </button>

          {/* Carrusel */}
          <div className="relative">
            <ImageCarousel
              images={allImages}
              spaceName={space.name}
              onImageClick={handleImageClick}
            />

            <div className="absolute bottom-0 left-0 p-6 text-white z-10">
              <h2 className="text-4xl font-extrabold mb-1">{space.name}</h2>

              {/* Ubicación no existe aún */}
              <span className="text-lg font-medium flex items-center">
                <MapPin size={18} className="mr-2 text-[rgb(173,216,230)]" />
                {"Ubicación no disponible"}
              </span>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Texto */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-[rgb(25,50,90)] mb-4 border-b pb-2 border-gray-200">
                Descripción
              </h3>

              <p className="text-[rgb(25,50,90)] text-opacity-80 mb-6 leading-relaxed">
                {space.descrip || "Este espacio no tiene una descripción detallada."}
              </p>

              <h4 className="text-xl font-semibold text-[rgb(25,50,90)] mb-3">
                Características
              </h4>

              <ul className="space-y-2 text-[rgb(25,50,90)] text-opacity-90">
                <li className="flex items-center">
                  <CheckCircle size={18} className="mr-2 text-green-500" />
                  Capacidad máxima: {space.capacidad_max} personas
                </li>

                {space.tarifas?.length > 0 && (
                  <li className="flex items-center">
                    <CheckCircle size={18} className="mr-2 text-green-500" />
                    Este espacio tiene tarifas disponibles
                  </li>
                )}
              </ul>

              {/* Precios: se calculan del arreglo de tarifas */}
              {space.tarifas?.length > 0 && (() => {
                const valores4 = space.tarifas.map(t => Number(t.value_4_hours));
                const min4 = Math.min(...valores4);
                const max4 = Math.max(...valores4);

                return (
                  <>
                    <h4 className="mt-4 text-xl font-semibold text-[rgb(25,50,90)] mb-3">
                      Rango de Precios (4h)
                    </h4>
                    <h4 className="text-lg text-[rgb(25,50,90)] text-opacity-90">
                      Mínimo: ${min4.toLocaleString()} COP | Máximo: ${max4.toLocaleString()} COP
                    </h4>
                  </>
                );
              })()}
            </div>

            {/* Panel derecho */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <h4 className="text-lg font-bold text-[rgb(25,50,90)] mb-2 flex items-center">
                  <Users size={20} className="mr-2 text-[rgb(180,100,50)]" />
                  Capacidad
                </h4>
                <p className="text-[rgb(25,50,90)] text-opacity-80">
                  Máximo: {space.capacidad_max}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                <h4 className="text-lg font-bold text-[rgb(25,50,90)] mb-2 flex items-center">
                  <Clock size={20} className="mr-2 text-[rgb(180,100,50)]" />
                  Horario
                </h4>
                <p className="text-[rgb(25,50,90)] text-opacity-80">
                  {"8:00 AM - 22:00"}
                </p>
              </div>

              <button
                onClick={() => {
                  onBook(space);
                  onClose();
                }}
                className="w-full px-5 py-3 text-lg bg-[rgb(204,153,0)] text-[rgb(25,50,90)] font-bold rounded-full shadow-xl hover:bg-opacity-90 transition duration-300 transform hover:scale-[1.03] flex items-center justify-center"
              >
                <Calendar className="mr-3" size={24} />
                Reservar este espacio
              </button>
            </div>
          </div>
        </div>
      </div>

      <ZoomModal
        images={allImages}
        isOpen={zoomOpen}
        currentIndex={zoomIndex}
        onClose={() => setZoomOpen(false)}
      />
    </>
  );
};

export default SpaceDetailsModal;
