// src/components/AdminComponents/SolicitudesDetails.jsx
'use client';

import { useState } from "react";
import { Check, X, ArrowLeft } from "lucide-react";
import { updateReservaStatus, deleteSolicitud } from "@/lib/api/solicitudes/solicitudes"; // crea esta función API

export default function SolicitudesDetails({ reserva, onBack, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmFifthModal, setshowConfirmFifthModal] = useState(false);

  if (!reserva) {
    return (
      <div className="text-gray-500 italic p-6">
        Selecciona una Solicitud de reserva para ver los detalles.
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await updateReservaStatus(reserva.id_request, reserva.email, newStatus);
      alert(`Reserva ${newStatus.toLowerCase()} correctamente`);
        // actualizar en la lista
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el estado de la reserva");
    } finally {
      onUpdate && onUpdate();
      setLoading(false);
    }
  };

  // Ejecuta la eliminación confirmada desde el modal
  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteSolicitud(reserva.id_request);
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      
    } finally {
      onUpdate && onUpdate();
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 border rounded-xl p-6 bg-white shadow border-[rgb(210,190,160)]">

      {/* Modal de confirmación para eliminar solicitud */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-700">¿Eliminar Solicitud?</h2>
            <p className="text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden mb-4 flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      )}

      {/* Datos de la reserva */}
      <h1 className="text-3xl font-bold text-gray-700">
        Solicitud #{reserva.id_request}
      </h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
          <h3 className="font-bold text-lg text-gray-700 mb-2">Cliente</h3>
          <p>{reserva.name}</p>
          <p className="text-sm text-gray-500 mt-3">{reserva.email}</p>
          <p className="text-sm text-gray-500 mt-3">{reserva.phone_number}</p>
          <p className="text-sm text-gray-500 mt-3">
            Tipo: {reserva.is_partner ? "Socio" : "No socio"}
          </p>
        </div>

        <div className="p-4 text bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
          <h3 className="font-bold text-lg text-gray-700 mb-2">Espacio</h3>
          <p>{reserva.espacio}</p>
          <p className="text-md text-gray-500 mt-2">Tarifa: <span className="font-extrabold">${reserva.value_aprox}</span></p>
          <p>Abono de 50%: <span className="font-extrabold">${reserva.value_aprox / 2}</span></p>
          <p className="text-sm text-gray-500 mt-2">Pax: {reserva.pax}</p>
          
          <p className="text-sm text-gray-500 ">
            Fecha: {new Date(reserva.init_date).toLocaleString()} - {new Date(reserva.end_date).toLocaleString()}
          </p>
        </div>

        <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
          <h3 className="font-bold text-lg text-gray-700 mb-2">Descripción</h3>
          <p>{reserva.description}</p>
        </div>

        <div className="md:col-span-2 flex gap-4 justify-center mt-4">
          <button
            disabled={loading || reserva.status === "EN PROGRESO"}
            onClick={() => handleStatusChange("EN PROGRESO")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white ${
              reserva.status === "EN PROGRESO"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <Check size={18} />
            Aceptar
          </button>

          <button
            disabled={loading || reserva.status === "RECHAZADA"}
            onClick={() => setShowDeleteModal(true)}
            className={`items-center gap-2 px-4 py-2 rounded-xl text-white  ${
              reserva.status === "RECHAZADA" || reserva.status === "EN PROGRESO"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <X size={18} />
            Rechazar/Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
