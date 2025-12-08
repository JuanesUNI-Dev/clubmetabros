// SpaceGridCard.jsx
'use client';
import { Maximize2 } from 'lucide-react';

export const SpaceGridCard = ({ space, onOpenModal }) => {
  const badgeColor = space.disponibilidad_socio
    ? 'text-green-800 bg-green-200'
    : `text-[rgb(180,100,50)] bg-[rgb(235,224,209)]`;

  return (
    <div 
      className="rounded-xl shadow-xl cursor-pointer overflow-hidden bg-[rgb(220,220,220)] transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl"
      onClick={() => onOpenModal(space)}
    >
      {/* Imagen */}
      <div className="relative h-48 w-full">
        <img
          src={space.url_img?.[0]}         // <-- corregido
          alt={space.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { 
            e.currentTarget.style.backgroundColor = 'gray'; 
            e.currentTarget.alt = `Imagen no disponible`;
          }}
        />
        <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-[rgb(173,216,230)] text-[rgb(25,50,90)] shadow-md">
          Descuento para socios
        </span>
      </div>

      <div className="p-5">
        {/* Nombre */}
        <h3 className="text-2xl font-bold text-[rgb(25,50,90)] mb-2">
          {space.name}
        </h3>

        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>
          Descuento para socios
        </span>

        <p className="text-[rgb(25,50,90)] opacity-70 mt-4 mb-4 text-sm line-clamp-3">
          {space.descrip}
        </p>

        {/* Capacidad */}
        <div className="flex justify-between items-center border-t border-gray-300 pt-4 mb-4">
          <div className="flex items-center text-[rgb(25,50,90)] opacity-80">
            <Maximize2 size={18} className="mr-1 text-[rgb(180,100,50)]" />
            <span className="text-sm font-medium">
              Max: {space.capacidad_max} pax
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceGridCard;
