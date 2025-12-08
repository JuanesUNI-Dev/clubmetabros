// src/components/AdminComponents/ReservaEnProsDetails.jsx
'use client';

import React from "react";

export default function ReservaEnProsDetails({ reserva }) {
  if (!reserva) {
    return (
      <div className="text-center py-8 text-gray-500">
        Selecciona una reserva para ver los detalles
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-xl shadow-sm bg-white">
      <h2 className="text-xl font-semibold text-gray-700">
        Detalles de la Reserva #{reserva.id_reservation}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <span className="font-semibold">Cliente:</span> {reserva.name}
        </div>
        <div>
          <span className="font-semibold">Correo:</span> {reserva.email}
        </div>
        <div>
          <span className="font-semibold">Teléfono:</span> {reserva.phone_number}
        </div>
        <div>
          <span className="font-semibold">Espacio:</span> {reserva.name_space}
        </div>
        <div>
          <span className="font-semibold">Tipo de cliente:</span> {reserva.is_partner ? "Socio" : "No socio"}
        </div>
        <div>
          <span className="font-semibold">Estado:</span>{" "}
          <span className={
            reserva.status === "PENDIENTE" ? "text-yellow-600 font-bold" :
            reserva.status === "EN PROGRESO" ? "text-green-600 font-bold" :
            reserva.status === "RECHAZADA" ? "text-red-600 font-bold" : "text-gray-700 font-bold"
          }>
            {reserva.status}
          </span>
        </div>
        <div>
          <span className="font-semibold">Fecha inicio:</span> {new Date(reserva.init_date).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Fecha fin:</span> {new Date(reserva.end_date).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Pax:</span> {reserva.pax}
        </div>

        <div>
          <span className="font-semibold">Cotizacion automatica :</span> {reserva.estimated_value}
        </div>
        <div>
          <span className="font-semibold">Valor Abonado:</span> {reserva.amount}
        </div>
        <div>
          <span className="font-semibold">Valor total:</span> {reserva.total_value}
        </div>
        <div className="col-span-full">
          <span className="font-semibold">Extras:</span>{" "}
          {reserva.extras && reserva.extras.length > 0
            ? reserva.extras.map((e, i) => (
                <div key={i} className="ml-2">
                  {e.name} - Cantidad: {e.quantity}, Valor agregado: {e.value_add}
                </div>
              ))
            : "Sin extras"}
        </div>
      </div>
    </div>
  );
}
