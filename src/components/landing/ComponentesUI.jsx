// src/components/ClubComponents.jsx
// Contiene todos los componentes reutilizables de la Landing Page.

import { useState, useEffect } from 'react'; // <-- Importamos hooks necesarios para el efecto de scroll
import { 
  BookOpen, 
  MapPin, 
  Users, 
  Calendar, 
  Menu, 
  X, 
  Maximize2, 
  Minimize2, 
  CheckCircle, 
  Clock
} from 'lucide-react'; 
import { useRouter } from 'next/navigation';

// Definición de la paleta de colores (se mantiene aquí ya que los componentes la usan intensamente)
const COLORS = {
  beigeClaro: 'rgb(235, 224, 209)',
  grisClaro: 'rgb(220, 220, 220)',
  azulPastel: 'rgb(173, 216, 230)',
  azulOscuro: 'rgb(25, 50, 90)',
  mostaza: 'rgb(204, 153, 0)',
  naranjaMarron: 'rgb(180, 100, 50)',
};

// Componente de navegación (Sin cambios, solo por completitud)
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- Nuevo estado para el menú móvil
  const router = useRouter();
  

  useEffect(() => {
    const handleScroll = () => {
      // Establece isScrolled en true si el scroll vertical supera los 80px
      setIsScrolled(window.scrollY > 80);
    };

    // Agregar listener al montar el componente
    window.addEventListener('scroll', handleScroll);

    // Limpiar el listener al desmontar el componente (limpieza esencial)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Clases condicionales para el fondo del header, respetando tu rgba(60,58,71,0.81)
  const headerClasses = `fixed top-0 left-0 w-full z-50 p-4 md:px-12 transition-all duration-300 ${
    isScrolled || isMenuOpen // El color sólido se activa si hay scroll O si el menú está abierto
      ? 'bg-[rgba(60,58,71,0.81)] shadow-lg opacity-100' // Fondo personalizado al hacer scroll/abrir menú
      : 'bg-transparent' // Fondo transparente al inicio
  }`;

  return (
    <header className={headerClasses}>
      <div className="flex justify-between items-center max-w-8xl mx-auto">
        {/* Zona del Logo */}
        <div className="flex items-center">
          <img 
            src="/logos/logoMeta.png" // Ruta desde la carpeta 'public'
            alt="Corporacion Club El Meta Logo"
            className="h-17 w-auto mr-2 sm:h-11" // Ajusta el tamaño de la imagen
            onError={(e) => {
              // Si la imagen falla en cargar, muestra el texto en su lugar
              e.currentTarget.style.display = 'none';
              const fallbackText = e.currentTarget.parentNode.querySelector('.fallback-text');
              if (fallbackText) fallbackText.style.display = 'block';
            }}
          />
          {/* Texto de Fallback con Font Anton */}
          <div className="text-4xl font-anton font-light tracking-widest hidden md:block fallback-text lg:text-3xl md:text-2xl sm:text-2xl">
              <span className="text-[rgb(235,224,209)]">Corporacion</span> <span className="text-[rgb(173,216,230)]">Club El </span><span className="text-[rgb(7,77,100)]">META</span>
          </div>
        </div>

        {/* 1. Menú Desktop */}
        <nav className="hidden md:flex space-x-8">
          {['Inicio', 'Espacios', 'Socios', 'Contacto'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[rgb(235,224,209)] hover:text-[rgb(173,216,230)] transition duration-300 font-medium"
            >
              {item}
            </a>
          ))}
        </nav>
        
        {/* Botón Mi Cuenta Desktop */}
        <button onClick={() => router.push('/login')} className="hidden md:block px-5 py-2 bg-[rgb(204,153,0)] text-[rgb(25,50,90)] font-semibold rounded-full shadow-lg hover:bg-opacity-80 transition duration-300 transform hover:scale-105 md:scale-70" >
          ¿Tienes cuenta?
        </button>

        {/* 2. Ícono de Menú Móvil (Hamburguesa/X) */}
        <button 
            className="md:hidden text-[rgb(235,224,209)] focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
            {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* 3. Menú Desplegable Móvil */}
      <nav 
        // El menú se despliega verticalmente por debajo del header
        className={`md:hidden absolute left-0 w-full transition-all duration-300 ease-in-out transform origin-top 
          ${isMenuOpen ? 'scale-y-100 opacity-100 max-h-screen pt-4' : 'scale-y-0 opacity-0 max-h-0'}`
        }
      >
        {/* Utilizamos tu color azulOscuro como fondo para el menú desplegable móvil */}
        <div className="flex flex-col space-y-3 p-4 bg-[rgba(60,58,71,0.81)] shadow-lg rounded-b-lg">
          {['Inicio', 'Espacios', 'Socios', 'Contacto'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              // Al hacer clic, cerramos el menú
              onClick={() => setIsMenuOpen(false)}
              className="text-[rgb(235,224,209)] py-2 block hover:text-[rgb(173,216,230)] transition duration-300 border-b border-opacity-20 border-[rgb(173,216,230)]"
            >
              {item}
            </a>
          ))}
          <button onClick={() => router.push('/login')} className="mt-4 px-5 py-2 bg-[rgb(204,153,0)] text-[rgb(25,50,90)] font-semibold rounded-full shadow-lg hover:bg-opacity-80 transition duration-300 transform hover:scale-105 w-full">
            Mi Cuenta
          </button>
        </div>
      </nav>
    </header>
  );
};



// Componente Modal de Agendamiento (Sin cambios, solo por completitud)
export const BookingModal = ({ isModalOpen, onClose }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Título del modal en azulOscuro */}
        <h3 className="text-2xl font-bold mb-4 text-[rgb(25,50,90)]">Proceso de Agendamiento</h3>
        <p className="text-gray-700 mb-6">
          Esta sería la vista inicial del proceso de reserva, que te llevaría a seleccionar el lugar y la hora.
        </p>
        {/* Botón del modal con Mostaza */}
        <button
          onClick={onClose}
          className="w-full px-5 py-3 bg-[rgb(204,153,0)] text-[rgb(25,50,90)] font-semibold rounded-lg hover:bg-opacity-90 transition duration-300"
        >
          Cerrar y Continuar
        </button>
      </div>
    </div>
  );
};