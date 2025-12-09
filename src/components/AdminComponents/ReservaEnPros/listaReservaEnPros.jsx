// src/components/AdminComponents/ListaProcesos.jsx
'use client';

import { useEffect, useState } from "react";
import { getReservas } from "@/lib/api/reservas/reservas";
import { getRates } from "@/lib/api/rates/rates";

export default function ListaReservaEnPros({ reload, onSelect }) {
  const [reservasEnPros, setreservasEnPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filterPartnerReservaEnPros, setfilterPartnerReservaEnPros] = useState("all"); 
  const [rates, setRates] = useState([]);

  useEffect(() => {
    setLoading(true);
    async function load() {
      const data = await getReservas();
      const r = await getRates();
      setRates(r?.result ?? []);
      setreservasEnPros(data?.result ?? []);
      setLoading(false);
    }
    load();
  }, [reload]);

  // FILTRO DE SOCIO / NO SOCIO
  const filteredProcesos = reservasEnPros.filter((e) => {
    if (filterPartnerReservaEnPros === "partner") return e.is_partner === true;
    if (filterPartnerReservaEnPros === "non-partner") return e.is_partner === false;
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

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="flex text-lg font-semibold text-gray-700">
          Solicitudes de Reservas en Progreso
        </h2>

        <h1 className="flex text-lg font-semibold text-gray-700">
          NUMERO EN PROGRESO:{" "}
          <span className="text-amber-500 text-5xl">
            {filteredProcesos.filter((e) => e.status === "EN PROGRESO").length}
          </span>
        </h1>
      </div>

      {/* LISTA */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 max-h-[85vh]">
        {filteredProcesos
          .filter((reservaEnPros) => reservaEnPros.status === "EN PROGRESO")
          .map((reservaEnPros) => {

            const rateInfo = rates.find(
              (rt) => rt.id_rate === reservaEnPros.fk_rate
            );

            return (
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
                    Espacio: {rateInfo?.espacio ?? "No asignado"}
                  </span>

                  <span className="text-sm text-gray-500">
                    Cliente: {reservaEnPros.name}
                  </span>

                  <span className="text-sm text-gray-400">
                    Fecha:{" "}
                    {new Date(reservaEnPros.init_date).toLocaleString()} -{" "}
                    {new Date(reservaEnPros.end_date).toLocaleString()}
                  </span>

                  <span
                    className={`text-sm font-bold ${
                      reservaEnPros.status === "PENDIENTE"
                        ? "text-yellow-600"
                        : reservaEnPros.status === "EN PROGRESO"
                        ? "text-green-600"
                        : reservaEnPros.status === "RECHAZADA"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    Estado: {reservaEnPros.status}
                  </span>
                </div>
              </button>
            );
          })}
      </div>

    </div>
  );
}
