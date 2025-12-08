export const VenueCard = ({ icon: Icon, title, description }) => (
  // Fondo de tarjeta con grisClaro
  <div href="#espacios" className="bg-[rgb(220,220,220)] p-6 rounded-xl shadow-xl hover:shadow-2xl transition duration-500 transform hover:-translate-y-1 border border-[rgb(235,224,209)]">
    {/* Fondo de icono con azulPastel */}
    <div className="p-3 inline-flex rounded-full bg-[rgb(173,216,230)] text-[rgb(25,50,90)] mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-[rgb(25,50,90)] mb-2">{title}</h3>
    <p className="text-[rgb(25,50,90)] opacity-80">{description}</p>
    {/* Texto del botón con azulOscuro */}
    <a href="#espacios" className="mt-4 text-[rgb(25,50,90)] font-semibold flex items-center hover:text-opacity-70 transition duration-300 cursor-pointer">
      Mira nuestros salones 
      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
    </a>
  </div>
);