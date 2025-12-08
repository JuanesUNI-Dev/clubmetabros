// src/components/AdminComponents/ListaSolicitudes.jsx
'use client';

import { useEffect, useState } from "react";
import { getSolicitudes } from "@/lib/api/solicitudes/solicitudes";

export default function ListaSolicitudes({ reload, onSelect }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const [filterPartnerSolicitudes, setFilterPartnerSolicitudes] = useState("all");
  // "all" | "partner" | "non-partner"

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    async function load() {
      const data = await getSolicitudes();
      console.log("Espacios cargados:", data);
      if (!mounted) return;

      const items = data?.result ?? [];
      setReservas(items);
      setLoading(false);

      // Verificar si el elemento seleccionado sigue existiendo
      setSelectedId(prev => {
        if (!prev) return null;
        const exists = items.some(i => i.id_request === prev);
        return exists ? prev : null;
      });
    }

    load();

    return () => { mounted = false };
  }, [reload]);

  // Si recargamos, limpiamos selección
  useEffect(() => {
    setSelectedId(null);
  }, [reload]);

  const filteredSolicitudes = reservas.filter((e) => {
    if (filterPartnerSolicitudes === "partner") return e.is_partner === true;
    if (filterPartnerSolicitudes === "non-partner") return e.is_partner === false;
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Cargando reservas...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex text-lg font-semibold text-gray-700">Solicitudes de Reservas</h2>
        <h1 className="flex text-lg font-semibold text-gray-700">NUMERO DE PENDIENTES: <span className="text-amber-500 text-5xl"> {filteredSolicitudes.filter((e) => e.status === "PENDIENTE").length}</span></h1>
      </div>
      

      {/* FILTROS */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600 font-semibold">Filtrar:</span>

        <button
          onClick={() => setFilterPartnerSolicitudes("all")}
          className={`px-2 py-1 text-xs rounded-lg border 
              ${filterPartnerSolicitudes === "all" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          Todos
        </button>

        <button
          onClick={() => setFilterPartnerSolicitudes("partner")}
          className={`px-2 py-1 text-xs rounded-lg border 
              ${filterPartnerSolicitudes === "partner" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          Socios
        </button>

        <button
          onClick={() => setFilterPartnerSolicitudes("non-partner")}
          className={`px-2 py-1 text-xs rounded-lg border 
              ${filterPartnerSolicitudes === "non-partner" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          No socios
        </button>
      </div>

      {/* LISTA */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[85vh]">
        {filteredSolicitudes
          .filter(r => r.status === "PENDIENTE")
          .map(reserva => (
            <button
              key={reserva.id_request}
              onClick={() => {
                setSelectedId(reserva.id_request);
                onSelect(reserva);
              }}
              className={`flex w-full items-center gap-4 p-3 rounded-xl border transition shadow-sm cursor-pointer
                ${selectedId === reserva.id_request
                  ? "border-amber-500 bg-[#fff9e6]"
                  : "border-gray-300 bg-white hover:bg-gray-100"}
              `}
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-gray-800">
                  Reserva #{reserva.id_request}
                </span>

                <span className="text-sm text-gray-500">
                  Espacio: {reserva.espacio}
                </span>

                <span className="text-sm text-gray-500">
                  Cliente: {reserva.name}
                </span>

                <span className="text-sm text-gray-500">
                  Tipo: {reserva.is_partner ? "Socio" : "No socio"}
                </span>

                <span className="text-sm text-gray-400">
                  Fecha: {new Date(reserva.init_date).toLocaleString()} –{" "}
                  {new Date(reserva.end_date).toLocaleString()}
                </span>

                <span className="text-sm font-bold text-yellow-600">
                  Estado: {reserva.status}
                </span>
              </div>
            </button>
          ))
        }
      </div>
    </div>
  );
}
