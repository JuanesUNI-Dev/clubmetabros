// src/components/AdminComponents/ListaSocios.jsx
'use client';

import { useEffect, useState } from "react";
import { getPartners } from "@/lib/api/partners/partners.js";

export default function ListaSocios({reload, onSelect}) {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
  async function load() {
    const data = await getPartners();

    // Asegurar que sea un array
    setSocios(data?.result ?? []);
    setLoading(false);
    console.log("Espacios cargados:", data);
  }
  load();
}, [reload]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cargando socios...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Socios registrados
      </h2>

      <button
        onClick={() => onSelect({ new: true })}
        className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
      >
        + Agregar Socio
      </button>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[85vh]">
        {socios.map((socio) => (
          <button
            key={socio.id_partner}
            onClick={() => {
              setSelectedId(socio.id_partner);
              onSelect(socio);
            }}
            className={`flex w-full items-center gap-4 p-3 rounded-xl border transition shadow-sm cursor-pointer
              ${
                selectedId === socio.id_partner
                  ? "border-amber-500 bg-[#fff9e6]"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }
            `}
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-gray-800">
                {socio.name}
              </span>

              <span className="text-sm text-gray-500">
                Email: {socio.email}
              </span>

              <span className="text-sm text-gray-400">
                Teléfono: {socio.phone_number}
              </span>

              <span className="text-xs text-gray-400">
                Cédula: {socio.cedula}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
