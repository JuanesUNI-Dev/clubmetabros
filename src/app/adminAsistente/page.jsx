// src/app/admin/page.jsx
'use client'
import { useState } from 'react';
import { useRouter } from "next/navigation";

// LOGOS DE SIDEBAR LUCIDE
import { 
  Menu, ChevronRight, UserLock, House, BarChart3, HouseHeart, UserStar,Banana, LogOut , CalendarSearch , 
  CalendarCheck2, LayoutDashboard, PanelLeftOpen, PanelLeftClose, CalendarCheck,  CalendarHeart
} from "lucide-react";

// COMPONENTE PRINCIPAL
import Wrapper4060 from "@/components/AdminComponents/Wrapper4060.jsx";

// COMPONENTES DE ESPACIOS
import { EspacioDetails, ListaEspacios, AñadirEspacios, EspaciosEditForm} from "@/components/AdminComponents";

// COMPONENTES DE SOLICITUDES
import { SolicitudesDetails, ListaSolicitudes } from "@/components/AdminComponents";

// COMPONENTES DE PROCESOS
import { ProcesosDetails, ListaProcesos } from "@/components/AdminComponents";

// COMPONENTES DE RESERVAS EN PROGRESO
import { ReservaEnProsDetails, ListaReservaEnPros } from "@/components/AdminComponents";

// COMPONENTES DE RESERVAS
import { ReservasDetalles, ListaReservas } from "@/components/AdminComponents";

// COMPONENTES VARIOS
import ReportesPage from '@/components/AdminComponents/ReportsPage';
import {logout} from '@/lib/api/Auth/users.js';

// COMPONENTES DE USUARIOS
import { EmpleadoDetails, ListaEmpleados, AñadirEmpleado } from "@/components/AdminComponents";

// COMPONENTES DE SOCIOS
import { SociosDetails, ListaSocios, AñadirSocioForm} from "@/components/AdminComponents";

// COMPONENTES DE EXTRAS
import { ListaExtras, ExtrasDetails, AñadirExtraForm, ExtrasEditForm} from "@/components/AdminComponents";



// COMPONENTE PRINCIPAL
export default function AdminLayout() {
  const [openMobile, setOpenMobile] = useState(false);
  const [collapseDesktop, setCollapseDesktop] = useState(false);

  // Qué sección se muestra primero
  const [activePage, setActivePage] = useState("socios");

  // ESTADO DE ESPACIOS
  const [selectedEspacio, setSelectedEspacio] = useState(null);
  const [reloadEspacios, setReloadEspacios] = useState(false);

  // CONSTANTES PARA SOLICITUDES ⚡
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [reloadSolicitudes, setReloadSolicitudes] = useState(false);

  // ESTADO DE PROCESOS
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [reloadProcesos, setReloadProcesos] = useState(false);

  // ESTADO DE RESERVAS EN PROGRESO
  const [selectedReservaEnPros, setSelectedReservaEnPros] = useState(null);
  const [reloadReservaEnPros, setReloadReservaEnPros] = useState(false);

  // ESTADO DE RESERVAS
  const [selectedReserva, setSelectedReserva] = useState(null);

  // ESTADO DE USUARIOS
  const [selectedInterno, setSelectedInterno] = useState(null);

  // ESTADO DE SOCIOS
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [reloadSocios, setReloadSocios] = useState(false);

  // ESTADO DE EXTRAS
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [reloadExtras, setReloadExtras] = useState(false);


  // FUNCIONES DE ESPACIOS 
const refreshEspacios = () => {
    setReloadEspacios(prev => !prev); // cambia de true a false y fuerza el refetch
    setSelectedEspacio(null); // limpia el detalle
};

  // FUNCIONES DE SOLICITUDES
  const refreshSolicitudes = () => {
    setReloadSolicitudes(prev => !prev); // cambia de true a false y fuerza el refetch
    setSelectedSolicitud(null); // limpia el detalle
};

// FUNCIONES DE RESERVAS EN PROGRESO
  const refreshReservaEnPros = () => {
    setReloadReservaEnPros(prev => !prev); // cambia de true a false y fuerza el refetch
    setSelectedReservaEnPros(null); // limpia el detalle
};

  // FUNCIONES DE RESERVAS
  const refreshProcesos = () => {
    setReloadProcesos(prev => !prev); // cambia de true a false y fuerza el refetch
    setSelectedProceso(null); // limpia el detalle
};

// FUNCIONES DE SOCIOS
  const refreshSocios = () => {
    setReloadSocios(prev => !prev);  // fuerza reload
    setSelectedSocio(null);             // opcional

};

  const refreshExtras = () => {
    setReloadExtras(prev => !prev);  // fuerza reload
    setSelectedExtra(null);             // opcional
  
};


// FUNCION DE LOGOUT
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
  
  // ICONOS DE NAVEGACIÓN

  // Para detalles en móvil
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" }, // Quiero mostrar algunas estadisticas aqui, Puede ser reservas del mes por ejemplo
    { name: "Solicitudes de Reservas", icon: CalendarSearch, id: "solicitudes" }, // llegan las solicitudes de reserva desde Landing
    { name: "Solicitudes En Progreso", icon: CalendarCheck2, id: "proceso" }, // Hay contacto con el cliente, pero no se ha finalizado el pago
    { name: "Reservas Confirmadas", icon: CalendarHeart, id: "confirmacion" }, // Se ha pagado el 50% y se bloque el espacio para las fechas especificadas
    { name: "Reservas Finalizadas/Historial", icon: CalendarCheck, id: "reservas" }, // Se ha pagado el 100% y la reserva ya pasa al historial
    { name: "Reportes", icon: BarChart3, id: "reportes" },
    { name: "Volver al lobby", icon: House  , id: "lobby" },
    { name: "Cerrar Sesion", icon: LogOut , id: "logout"} 
    
  ];

  // MUESTRA LOS ICONOS DE NAVEGACIÓN EN BARRA LATERAL Y LAGUNAS FUNCIONES 
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
      
      // AQUI EMPIEZA LAS VISTAS DE SOLICITUDES 
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
                 onUpdate={() => {
                    refreshSolicitudes();     // vuelve a cargar lista ⚡
                    setShowDetailMobile(false); // vuelve a la lista en móvil
                }}
                />
              </div>
            )}

            {/* 💻 Desktop: Vista 40/60 */}
            <div className="hidden md:block w-full">
              <Wrapper4060
                leftPanel={
                  <ListaSolicitudes
                    reload={reloadSolicitudes}
                    onSelect={(reserva) => setSelectedSolicitud(reserva)}
                  />
                }
              >
                {selectedSolicitud ? (
                  <SolicitudesDetails
                    reserva={selectedSolicitud}
                    onUpdate={refreshSolicitudes}
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

      // EMPIEZA EL CASO DE PROCESO O RESERVAS EN PROGRESO
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
                 onUpdate={() => {
                 refreshProcesos();     // vuelve a cargar lista ⚡
                 setShowDetailMobile(false); // vuelve a la lista en móvil
                }}
              />
            </div>
          )}

          {/* 💻 Desktop: Vista 40/60 */}
          <div className="hidden md:block w-full">
            <Wrapper4060
              leftPanel={
                <ListaProcesos
                  reload={reloadProcesos}
                  onSelect={(reserva) => setSelectedProceso(reserva)}
                />
              }
            >
              <ProcesosDetails
                reserva={selectedProceso}
                onUpdate={refreshProcesos}
              />
            </Wrapper4060>
          </div>
        </>
      );

      case "confirmacion":
        return (
          <>
            {/* 📱 Mobile: SOLO lista cuando NO se ha seleccionado detalle */}
            {!showDetailMobile && (
              <div className="block md:hidden w-full">
                <ListaReservaEnPros
                  onSelect={(reservaEnPros) => {
                    setSelectedReservaEnPros(reservaEnPros);
                    setShowDetailMobile(true);
                  }}
                />
              </div>
            )}

            {/* 📱 Mobile: SOLO detalle */}
            {showDetailMobile && (
              <div className="block md:hidden w-full">
                <ReservaEnProsDetails
                 reservaEnPros={selectedReservaEnPros}
                 onBack={() => setShowDetailMobile(false)}
                 onUpdate={() => {
                    refreshReservaEnPros();     // vuelve a cargar lista ⚡
                    setShowDetailMobile(false); // vuelve a la lista en móvil
                }}
                />
              </div>
            )}

            {/* 💻 Desktop: Vista 40/60 */}
            <div className="hidden md:block w-full">
              <Wrapper4060
                leftPanel={
                  <ListaReservaEnPros
                    reload={reloadReservaEnPros}
                    onSelect={(reservaEnPros) => setSelectedReservaEnPros(reservaEnPros)}
                  />
                }
              >
                {selectedReservaEnPros ? (
                  <ReservaEnProsDetails
                    reservaEnPros={selectedReservaEnPros}
                    onUpdate={refreshReservaEnPros}
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
