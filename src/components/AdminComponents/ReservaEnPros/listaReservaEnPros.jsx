// src/components/AdminComponents/ListaProcesos.jsx
'use client';

import { useEffect, useState } from "react";
import { getReservas } from "@/lib/api/reservas/reservas"; // Asegúrate de crear este archivo API
import {getRates} from "@/lib/api/rates/rates";

export default function ListaReservaEnPros({ reload, onSelect }){
  const [reservasEnPros, setreservasEnPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filterPartnerReservaEnPros, setfilterPartnerReservaEnPros] = useState("all"); 
// "all" | "partner" | "non-partner"

  useEffect(() => {
    setLoading(true);
    async function load() {
      const data = await getReservas();
      console.log("Espacios cargados:", data);
      setreservasEnPros(data?.result ?? []);
      setLoading(false);
    }
    load();
}, [reload]);

const filteredProcesos = reservasEnPros.filter((e) => {
  if (filterPartnerReservaEnPros === "partner") return e.is_partner === true;
  if (filterPartnerReservaEnPros === "non-partner") return e.is_partner === false;
  return true; // all
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
        <h2 className="flex text-lg font-semibold text-gray-700">Solicitudes de Reservas en Progreso</h2>
        <h1 className="flex text-lg font-semibold text-gray-700">NUMERO EN PROGRESO: <span className="text-amber-500 text-5xl"> {filteredProcesos.filter((e) => e.status === "EN PROGRESO").length}</span></h1>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600 font-semibold">Filtrar:</span>

        <button
          onClick={() => setfilterPartnerReservaEnPros("all")}
          className={`px-2 py-1 text-xs rounded-lg border 
            ${filterPartnerReservaEnPros === "all" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          Todos
        </button>

        <button
          onClick={() => setfilterPartnerReservaEnPros("partner")}
          className={`px-2 py-1 text-xs rounded-lg border 
            ${filterPartnerReservaEnPros === "partner" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          Socios
        </button>

        <button
          onClick={() => setfilterPartnerReservaEnPros("non-partner")}
          className={`px-2 py-1 text-xs rounded-lg border 
            ${filterPartnerReservaEnPros === "non-partner" ? "bg-amber-500 text-white" : "bg-white"}`}
        >
          No socios
        </button>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[85vh]">
        {filteredProcesos.filter((reservaEnPros) => reservaEnPros.status === "EN PROGRESO").map((reservaEnPros) => (
        <button
            key={reservaEnPros.id_reservation}
            onClick={() => {
            setSelectedId(reservaEnPros.id_reservation);
            onSelect(reservaEnPros);
            }}
            className={`flex w-full items-center gap-4 p-3 rounded-xl border transition shadow-sm cursor-pointer
            ${
                selectedId === reservaEnPros.id_reservation
                ? "border-amber-500 bg-[#fff9e6]"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }
            `}
        >
            <div className="flex flex-col text-left">
            <span className="font-semibold text-gray-800">
                Reserva #{reservaEnPros.id_reservation}
            </span>

            <span className="text-sm text-gray-500">
                Espacio: {reservaEnPros.espacio}
            </span>

            <span className="text-sm text-gray-500">
                Cliente: {reservaEnPros.name}
            </span>

            <span className="text-sm text-gray-500">
                Tipo: {reservaEnPros.is_partner ? "Socio" : "No socio"}
            </span>

            <span className="text-sm text-gray-400">
                Fecha: {new Date(reservaEnPros.init_date).toLocaleString()} - {new Date(reservaEnPros.end_date).toLocaleString()}
            </span>

            <span className={`text-sm font-bold ${
                reservaEnPros.status === "PENDIENTE" ? "text-yellow-600" :
                reservaEnPros.status === "EN PROGRESO" ? "text-green-600" :
                reservaEnPros.status === "RECHAZADA" ? "text-red-600" : ""}`}>
                Estado: {reservaEnPros.status}
            </span>
            </div>
        </button>
        ))}

      </div>
    </div>
  );
}
