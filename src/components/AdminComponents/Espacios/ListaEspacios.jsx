// src/components/AdminComponents/ListaEspacios.jsx
'use client';

import { useEffect, useState } from "react";
import { getSpaces } from "@/lib/api/spaces/spaces";

export default function ListaEspacios({ reload, onSelect }) {
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filterPartner, setFilterPartner] = useState("all"); 
// "all" | "partner" | "non-partner"


  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getSpaces();

      console.log("Espacios cargados:", data);

      setEspacios(data?.result ?? []);
      setLoading(false);
    }

    load();
  }, [reload]); // 🔥 Recargar cuando tomen acciones

  const filteredSpaces = espacios.filter((e) => {
  if (filterPartner === "partner") return e.is_partner === true;
  if (filterPartner === "non-partner") return e.is_partner === false;
  return true; // all
});
  
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cargando espacios...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Espacios Disponibles
      </h2>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600 font-semibold">Filtrar:</span>

        <button
          onClick={() => setFilterPartner("all")}
          className={`px-2 py-1 text-xs rounded-lg border 
            ${filterPartner === "all" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          Todos
        </button>
            
        <button
          onClick={() => setFilterPartner("partner")}
          className={`px-2 py-1 text-xs rounded-lg border 
            ${filterPartner === "partner" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          Socios
        </button>

        <button
          onClick={() => setFilterPartner("non-partner")}
          className={`px-2 py-1 text-xs rounded-lg border 
            ${filterPartner === "non-partner" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          No socios
        </button>
      </div>
      <button
        onClick={() => onSelect({ new: true })}
        className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
      >
        + Agregar
      </button>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[85vh]">
        {filteredSpaces.map((espacio) => (
          <button
            key={espacio.id_rate}
            onClick={() => {
              setSelectedId(espacio.id_rate);
              onSelect(espacio);
            }}
            className={`flex w-full items-center gap-4 p-3 rounded-xl border 
              transition-all shadow-sm text-left cursor-pointer
              ${
                selectedId === espacio.id_rate
                  ? "border-[rgb(204,153,0)] bg-[#fff9e6]"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }
            `}
          >
            <div className="w-50 h-20 bg-gray-200 rounded-3xl border-2 border-amber-400 flex items-center justify-center text-gray-500 text-xs sm:w-1/2">
              <img className="flex w-50 h-20 rounded-3xl" src={espacio.url_img?.[0] || "/placeholder.png"} alt="" />
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{espacio.name}</span>
              <span className="text-sm text-gray-500">Capacidad Max: {espacio.pax}</span>
              <span className="text-sm text-gray-800">
                Tarifa: {espacio.is_partner ? "Socio" : "No Socio"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
