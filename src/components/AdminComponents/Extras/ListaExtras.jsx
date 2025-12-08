'use client';

import { useEffect, useState } from "react";
import { getExtras } from "@/lib/api/extras/extras.js";

export default function ExtrasList({ reload, onSelect }) {
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getExtras();
      console.log("Extras cargados:", data);

      // Asegurar que sea un array
      setExtras(data?.result ?? []);
      setLoading(false);
    }

    load();
  }, [reload]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cargando extras...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      
      <h2 className="text-lg font-semibold text-gray-700">
        Extras registrados
      </h2>

      {/* Botón agregar */}
      <button
        onClick={() => onSelect({ new: true })}
        className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
      >
        + Agregar Extra
      </button>

      {/* Lista scrollable */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[85vh]">
        {extras.map((extra) => (
          <button
            key={extra.id_extra}
            onClick={() => {
              setSelectedId(extra.id_extra);
              onSelect(extra);
            }}
            className={`flex w-full items-center gap-4 p-3 rounded-xl border transition shadow-sm cursor-pointer
              ${
                selectedId === extra.id_extra
                  ? "border-amber-500 bg-[#fff9e6]"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }
            `}
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-gray-800">
                {extra.name}
              </span>

              <span className="text-sm text-gray-500">
                Valor adicional: ${extra.value_add}
              </span>

              <span className="text-sm text-gray-400">
                Cantidad disponible: {extra.quantity}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
