// src/components/AdminComponents/SolicitudesDetails.jsx
'use client';

import { useState } from "react";
import { X, ArrowLeft, Pencil } from "lucide-react";
import { updateReservaStatus, deleteSolicitud } from "@/lib/api/solicitudes/solicitudes";
import { registerReserva } from "@/lib/api/reservas/reservas";
import ReservaCreateForm from "@/components/AdminComponents/Procesos/ReservaCreateForm";


export default function ProcesosDetails({ reserva, onBack, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showConfirmVerifyModal, setShowConfirmVerifyModal] = useState(false);
  const [showProcesoDeleteModal, setShowProcesoDeleteModal] = useState(false);
  const [showEditReservation, setShowEditReservation] = useState(false);


  if (!reserva) {
    return (
      <div className="text-gray-500 italic p-6">
        Selecciona una Solicitud de reserva para ver los detalles.
      </div>
    );
  }

  const handleConfirmDeleteProceso = async () => {
      setLoading(true);
      try {
        await deleteSolicitud(reserva.id_request);
        setShowProcesoDeleteModal(false);
      } catch (err) {
        console.error(err);
        
      } finally {
        onUpdate && onUpdate();
        setLoading(false);
      }
    };

    async function handleReservaCreada() {
    try {
      setLoading(true);

      await deleteSolicitud(reserva.id_request);

      if (onUpdate) onUpdate(); // refresca lista

      setShowEditReservation(false); // cierra pantalla
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="" >

      {showEditReservation ? (
      <ReservaCreateForm
        reserva={reserva}
        onBack={() => setShowEditReservation(false)}
        onCreated={handleReservaCreada}  // SOLO ESTA PROP SE USA
      />

    ) : (
      <div className="space-y-6 border rounded-xl p-6 bg-white shadow border-[rgb(210,190,160)]">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden mb-4 flex items-center gap-2 text-gray-700 hover:text-black"
          >
            <ArrowLeft size={18} />
            Volver
          </button>
        )}

        <h1 className="text-3xl font-bold text-gray-700">
          Solicitud en Progreso #{reserva.id_request}
        </h1>

        <div className="grid md:grid-cols-2 gap-4">

          {/* Cliente */}
          <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
            <h3 className="font-bold text-lg text-gray-700 mb-2">Cliente</h3>
            <p>{reserva.name}</p>
            <p className="text-sm text-gray-500 mt-3">{reserva.email}</p>
            <p className="text-sm text-gray-500 mt-3">{reserva.phone_number}</p>
            <p className="text-sm text-gray-500 mt-3">
              Tipo: {reserva.is_partner ? "Socio" : "No socio"}
            </p>
          </div>

          {/* Espacio */}
          <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
            <h3 className="font-bold text-lg text-gray-700 mb-2">Espacio</h3>
            <p>{reserva.espacio}</p>
             <p className="text-md text-gray-500 mt-2">VALOR APROX: <span className="font-extrabold">${reserva.value_aprox}</span></p>
            <p className="text-sm text-gray-500">PERSONAS: {reserva.pax}</p>
            <p className="text-sm text-gray-500">
              Fecha: {new Date(reserva.init_date).toLocaleString()} -{" "}
              {new Date(reserva.end_date).toLocaleString()}
            </p>
          </div>

          {/* Descripción */}
          <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
            <h3 className="font-bold text-lg text-gray-700 mb-2">Descripción</h3>
            <p>{reserva.description}</p>
          </div>

          {/* BOTONES */}
          <div className="md:col-span-2 flex gap-4 justify-center mt-4">

            {/* Verificar (Registrar reserva real) */}
            <button
              disabled={loading}
              onClick={() => setShowConfirmVerifyModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-green-600 hover:bg-green-700"
            >
              <Pencil size={18} />
              Aceptar Reserva
            </button>

            {/* Eliminar solicitud */}
            <button
              disabled={loading}
              onClick={() => setShowProcesoDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700"
            >
              <X size={18} />
              Eliminar Solicitud
            </button>
          </div>

          {/* Editar */}
          <div className="md:col-span-2 flex justify-center mt-4">
            
          </div>
        </div>
      </div>
      )}
      {/* MODAL DE ELIMINACIÓN DE RESERVA */}
      {showProcesoDeleteModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-700">¿Eliminar Solicitud?</h2>
            <p className="text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowProcesoDeleteModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmDeleteProceso}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirmVerifyModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)] flex items-center justify-center z-999">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-700">
              ¿Verificar esta reserva?
            </h2>

            <p className="text-gray-600">
              ¿Confirma que el cliente ya abono a la reserva?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowConfirmVerifyModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  setShowEditReservation(true);
                  setShowConfirmVerifyModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </ div >
  );
}
