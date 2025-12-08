// src/components/AdminComponents/ListaReservaEnPros.jsx
'use client';

import { useEffect, useState } from "react";
import { getLogs } from "@/lib/api/log_reservas/log_reservas.js"; // Asegúrate de crear este archivo API

export default function ListaReservaEnPros({ reload, onSelect }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    async function load() {
      const data = await getLogs();
      setReservas(data?.result ?? []);
      setLoading(false);
    }
    load();
  }, [reload]);

  const reservasEnProgreso = reservas;

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Cargando reservas...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Título y contador */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Reservas en Progreso</h2>
        <span className="text-amber-500 text-3xl font-bold">{reservasEnProgreso.length}</span>
      </div>

      {/* Lista de reservas */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[85vh]">
        {reservasEnProgreso.map((reserva) => (
          <button
            key={reserva.id_reservation}
            onClick={() => {
              setSelectedId(reserva.id_reservation);
              onSelect(reserva);
            }}
            className={`flex w-full items-center gap-4 p-3 rounded-xl border transition shadow-sm cursor-pointer ${
              selectedId === reserva.id_reservation
                ? "border-amber-500 bg-[#fff9e6]"
                : "border-gray-300 bg-white hover:bg-gray-100"
            }`}
          >
            <div className="flex flex-col text-left">
              <span className="font-semibold text-gray-800">
                Reserva #{reserva.id_reservation}
              </span>
              <span className="text-sm text-gray-500">Espacio: {reserva.espacio}</span>
              <span className="text-sm text-gray-500">Cliente: {reserva.name}</span>
              <span className="text-sm text-gray-400">
                Fecha: {new Date(reserva.init_date).toLocaleString()} -{" "}
                {new Date(reserva.end_date).toLocaleString()}
              </span>
              <span className="text-sm font-bold text-red-600">
                Estado: {reserva.status}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
