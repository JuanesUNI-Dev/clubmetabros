// src/components/AdminComponents/ListaInternos.jsx
'use client';

import { useEffect, useState } from "react";
import { getInternos } from "@/lib/api/Auth/users.js"; // tú creas esta función api

export default function ListaInternos({ onSelect }) {
  const [internos, setInternos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getInternos();

      console.log("Internos cargados:", data);

      setInternos(data?.result ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cargando empleados...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-700">
        Empleados registrados
      </h2>
        <button
        onClick={() => onSelect({ new: true })}
        className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
        + Agregar
        </button>
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[85vh]">
        {internos.map((interno) => (
          <button
            key={interno.id_employee}
            onClick={() => {
              setSelectedId(interno.id_employee);
              onSelect(interno);
            }}
            className={`flex w-full items-center gap-4 p-3 rounded-xl border transition shadow-sm cursor-pointer
              ${
                selectedId === interno.id_employee
                  ? "border-amber-500 bg-[#fff9e6]"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }
            `}
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-gray-800">
                {interno.name}
              </span>

              <span className="text-sm text-gray-500">
                Rol: {interno.rol}
              </span>

              <span className="text-sm text-gray-400">
                Email: {interno.email}
              </span>

              <span className="text-xs text-gray-400">
                Creado: {new Date(interno.created_at).toLocaleString()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
