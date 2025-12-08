// src/components/EspacioDetail.jsx
import { useState, useEffect } from "react"; 
import { Users, DollarSign, Tag, Trash2, Pencil, NotebookPen  } from "lucide-react";
import TarifaEditForm from "@/components/AdminComponents/Espacios/TarifaEditForm"
import { deleteSpace } from "@/lib/api/spaces/spaces"; 
import { deleteRate, getRates } from "@/lib/api/rates/rates.js";
import RateCreateForm from "@/components/AdminComponents/Espacios/AñadirRates.jsx";
import EspaciosEditForm from "@/components/AdminComponents/Espacios/EspaciosEditForm";

export default function EspacioDetail({ espacio, onBack, onUpdate }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [showCreateRate, setShowCreateRate] = useState(false);
  const [realSpaceId, setRealSpaceId] = useState(null);
  const [isDeletingRate , setIsDeletingRate] = useState(false);
  const [showDeleteModalRate, setShowDeleteModalRate] = useState(false);
  const [showEditSpace, setShowEditSpace] = useState(false);



  // guardamos las tarifas
  const [tarifas, setTarifas] = useState([]);

  // cargar tarifas basadas en este espacio
  useEffect(() => {
  if (!espacio?.id_rate) return;

  async function loadRates() {
    const data = await getRates();
    if (!data?.result) return;

    const filtradas = data.result.filter(
      (rate) =>
        rate.espacio === espacio.name &&
        rate.is_partner === espacio.is_partner
    );

    if (filtradas.length > 0) {
      setRealSpaceId(filtradas[0].fk_space);
    }

    setTarifas(filtradas);
  }

  loadRates();
}, [espacio]);

async function reloadRates() {
  if (!espacio?.id_rate) return;

  const data = await getRates();
  if (!data?.result) return;

  const filtradas = data.result.filter(
    (rate) => rate.espacio === espacio.name && rate.is_partner === espacio.is_partner
  );

  if (filtradas.length > 0) {
    setRealSpaceId(filtradas[0].fk_space);
  }

  setTarifas(filtradas);
}

useEffect(() => {
  reloadRates();
}, [espacio]);


  if (!espacio) {
    return (
      <div className="text-gray-500 italic p-6">
        Selecciona un espacio para ver los detalles.
      </div>
    );
  }

  const formatCurrency = (value) =>
    Number(value).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });

  // 🟥 ELIMINAR ESPACIO
  const handleDelete = async () => {
    setIsDeleting(true);

    const res = await deleteSpace(espacio.name);

    setIsDeleting(false);
    setShowDeleteModal(false);

    if (res?.auth === false) {
      alert("No autorizado para eliminar este espacio.");
      return;
    }

    if (res?.success || res?.message) {
      alert("Espacio eliminado correctamente.");
      if (onUpdate) onUpdate();  // ← recargar lista
      if (onBack) onBack();
    } else {
      alert("Error al eliminar el espacio.");
    }
  };
// 🟥 ELIMINAR TARIFA TAMBIEN PARTE QUE QUIERO QUE FUNCIONE PERO NO SE COMO SACAR EL t.id_rate de ese nmap de abajo, puesto que la t.rate del seleccionado es el que quierborrar
    const handleDeleteRate = async () => {
    if (!selectedRate?.id_rate) {
      alert("No se pudo identificar la tarifa a eliminar.");
      return;
    }

    setIsDeletingRate(true);

    const res = await deleteRate(selectedRate.id_rate);

    setIsDeletingRate(false);
    setShowDeleteModalRate(false);

    if (res?.auth === false) {
      alert("No autorizado para eliminar esta tarifa.");
      return;
    }

    if (res?.success || res?.message) {
      alert("Tarifa eliminada correctamente.");

      // refrescamos la lista sin tener que cambiar de vista
      setTarifas((prev) =>
        prev.filter((r) => r.id_rate !== selectedRate.id_rate)
      );

      setSelectedRate(null);
    if (onUpdate) onUpdate();
    } else {
      alert("Error al eliminar la tarifa.");
    }
  };

  return (
    <div className="space-y-2 border rounded-xl p-6 bg-white shadow border-[rgb(210,190,160)] ">

      {/* 🟥 MODAL DE CONFIRMACIÓN */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)]  flex items-center justify-center z-999">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-700">
              ¿Eliminar Espacio?
            </h2>

            <p className="text-gray-600">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟥 MODAL DE CONFIRMACIÓN NUEVO QUE QUIERO IMPLEMENTAR PERO NO SALE BIEN*/}
      {showDeleteModalRate && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)]  flex items-center justify-center z-999">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-700">
              ¿Eliminar Esta Tarifa?
            </h2>

            <p className="text-gray-600">
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowDeleteModalRate(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeleteRate}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📱 Botón volver solo en mobile */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden mb-4 flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver
        </button>
      )}

      {/* FORMULARIO DE EDICIÓN */}
      {showEditSpace ? (
      <EspaciosEditForm
        espacio={espacio}
        onBack={() => setShowEditSpace(false)}
        onUpdated={() => {
          if (onUpdate) onUpdate();   // 👈 refresca lista global
          reloadRates();              // 👈 si la edición cambia pax o partner
          setShowEditSpace(false);
        }}
      />
      ): showEditForm ? (
      <TarifaEditForm
        rate={selectedRate}
        onCancel={() => {
          setSelectedRate(null);
          setShowEditForm(false);
        }}
        onUpdated={() => {
          reloadRates();  // 👈 recargar tarifas del espacio
          if (onUpdate) onUpdate();  // recargar lista global de espacios
          setShowEditForm(false);
        }}
      />

    ) : showCreateRate ? (
      <RateCreateForm
        espacio={{ ...espacio, realSpaceId }}
        onBack={() => setShowCreateRate(false)}
        onCreated={reloadRates}  // <-- aquí se pasa
      />

    ) : (
        <>
          {/* Imagen */}
          <div className="text-gray-600 flex flex-col md:flex-row md:justify-between md:items-center">
            <img
              className="rounded-2xl border-4 border-[rgb(210,190,160)] w-full h-auto max-w-full object-cover "
              src={espacio.url_img?.[0] || "/placeholder.png"}
              alt="IMAGEN_ESPACIO"
            />
          </div>

          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-gray-600 sm:text-2xl">
              {espacio.name}
            </h1>
            <div className={`flex justify-between p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)] font-bold text-2xl sm:scale-70
              ${espacio.is_partner === true ? "text-emerald-500" : "text-fuchsia-700"}
              `}>


              
              {`${espacio.is_partner === true ? "Socio" : "No Socio"}`}
              </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="font-bold text-xl text-gray-700 mb-2 flex items-center">
              <Tag size={20} className="mr-2 text-yellow-600" />
              Descripción
            </h3>
            <p className="p-4 bg-gray-50 rounded-lg text-gray-600 border border-[rgb(210,190,160)]">
              {espacio.descrip}
            </p>
          </div>

          {/* Capacidad + aliado */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
              <h3 className="font-bold text-lg text-gray-700 mb-1 flex items-center">
                <Users size={18} className="mr-2" />
                Capacidad Max
              </h3>
              <p className="text-3xl font-extrabold">{espacio.pax}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
              <h3 className="font-bold text-lg text-gray-700 mb-1">Tarifa Base del Espacio</h3>
              <p className="text-xl font-semibold"> 4 horas {formatCurrency(espacio.value_4_hours)}</p>
              <p className="text-xl font-semibold"> 8 horas {formatCurrency(espacio.value_8_hours)}</p>
            </div>

            
          </div>

          {/* Tarifas */}
          <div className="mt-6 border-t pt-4 border-[rgb(210,190,160)]">
            <h2 className="text-2xl text-gray-600 font-bold mb-3 flex items-center">
              <DollarSign size={24} className="mr-2 text-green-600" />
              Tarifas Segun Organizaciones
            </h2>

            <div className="space-y-3 bg-white p-4 rounded-lg border border-[rgb(210,190,160)] shadow-sm">

              {/* ←— NUEVA LISTA DE TARIFAS DINÁMICAS —→ */}
              {tarifas.length === 0 ? (
                <p className="text-gray-500 italic">Este espacio no tiene tarifas adicionales registradas.</p>
              ) : (
                tarifas.map((t) => (
                  <div
                    key={t.id_rate}
                    className="p-3 rounded-lg border border-[rgb(210,190,160)] bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-700">{t.tarifa}</span>
                      <span className="font-semibold text-green-600">#{t.id_rate}</span>
                    </div>

                    <p>4 horas: {formatCurrency(t.value_4_hours)}</p>
                    <p>8 horas: {formatCurrency(t.value_8_hours)}</p>
                    <p>Hora extra: {formatCurrency(t.value_extra_hour)}</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setShowEditForm(true);
                          setSelectedRate({
                            ...t,
                            espacio: espacio   
                          });
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-xl flex items-center gap-2 hover:bg-yellow-700 mt-2 cursor-pointer"
                      >
                        <Pencil size={18} />
                        Editar Tarifa Espacio
                      </button>
                    <button
                      onClick={() => {
                        setSelectedRate(t);   // ← Guarda la tarifa correcta
                        setShowDeleteModalRate(true);
                      }}
                      className="px-4 py-2 bg-red-700 text-white rounded-xl flex items-center gap-2 hover:bg-gray-600 mt-2 cursor-pointer"
                    >
                      <Trash2 size={18} />
                      Eliminar Tarifa
                    </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BOTONES */}
            <div className="flex gap-3 mt-5 container mx-auto justify-center">
              
              <button
                onClick={() => {
                setShowCreateRate(true); 
              }}

                className="px-4 py-2 bg-[rgb(41,145,67)] text-white rounded-xl flex items-center gap-2 hover:bg-[rgb(25,92,42)] cursor-pointer"
              >
                <NotebookPen  size={18} />
                Agregar Tarifa
              </button>

              <button
                onClick={() => setShowDeleteModal(true)} // ⬅️ abrir modal
                className="px-4 py-2 bg-red-700 text-white rounded-xl flex items-center gap-2 hover:bg-gray-600 cursor-pointer"
              >
                <Trash2 size={18} />
                Eliminar Espacio
              </button>
              
            </div>
            <div className="flex gap-3 mt-5 container mx-auto justify-center">
              <button
                onClick={() => setShowEditSpace(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-xl flex self-center gap-2 hover:bg-yellow-700 mt-2 cursor-pointer"
              >
                <Pencil size={18} />
                Editar Espacio Global
              </button>
              </div>
          </div>
        </>
      )}
    </div>
  );
}
