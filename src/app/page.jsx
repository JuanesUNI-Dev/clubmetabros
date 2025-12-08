// src/app/page.jsx
// Esta es la página principal de la landing page (Ruta: /)

'use client';
import { useState, useEffect } from 'react'; // Importamos useEffect para la lógica del carrusel
import { 
    Calendar, Theater, Handshake, Users, Zap, Feather,
} from 'lucide-react';
// Importamos los componentes modulares usando ruta relativa corregida (¡SOLUCIONADO!)

import { Navbar} from '@/components/landing/ComponentesUI.jsx';
import { VenueCard } from '@/components/landing/VenueCard.jsx';
import SpaceGridCard from '@/components/landing/SpaceGridCard';
import SpaceDetailsModal from '@/components/landing/SpaceDetailsModals';
import ReservationModal from "@/components/landing/ReservationModal.jsx";

import Ubication from '@/components/landing/Ubication';
import { getSpaces } from '@/lib/api/spaces/spaces';
import { getRates } from '@/lib/api/rates/rates.js';
import { mergeSpacesAndRates } from '@/lib/utils/testMerge';


// --- Datos para las tarjetas (Mejor mantenerlos aquí, cerca de la página que los usa) ---
const venueData = [
    { 
        icon: 'Theater', 
        title: 'Salón de Eventos "Mi Llanurita" ', 
        description: "Espacio de lujo con capacidad para 100 personas. Ideal para bodas, conferencias y galas. Reserva por horas. Te ayudamos con la organización completa si lo deseas." 
    },
    { 
        icon: 'Handshake', 
        title: "Canchas Deportivas y Espacios Privados", 
        description: "¿Quieres reservar espacios como las canchas de tenis, fútbol, piscina o el gimnasio?. ¡Considera volverte socio de nuestro club!" 
    },
    { 
        icon: 'Users', 
        title: "Servicios de Organización de Eventos", 
        description: "Distintos servicios de organizacion y contactos con djs, decoradores, floristerias y mas para que tu evento sea inolvidable." 
    },
];

// URLs para el carrusel de imágenes de fondo
const heroImages = [
    { url: 'salones/llanuritaNoche.jpeg', title: 'Vive tu evento al 100' },
    { url: 'salones/llanuritaDia.jpeg', title: 'Espacios ideales para tus eventos' }, 
    { url: 'salones/llanuritaDia2.jpeg', title: '75 años de experiencia en servirte' },
    { url: 'salones/Balcon1.PNG', title: 'Disfruta de la mejor gastronomía' },
];




// Componente principal de la página
export default function LandingPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // Renombrado para claridad
  const [currentSlide, setCurrentSlide] = useState(0); // Estado para el carrusel
  const [selectedSpace, setSelectedSpace] = useState(null); // Estado para el Modal de Detalles (el que te molestaba)
  const [bookingSpace, setBookingSpace] = useState(null); // Estado para pasar al ReservationModal
  const [espacios, setEspacios] = useState([]); // Aquí guardaremos los espacios mergeados



// 1. Handler para abrir la modal de Agendamiento (llamado desde Hero/CTA)
  const handleGlobalBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  // 2. Handler para ABRIR el Details Card (llamado desde SpaceGridCard)
  const handleSpaceClick = (space) => {
    setSelectedSpace(space); // Guarda el espacio seleccionado. Si no es null, el modal se muestra.
  };

  // 3. Handler para Agendar desde el Details Card (cierra detalles, abre booking)
  const handleBookFromDetails = (space = null) => {
    // Si se pasa un espacio, lo usamos para la reserva; si no, abrimos el modal sin espacio preseleccionado
    console.log(space)
    setBookingSpace(space);
    setIsBookingModalOpen(true); // Abre el modal de agendamiento
  };
    
    // Función de CIERRE unificada para el Details Card
    const closeSpaceDetails = () => {
        setSelectedSpace(null); // Al ser null, el modal se oculta
    }

  

  // Lógica del carrusel: cambia la diapositiva automáticamente cada 5 segundos
  useEffect(() => {
    const slideInterval = setInterval(() => {
        setCurrentSlide(prevSlide => 
            (prevSlide + 1) % heroImages.length
        );
    }, 5000); // Cambia cada 5000ms (5 segundos)

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(slideInterval);
  }, []); // El array vacío asegura que solo se ejecute una vez al montar

  // Obtenemos los datos de la diapositiva actual
  const currentHero = heroImages[currentSlide];

  useEffect(() => {
  async function load() {
    try {
      const resSpaces = await getSpaces(); 
      const resRates = await getRates();

      const merged = mergeSpacesAndRates(resSpaces.result, resRates.result);

      setEspacios(merged);
      console.log("ESPACIOS CONSOLIDADOS:", merged);

    } catch (error) {
      console.error("Error:", error);
    }
  }

  load();
}, []);


  return (
    <>
      <Navbar />

      {/* 1. Sección Hero - Carrusel */}
      <section id='inicio'
        className="relative h-screen flex items-center justify-center text-center p-4 transition-all duration-1000 ease-in-out"
        // Estilo de fondo dinámico
        style={{ 
          backgroundImage: `url('${currentHero.url}')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        {/* Overlay con azulOscuro y opacidad */}
        <div className="absolute inset-0 bg-[rgb(34,26,4)] opacity-55 transition duration-1000"></div> {/* Opacidad ligeramente reducida para destacar la imagen */}
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl lg:text-7xl font-extrabold text-[rgb(235,224,209)] mb-4 leading-tight transition-opacity duration-1000 md:text-4xl">
            {/* El título es dinámico, reflejando el foco de la imagen actual */}
            {currentHero.title} <span className="text-[rgb(173,216,230)]">~Club El Meta</span>
          </h1>
          <p className="text-xl text-[rgb(235,224,209)] opacity-90 mb-8 transition-opacity duration-1000">
            Reserva fácilmente tus citas y espacios privados: desde canchas deportivas hasta salones para eventos exclusivos.
          </p>
          {/* Botón CTA principal con Mostaza */}
          <a
            href='#espacios'
            className="inline-flex items-center px-10 py-4 text-lg bg-[rgb(204,153,0)] text-[rgb(25,50,90)] font-bold rounded-full shadow-2xl hover:bg-opacity-90 transition duration-300 transform hover:scale-105 flex items-center mx-auto md:scale-70"
          >
            <Calendar className="mr-3" size={24} />
            Agendar Mi Cita Ahora
          </a>
        </div>
        
        {/* Indicadores del Carrusel (Dots) */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {heroImages.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                            ? 'bg-[rgb(173,216,230)] w-8' // Azul Pastel si está activo, y más ancho
                            : 'bg-white opacity-50' // Blanco semi-transparente si está inactivo
                    }`}
                    aria-label={`Ir a diapositiva ${index + 1}`}
                />
            ))}
        </div>
      </section>

      {/* 2. Sección de Lugares y Servicios - Fondo beigeClaro (viene del layout) */}
      <section id="lugares" className="py-20 bg-[rgba(255,255,255,0.95)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* Texto en azulOscuro */}
            <h2 className="text-4xl font-extrabold text-[rgb(60,58,71)] mb-4">¿Que Podemos Ofrecer?</h2>
            <p className="text-xl text-[rgba(60,58,71,0.87)] opacity-70 max-w-2xl mx-auto">
              Descubre y reserva el lugar perfecto para cada ocasión. Todo a tu alcance con un solo clic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mapeo de los datos para renderizar las tarjetas */}
            {venueData.map((venue, index) => {
                 // Lucide React requiere un componente, no un string. Usamos un switch simple:
                let IconComponent;
                switch (venue.icon) {
                    case 'Theater': IconComponent = Theater; break;
                    case 'Handshake': IconComponent = Handshake; break;
                    case 'Users': IconComponent = Users; break;
                    default: IconComponent = Users;
                }

                return (
                    <VenueCard
                        key={index}
                        icon={IconComponent}
                        title={venue.title}
                        description={venue.description }
                    />
                );
            })}
          </div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: 3. Grid de Espacios  */}
{/* 
      <section id="espacios" className="py-20 bg-[rgb(235,224,209)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-[rgb(25,50,90)] mb-4">Salones y Áreas Sociales</h2>
                <p className="text-xl text-[rgb(25,50,90)] opacity-70 max-w-3xl mx-auto">
                    Explora nuestra colección de salones y áreas sociales que acompañan tu evento. Haz clic para ver detalles y reservar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {spaceData.map((space) => (
                    <SpaceGridCard
                        key={space.id}
                        space={space}
                        onOpenModal={handleSpaceClick} // <-- Pasa el handler de apertura del modal de detalles
                    />
                ))}
            </div>
        </div>
      </section>  */}
      
      {/* NUEVA SECCIÓN: 4. Grid de Espacios  */}
      <section id="espacios" className="py-10 bg-[rgb(235,224,209)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-[rgb(25,50,90)] mb-4">Espacios Empresariales y Deportivos</h2>
                <p className="text-xl text-[rgb(25,50,90)] opacity-70 max-w-3xl mx-auto">
                    Explora nuestra oferta completa de salones tipos de organizaciones para diferentes tipos de eventos. Haz clic para ver detalles y reservar.
                </p>
            </div>
            {/* Grid con 1 columna en móvil, 2 en tablet y 3 en desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {espacios.map((space) => (
                  <SpaceGridCard
                    key={space.id_unico}
                    space={space}
                    onOpenModal={
                      
                      handleSpaceClick
                    }
                  />
                ))}
            </div>
        </div>
      </section>

      {/* 5. Sección de Llamada a la Acción (CTA) - Fondo naranjaMarrón */}
      <section className="bg-[rgba(255,255,255,0.95)] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-[rgb(60,58,71)] sm:text-4xl mb-4">
            ¿Listo para Reservar?
          </h2>
          <p className="text-xl text-[rgb(60,58,71)] opacity-80 mb-8">
            Solo necesitas 30 segundos para encontrar y asegurar tu espacio ideal.
          </p>
          {/* Botón CTA secundario con fondo beigeClaro y texto naranjaMarrón */}
          <a
            href="#espacios"
            className="px-8 py-3 text-lg bg-[rgb(204,153,0)] text-[rgb(25,50,90)] font-bold rounded-full shadow-2xl hover:bg-white transition duration-300 transform hover:scale-105"
          >
            Empezar Reserva
          </a>
        </div>
      </section>

      {/* 5. Acerca de Nosotros (Misión / Visión / Trayectoria) */}
      <section id="sobre-nosotros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-extrabold text-[rgb(25,50,90)] mb-4 border-b-4 border-[rgb(204,153,0)] inline-block pb-1">
                    Club El Meta
                </h2>
                <p className="text-2xl text-[rgb(25,50,90)] opacity-90 max-w-4xl mx-auto mt-4">
                   75 años de historia. La excelencia en recreación y esparcimiento para la familia llanera.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Bloque de Misión y Visión */}
                <div className="p-8 bg-[rgb(235,224,209)] rounded-xl shadow-xl space-y-6">
                    <div className="flex items-start">
                        <Feather size={32} className="text-[rgb(204,153,0)] flex-shrink-0 mr-4 mt-1" />
                        <div>
                            <h3 className="text-3xl font-bold text-[rgb(25,50,90)] mb-2">Misión</h3>
                            <p className="text-[rgb(25,50,90)] text-opacity-85 leading-relaxed">
                                Brindar a propios y visitantes un exclusivo ambiente atendido por personal idóneo y calificado, en cómodas y bellas instalaciones, ofreciendo productos de primera línea, satisfaciendo plenamente las expectativas de excelencia, descanso y esparcimiento.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start pt-6 border-t border-[rgb(25,50,90)] border-opacity-20">
                        <Zap size={32} className="text-[rgb(204,153,0)] shrink-0 mr-4 mt-1" />
                        <div>
                            <h3 className="text-3xl font-bold text-[rgb(25,50,90)] mb-2">Visión (2015)</h3>
                            <p className="text-[rgb(25,50,90)] text-opacity-85 leading-relaxed">
                                Estar consolidado como empresa líder en calidad de la prestación de servicios de recreación y esparcimiento a la familia llanera, e igualmente como centro de negocios para empresarios nacionales y extranjeros.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Bloque de Resumen de Instalaciones (Con una Imagen para mayor impacto) */}
                <div className="relative rounded-xl overflow-hidden shadow-2xl h-96">
                    <img 
                        src="salones/BalconCena.jpeg"
                        alt="Vista aérea de las instalaciones del Club El Meta"
                        className="absolute inset-0 w-full h-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[rgba(19,44,85,0.5)] bg-opacity-60 flex items-end p-8">
                        <h3 className="text-4xl font-extrabold text-[rgb(235,224,209)] leading-snug">
                            Tu <span className="text-[rgb(27,177,214)]">oasis de paz</span> y el mejor centro de negocios en un solo lugar.
                        </h3>
                    </div>
                </div>
                
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-11">

                <div className="relative rounded-xl overflow-hidden shadow-2xl h-96">
                    <Ubication className='text-black'/>
                </div>
                
                {/* Bloque de Misión y Visión */}
                <div className="p-8 bg-[rgb(235,224,209)] rounded-xl shadow-xl space-y-6">
                    <div className="flex items-start">
                        <Feather size={32} className="text-[rgb(204,153,0)] flex-shrink-0 mr-4 mt-1" />
                        <div>
                            <h3 className="text-3xl font-bold text-[rgb(25,50,90)] mb-2">Ubicados</h3>
                            <p className="text-[rgb(25,50,90)] text-opacity-85 leading-relaxed">Estamos localizados cerca a la via antigua de
                              Villavicencio hacia Restrepo : "Club Meta, Cl. 47a #2911, Villavicencio, Meta"
                            </p> 
                            <p className='text-[rgb(25,50,90)] text-opacity-85 leading-relaxed text-2xl mt-4 font-bold'>
                              Siente te libre de venir a visitarnos y conocer nuestras instalaciones ❤️.
                            </p>
                        </div>
                    </div>
                    
                </div>

            </div>
        </div>
      </section>
      <section id="socios" className="py-20 bg-gray-100 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-5xl font-extrabold text-[rgb(25,50,90)] mb-4 border-b-4 border-[rgb(204,153,0)] inline-block pb-1">
                   <span className="text-[rgb(204,153,0)]">Socios</span> Club El Meta
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid gap-8">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <Users size={48} className="text-[rgb(204,153,0)] mx-auto mb-4" />
                    <h3 className="text-3xl font-bold text-[rgb(25,50,90)] mb-2">Socios</h3>
                    <p className="text-[rgb(25,50,90)] text-opacity-85 leading-relaxed text-3xl">
                     <span >En Club El Meta, nuestros socios son la base de nuestro éxito.</span>
                    </p>
                    <p className='text-[rgb(25,50,90)] text-opacity-85 leading-relaxed text-3xl'>
                      Los socios cuentan con algunos beneficios como:
                      <br/>
                    </p>
                    <ol>
                      <li className='text-[rgb(25,50,90)] text-opacity-85 leading-relaxed text-2xl mt-4'>✅ Acceso privado a nuestros espacios deportivos y piscinas.</li>
                      <li className='text-[rgb(25,50,90)] text-opacity-85 leading-relaxed text-2xl mt-4'>✅ Descuentos exclusivos en la reservacion de nuestros espacios.</li>
                      <li className='text-[rgb(25,50,90)] text-opacity-85 leading-relaxed text-2xl mt-4'>✅ Derecho a reservas de cortesia para muchos de nuestros espacios.</li>
                      <li className='text-[rgb(25,50,90)] text-opacity-85 leading-relaxed text-2xl mt-4'>✅ Oportunidades de networking con otros miembros y profesionales.</li>
                    </ol>
                    <h1 className='text-black text-3xl mt-3.5'> ¿Quieres ser socio? ¡Contactanos! </h1>
                    
                </div>
              <div/>
         </div>     
        </div>

      </section>
      
      {/* 6. Pie de Página - Fondo azulOscuro */}
      <footer id="contacto" className="bg-[rgb(25,50,90)] text-[rgb(235,224,209)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>&copy; {new Date().getFullYear()} Club Elite. Todos los derechos reservados.</p>
            <p className="text-sm text-[rgb(235,224,209)] opacity-60 mt-1">Hecho con el App Router de Next.js y Tailwind CSS.</p>
          </div>
          <div className="flex space-x-6">
            {/* Enlaces con hover en azulPastel */}
            <a href="#" className="text-[rgb(235,224,209)] opacity-80 hover:text-[rgb(173,216,230)] transition duration-300">Términos de Servicio</a>
            <a href="#" className="text-[rgb(235,224,209)] opacity-80 hover:text-[rgb(173,216,230)] transition duration-300">Política de Privacidad</a>
            <a href="#" className="text-[rgb(235,224,209)] opacity-80 hover:text-[rgb(173,216,230)] transition duration-300">Contacto</a>
          </div>
        </div>
      </footer>
      
      {/* Modal de Agendamiento Global */}
      <ReservationModal
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setBookingSpace(null); }}
        space={bookingSpace}
      />

      {/* NUEVO: Modal de Detalles del Espacio (Se muestra si selectedSpace NO es null) */}
      <SpaceDetailsModal
        space={selectedSpace} // Pasa el objeto completo (si es null, el modal no se renderiza)
        onClose={closeSpaceDetails} // Handler que pone selectedSpace en null
        onBook={handleBookFromDetails} // Handler que cierra este modal y abre el BookingModal (accepts space)
      />
    </>
  );
}
// --- FIN DE DATA MOCK INTEGRADA ---