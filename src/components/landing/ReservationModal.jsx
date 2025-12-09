// src/components/landing/ReservationModal.jsx
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

import DailyScheduler from "./DailyScheduler";
import { getPrice, registerSolicitud } from "@/lib/api/solicitudes/solicitudes";

import { verifyPartner as apiVerifyPartner } from "@/lib/api/partners/partners";

export default function ReservationModal({ space, isOpen, onClose }) {
  if (!isOpen || !space) return null;

  const [step, setStep] = useState(1);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);
  const tarifas = space.tarifas || [];

  const [form, setForm] = useState({
    v_tittle: "",
    v_description: "",
    v_name:  "",
    v_email: "",
    v_phone_number: "",
    v_is_partner: false,
    v_pax: "",
    v_fk_rate: null,
  });

  const [partnerPass, setPartnerPass] = useState("");
  const [isPartnerVerified, setIsPartnerVerified] = useState(false);

  // Reset al cambiar de espacio
  useEffect(() => {
    setForm(prev => ({ ...prev, v_fk_rate: null }));
    setPrice(null);
    setSchedule(null);
    setIsPartnerVerified(false);
    setStep(1);
  }, [space]);

  // Filtrar tarifas según socio o no socio
  const tarifasFiltradas = tarifas.filter(t => t.is_partner === form.v_is_partner);

  // Seleccionar primera tarifa válida
  useEffect(() => {
    if (tarifasFiltradas.length > 0) {
      setForm(prev => ({ ...prev, v_fk_rate: tarifasFiltradas[0].id_rate }));
    }
  }, [form.v_is_partner]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleVerifyPartner = async () => {
    try {
      const res = await apiVerifyPartner(partnerPass.toString());
      if (res?.result) {
        setForm(prev => ({ ...prev, v_is_partner: true }));
        setIsPartnerVerified(true);
        setStep(3);
      } else {
        alert("Contraseña incorrecta");
      }
    } catch (error) {
      console.error(error);
      alert("Error al verificar socio");
    }
  };

  const calculatePrice = async () => {
    if (!schedule || !form.v_fk_rate) return;

    try {
      const res = await getPrice({
        v_init_date: `${schedule.date}T${schedule.start}:00.000Z`,
        v_end_date: `${schedule.date}T${schedule.end}:00.000Z`,
        v_fk_rate: Number(form.v_fk_rate),
      });

      if (res?.result?.calculate_value != null) {
        setPrice(Number(res.result.calculate_value));
      } else {
        console.warn("Precio no devuelto correctamente:", res);
        setPrice(0);
      }
    } catch (error) {
      console.error("Error calculando precio:", error);
      setPrice(0);
    }
  };

  const handleSubmit = async () => {
    if (!schedule || !form.v_fk_rate) return;

    setLoading(true);

    const payload = {
      ...form,
      v_init_date: `${schedule.date}T${schedule.start}:00.000Z`,
      v_end_date: `${schedule.date}T${schedule.end}:00.000Z`,
      v_fk_rate: Number(form.v_fk_rate),
      v_pax: Number(form.v_pax),
      v_value: price,
    };

    try { 
      const res = await registerSolicitud(payload);
      console.log("Payload registerSolicitud:", payload);
      console.log("Respuesta registerSolicitud:", res);

      // ⛔ Si ocurre este error, NO mostrar alert, solo cerrar
      const errorSilenciado = "Cannot read properties of undefined (reading 'name')";

      if (res?.message === errorSilenciado) {
        onClose();     // acción silenciosa
        return;        // detener ejecución para no pasar al alert
      }

      // Si hay algún otro mensaje normal (éxito o error)
      if (res?.message) {
        alert(res.message);
        onClose();
      } else {
        alert("Error registrando la solicitud.");
      }

    } catch (error) {
      console.error("Error en registerSolicitud:", error);
      alert("Error registrando la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] text-black"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden p-4"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Reservar: {space?.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X />
          </button>
        </div>

        {/* PASO 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Selecciona la fecha y horario</h3>
            <DailyScheduler
              spacename={space?.name}
              onSelect={(s) => { setSchedule(s); setPrice(null); }}
            />
            <div className="flex justify-end mt-4">
              <button
                disabled={!schedule}
                onClick={() => setStep(2)}
                className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ${!schedule ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">¿Eres socio?</h3>
            <input
              type="text"
              placeholder="Ingresa tu contraseña de socio"
              className="w-full border p-2 rounded"
              value={partnerPass}
              onChange={(e) => setPartnerPass(e.target.value)}
            />
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Atrás</button>
              <button onClick={handleVerifyPartner} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Validar socio</button>
              <button onClick={() => { setForm(prev => ({ ...prev, v_is_partner: false })); setStep(3); }} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">No soy socio</button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();

              // Verifica si el formulario actual es válido
              const isValid = e.target.checkValidity();

              if (!isValid) {
                // Fuerza al navegador a mostrar mensajes nativos
                e.target.reportValidity();
                return;
              }

              // Si pasa todas las validaciones → avanzar
              setStep(4);
            }}
          >
            <h3 className="font-semibold text-lg">Datos del evento</h3>

            <div className="space-y-2">

              <input
                maxLength={10}
                required
                name="v_tittle"
                placeholder="Título del evento"
                className="w-full border p-2 rounded"
                value={form.v_tittle}
                onChange={handleChange}
              />

              <textarea
                maxLength={500}
                required
                name="v_description"
                placeholder="Descripción"
                className="w-full border p-2 rounded"
                value={form.v_description}
                onChange={handleChange}
              />

              <input
                maxLength={20}
                required
                name="v_name"
                placeholder="Nombre"
                className="w-full border p-2 rounded"
                value={form.v_name}
                onChange={handleChange}
              />

              <input
                type="email"
                required
                name="v_email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={form?.v_email || ""}
                onChange={handleChange}
              />

              <input
                type="tel"
                required
                name="v_phone_number"
                placeholder="Teléfono"
                className="w-full border p-2 rounded"
                value={form.v_phone_number}
                onChange={handleChange}
              />

              <input
                type="number"
                required
                name="v_pax"
                placeholder="Personas"
                className="w-full border p-2 rounded"
                value={form.v_pax}
                onChange={handleChange}
              />

              {tarifasFiltradas.length > 0 && (
                <div>
                  <label className="block font-semibold mb-1">Tarifas disponibles:</label>
                  <select
                    name="v_fk_rate"
                    required
                    value={form.v_fk_rate || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Seleccione una tarifa</option>
                    {tarifasFiltradas.map(rate => (
                      <option key={rate.id_rate} value={rate.id_rate}>
                        {rate.tarifa} — {rate.value_4_hours} (4h) / {rate.value_8_hours} (8h)
                      </option>
                    ))}
                  </select>
                </div>
              )}

            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Atrás
              </button>

              {/* BOTÓN SUBMIT para que active las validaciones */}
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Siguiente
              </button>
            </div>
          </form>
        )}

        {/* PASO 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Resumen</h3>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p><b>Fecha:</b> {schedule?.date}</p>
              <p><b>Inicio:</b> {schedule?.start}</p>
              <p><b>Fin:</b> {schedule?.end}</p>
              {price != null && <p className="text-lg font-semibold mt-2">Precio estimado: ${price.toLocaleString()}</p>}
              <button onClick={calculatePrice} className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mt-3">Calcular Precio</button>
            </div>
            <div className="flex justify-between">
              <button onClick={() => {setStep(3), setPrice(null)}   } 
                
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Atrás</button>
              <button onClick={handleSubmit} disabled={loading} className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>
                {loading ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
