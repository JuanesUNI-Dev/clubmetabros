// src/app/admin/page.jsx

'use client'

// LIBRERIAS
import { useState } from 'react'
import { useRouter } from "next/navigation";

// LOGOS DE SIDEBAR LUCIDE
import { 
  Menu, ChevronRight,  House,  BarChart3,  UserStar, LogOut , CalendarSearch , 
  CalendarCheck2, LayoutDashboard, PanelLeftOpen, PanelLeftClose, CalendarCheck, 
} from "lucide-react";

// COMPONENTE PRINCIPAL
import {Wrapper4060} from "@/components/AdminComponents";

// COMPONENTES DE SOLICITUDES
import { SolicitudesDetails, ListaSolicitudes } from "@/components/AdminComponents";

// COMPONENTES DE RESERVAS
import { ReservasDetalles, ListaReservas } from "@/components/AdminComponents";

// COMPONENTES DE PROCESOS
import { ProcesosDetails, ListaProcesos } from "@/components/AdminComponents";

// COMPONENTES VARIOS
import ReportesPage from '@/components/AdminComponents/ReportsPage';
import {logout} from '@/lib/api/Auth/users.js';


export default function AdminLayout() {
  const [openMobile, setOpenMobile] = useState(false);
  const [collapseDesktop, setCollapseDesktop] = useState(false);

  // 🔥 ESTADO MÁS IMPORTANTE: Qué sección está activa
  const [activePage, setActivePage] = useState("solicitudes");

  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const [selectedProceso, setSelectedProceso] = useState(null);

  const [selectedReserva, setSelectedReserva] = useState(null);

  const router = useRouter();
  async function handleLogout() {
    const res = await logout();

    if (res.ok) {
      // El backend elimina la cookie httpOnly → cliente queda deslogueado
      router.push("/login"); // redirigir al login
    } else {
      alert("Error al cerrar sesión: " + res.data.message);
    }
  }



  

  // Para detalles en móvil
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" }, // Quiero mostrar algunas estadisticas aqui, Puede ser reservas del mes por ejemplo
    
    { name: "Solicitudes de Reservas", icon: CalendarSearch, id: "solicitudes" },
    { name: "Solicitudes En Progreso", icon: CalendarCheck2, id: "proceso" },
    { name: "Reservas Finalizadas/Pagas", icon: CalendarCheck, id: "reservas" },
    { name: "Reportes", icon: BarChart3, id: "reportes" },
    { name: "Volver al lobby", icon: House  , id: "lobby" },
    { name: "Cerrar Sesion", icon: LogOut , id: "logout"} 
    
  ];

  const renderLinks = (collapsed = false, extraStyles = "") => (
    <nav className={`flex flex-col gap-1 ${extraStyles} border-t-5 border-[rgb(210,190,160)] pt-4 `}>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = activePage === link.id;

        return (
          <button
            key={link.id}
            onClick={() => {
              if (link.id === "logout") {
                handleLogout();
              } else if (link.id === "lobby") {
                router.push("/");
              } else {
                setActivePage(link.id);
              }
            }}
            className={`flex items-center gap-3 p-2.5 rounded-lg 
              transition-colors text-sm font-medium group 
              border-l-4 cursor-pointer 
              ${isActive ? "border-[rgb(204,153,0)] bg-gray-150" : "border-transparent bg-gray-100 hover:bg-gray-150"}
            `}
          >
            <span className="text-gray-700 group-hover:text-black transition-colors">
              <Icon size={18} />
            </span>

            {!collapsed && (
              <span className="flex-1 text-left">
                {link.name}
              </span>
            )}

            {!collapsed && (
              <ChevronRight 
                size={16} 
                className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" 
              />
            )}
          </button>
        );
      })}
    </nav>
  );

  // ======================
  // 🔥 RENDER PRINCIPAL
  // ======================

  const renderMain = () => {
    switch (activePage) {

      

      case "dashboard":
        return <div>
          <h1 className=' flex text-center text-2xl'>BIENVENIDO A TU PANEL DE ADMINISTRADOR DEL CLUB EL META</h1>
          <p className='flex text-center text-lg pt-2.5'>Aqui puedes ver las estadisticas de tu club, asi como las solicitudes de reservas que han llegado</p>
          <p className='flex text-center text-lg pt-2.5'>Porfavor selecciona una de las opciones de la izquierda </p>
          </div>;

      case "solicitudes":
        return (
          <>
            {/* 📱 Mobile: SOLO lista cuando NO se ha seleccionado detalle */}
            {!showDetailMobile && (
              <div className="block md:hidden w-full">
                <ListaSolicitudes
                  onSelect={(reserva) => {
                    setSelectedSolicitud(reserva);
                    setShowDetailMobile(true);
                  }}
                />
              </div>
            )}

            {/* 📱 Mobile: SOLO detalle */}
            {showDetailMobile && (
              <div className="block md:hidden w-full">
                <SolicitudesDetails
                  reserva={selectedSolicitud}
                  onBack={() => setShowDetailMobile(false)}
                  onUpdate={(updatedReserva) => setSelectedSolicitud(updatedReserva)}
                />
              </div>
            )}

            {/* 💻 Desktop: Vista 40/60 */}
            <div className="hidden md:block w-full">
              <Wrapper4060
                leftPanel={
                  <ListaSolicitudes
                    onSelect={(reserva) => setSelectedSolicitud(reserva)}
                  />
                }
              >
                {selectedSolicitud ? (
                  <SolicitudesDetails
                    reserva={selectedSolicitud}
                    onUpdate={(u) => setSelectedSolicitud(u)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Selecciona una solicitud para ver sus detalles
                  </div>
                )}
              </Wrapper4060>
            </div>
          </>
        );

      case "proceso":
      return (
        <>
          {/* 📱 Mobile: SOLO lista cuando NO se ha seleccionado detalle */}
          {!showDetailMobile && (
            <div className="block md:hidden w-full">
              <ListaProcesos
                onSelect={(reserva) => {
                  setSelectedProceso(reserva);
                  setShowDetailMobile(true);
                }}
              />
            </div>
          )}

          {/* 📱 Mobile: SOLO detalle cuando SI hay reserva seleccionada */}
          {showDetailMobile && (
            <div className="block md:hidden w-full">
              <ProcesosDetails
                reserva={selectedProceso}
                onBack={() => setShowDetailMobile(false)}
                onUpdate={(updatedReserva) =>
                  setSelectedProceso(updatedReserva)
                }
              />
            </div>
          )}

          {/* 💻 Desktop: Vista 40/60 */}
          <div className="hidden md:block w-full">
            <Wrapper4060
              leftPanel={
                <ListaProcesos
                  onSelect={(reserva) => setSelectedProceso(reserva)}
                />
              }
            >
              <ProcesosDetails
                reserva={selectedProceso}
                onUpdate={(updatedReserva) =>
                  setSelectedProceso(updatedReserva)
                }
              />
            </Wrapper4060>
          </div>
        </>
      );
        
      case "reservas":
        return (
        <>
          {/* 📱 Mobile: SOLO lista cuando NO se ha seleccionado detalle */}
          {!showDetailMobile && (
            <div className="block md:hidden w-full">
              <ListaReservas
                onSelect={(reserva) => {
                  setSelectedReserva(reserva);
                  setShowDetailMobile(true);
                }}
              />
            </div>
          )}

          {/* 📱 Mobile: SOLO detalle cuando SI hay reserva seleccionada */}
          {showDetailMobile && (
            <div className="block md:hidden w-full">
              <ReservasDetalles
                reserva={selectedReserva}
                onBack={() => setShowDetailMobile(false)}
                onUpdate={(updatedReserva) =>
                  setSelectedReserva(updatedReserva)
                }
              />
            </div>
          )}

          {/* 💻 Desktop: Vista 40/60 */}
          <div className="hidden md:block w-full">
            <Wrapper4060
              leftPanel={
                <ListaReservas
                  onSelect={(reserva) => setSelectedReserva(reserva)}
                />
              }
            >
              <ReservasDetalles
                reserva={selectedReserva}
                onUpdate={(updatedReserva) =>
                  setSelectedReserva(updatedReserva)
                }
              />
            </Wrapper4060>
          </div>
        </>
      );
      
      case "reportes":
      return <ReportesPage />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 overflow-x-hidden">
      
      {/* NAVBAR */}
      <header className={`sticky top-0 z-50 w-full h-14 border-4 border-[rgb(210,190,160)] bg-white 
      flex items-center px-5 justify-between shadow-sm backdrop-blur-md`}>
        
        <div className="flex items-center gap-3">

          <button
            className="hidden md:flex p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setCollapseDesktop(!collapseDesktop)}
          >
            {collapseDesktop ? <PanelLeftOpen size={22} /> : <PanelLeftClose size={22} />}
          </button>

          <img 
            src="/logos/logoMeta.png"
            alt="Corporacion Club El Meta"
            className="h-10 w-auto mr-2"
          />

          <h1 className="text-lg font-semibold tracking-tight">Panel Administrativo</h1>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpenMobile(!openMobile)}
        >
          <Menu size={22} />
        </button>
      </header>

      <div className="flex flex-1">
        {/* SIDEBAR MÓVIL */}
      {openMobile && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpenMobile(false)}>
          <aside
            className="w-64 h-full bg-white p-6 shadow-xl border-r-4 border-[rgb(210,190,160)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-700 mb-4">Administración</h2>

            {renderLinks(false, "flex flex-col gap-2")}
          </aside>
        </div>
      )}

        {/* SIDEBAR */}
        <aside
          className={`hidden md:flex sticky top-14 z-40 flex-col border-r-4 
          border-[rgb(210,190,160)] bg-white p-4 gap-4 shadow-sm transition-all duration-300
          ${collapseDesktop ? "w-20" : "w-64"}`}
        >
          {!collapseDesktop && (
            <h2 className="text-base font-semibold text-gray-700 mb-1">Administración</h2>
          )}
          {renderLinks(collapseDesktop)}
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 p-6 bg-white flex gap-4">
          {renderMain()}
        </main>

      </div>
    </div>
  );
}
