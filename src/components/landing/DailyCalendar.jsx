import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  add,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdAdd,
  IoMdClose,
  IoMdTrash,
  IoMdCreate,
  IoMdSearch,
  IoMdOptions,
} from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

// Funciones de utilidad para colores
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getLightColor = (color) => {
  const bigint = parseInt(color.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const lightR = Math.min(255, Math.floor(r + (255 - r) * 0.8));
  const lightG = Math.min(255, Math.floor(g + (255 - g) * 0.8));
  const lightB = Math.min(255, Math.floor(b + (255 - b) * 0.8));
  return `rgb(${lightR}, ${lightG}, ${lightB})`;
};

const defaultProfileImg = "https://randomuser.me/api/portraits/thumb/men/65.jpg";

// Modal de Detalles del Día
const DayDetailsModal = ({
  day,
  events,
  onClose,
  onEdit,
  onDelete,
  onAdd,
  categoryStyles,
  editingEvent,
}) => {
  const [form, setForm] = useState({
    id: editingEvent ? editingEvent.id : null,
    title: editingEvent ? editingEvent.title : "",
    category: editingEvent ? editingEvent.category : "important",
    startTime: editingEvent ? editingEvent.startTime : "09:00",
    endTime: editingEvent ? editingEvent.endTime : "10:00",
    dateKey: day ? format(day, "yyyy-MM-dd") : "",
    note: editingEvent ? editingEvent.note : "",
    profileImg: editingEvent ? editingEvent.profileImg : defaultProfileImg,
  });

  const [isEditing, setIsEditing] = useState(!!editingEvent);

  useEffect(() => {
    if (day && !editingEvent) {
      setForm({
        id: null,
        title: "",
        category: "important",
        startTime: "09:00",
        endTime: "10:00",
        dateKey: format(day, "yyyy-MM-dd"),
        note: "",
        profileImg: defaultProfileImg,
      });
      setIsEditing(false);
    }
  }, [day, editingEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onEdit(form);
    } else {
      onAdd({
        ...form,
        id: Date.now(),
      });
    }
    onClose();
  };

  const cancelEdit = () => {
    onClose();
  };

  if (!day) return null;

  const dateKey = format(day, "yyyy-MM-dd");
  const dayEvents = events[dateKey] || [];
  const monthName = day.toLocaleString("default", { month: "long" });

  return (
    <AnimatePresence>
      {day && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg w-11/12 max-w-md mx-auto p-6 relative z-60"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl"
              onClick={onClose}
              aria-label="Cerrar Modal"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center text-[#333333]">
              Eventos del {format(day, "d")} de {monthName} de {format(day, "yyyy")}
            </h2>
            {dayEvents.length === 0 && !isEditing ? (
              <p className="text-gray-700 text-center mb-4">No hay eventos para este día.</p>
            ) : (
              !isEditing && (
                <div className="space-y-4 max-h-60 overflow-y-auto hide-scrollbar mb-4">
                  {dayEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <img
                        src={event.profileImg || defaultProfileImg}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover border border-gray-300 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-[#333333] flex justify-between items-center">
                          {event.title}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setForm(event);
                                setIsEditing(true);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                              aria-label={`Editar evento ${event.title}`}
                            >
                              <IoMdCreate />
                            </button>
                            <button
                              onClick={() => onDelete(event.id)}
                              className="text-red-500 hover:text-red-700"
                              aria-label={`Eliminar evento ${event.title}`}
                            >
                              <IoMdTrash />
                            </button>
                          </div>
                        </h3>
                        <p className="text-xs text-gray-600 capitalize">
                          {categoryStyles[event.category]?.labelText || event.category}
                        </p>
                        <p className="text-xs text-gray-500">
                          {event.startTime} - {event.endTime}
                        </p>
                        {event.note && (
                          <p className="text-xs text-gray-700 mt-1 italic">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#333333]">
                {isEditing ? "Editar Evento" : "Añadir Nuevo Evento"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="title" className="block text-xs font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                    Categoría
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    aria-required="true"
                    placeholder="Ingrese nueva categoría"
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label htmlFor="startTime" className="block text-xs font-medium text-gray-700">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      id="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      aria-required="true"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="endTime" className="block text-xs font-medium text-gray-700">
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      id="endTime"
                      value={form.endTime}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      aria-required="true"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="note" className="block text-xs font-medium text-gray-700">
                    Nota
                  </label>
                  <textarea
                    name="note"
                    id="note"
                    value={form.note}
                    onChange={handleChange}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Detalle adicional del evento"
                  />
                </div>
                <div>
                  <label htmlFor="profileImg" className="block text-xs font-medium text-gray-700">
                    URL Imagen de Perfil (opcional)
                  </label>
                  <input
                    type="text"
                    name="profileImg"
                    id="profileImg"
                    value={form.profileImg}
                    onChange={handleChange}
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 flex items-center space-x-1"
                  >
                    <IoMdAdd />
                    <span>{isEditing ? "Actualizar" : "Añadir"}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Barra de Búsqueda
const SearchBar = ({ showSearchBar, setShowSearchBar, searchTerm, setSearchTerm }) => {
  return (
    <motion.div initial={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} className="relative">
      <motion.button
        whileHover={{ backgroundColor: "#F3E8FF" }}
        onClick={() => setShowSearchBar(!showSearchBar)}
        className="p-2.5 bg-purple-100 rounded-full border border-purple-200 shadow-sm transition-all duration-300 hover:shadow-md"
        aria-label="Toggle Search"
      >
        <IoMdSearch className="text-purple-600" size={18} />
      </motion.button>
      <AnimatePresence>
        {showSearchBar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-0 top-full mt-2 z-50"
          >
            <div className="flex items-center bg-white rounded-full shadow-lg border border-purple-200 overflow-hidden">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar eventos..."
                className="w-40 h-10 px-4 py-2 focus:outline-none text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearchBar(false)}
                className="p-2 text-purple-600 hover:text-purple-800"
                aria-label="Cerrar Búsqueda"
              >
                <IoMdClose size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TodayButton = ({ setCurrentDate }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white text-[#4A90E2] h-7 px-3 rounded-xl hover:bg-[#F5F5F5] transition-colors font-medium text-xs shadow-sm flex items-center space-x-1 mb-2"
      onClick={() => {
        const today = new Date();
        setCurrentDate(today);
      }}
      aria-label="Ir a Hoy"
    >
      <span>Hoy</span>
    </motion.button>
  );
};

const DayNavigation = ({ currentDate, handlePreviousDay, handleNextDay }) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const dateDisplay = isMobile
    ? format(currentDate, "dd/MM/yyyy")
    : format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy");

  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePreviousDay}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-all duration-300"
        aria-label="Día Anterior"
      >
        <IoIosArrowBack size={16} className="text-[#333333]" />
      </motion.button>
      <span className="text-base font-bold text-[#333333]">{dateDisplay}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextDay}
        className="w-7 h-7 flex items-center justify-center rounded-full border border-[#E5E5E5] hover:bg-[#F5F5F5] transition-all duration-300"
        aria-label="Día Siguiente"
      >
        <IoIosArrowForward size={16} className="text-[#333333]" />
      </motion.button>
    </div>
  );
};

const CategoryFilter = ({
  showCategoryFilter,
  setShowCategoryFilter,
  filterCategory,
  setFilterCategory,
  categoryStyles,
}) => {
  return (
    <motion.div initial={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} className="relative">
      <motion.button
        whileHover={{ backgroundColor: "#F3E8FF" }}
        onClick={() => setShowCategoryFilter(!showCategoryFilter)}
        className="p-2.5 bg-purple-100 rounded-full border border-purple-200 shadow-sm transition-all duration-300 hover:shadow-md"
        aria-label="Toggle Filters"
      >
        <IoMdOptions className="text-purple-600" size={18} />
      </motion.button>
      <AnimatePresence>
        {showCategoryFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl p-3 z-60 w-44"
          >
            <div className="space-y-2">
              <motion.button
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setFilterCategory("all")}
                className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                  filterCategory === "all" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Todos</span>
              </motion.button>
              {Object.entries(categoryStyles).map(([key, value]) => (
                <motion.button
                  key={key}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setFilterCategory(key)}
                  className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    filterCategory === key ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: value.borderColor }} />
                  <span>{value.labelText}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MiniDayCell = ({
  dayDate,
  inMonth,
  isSelected,
  events,
  categoryStyles,
  filterCategory,
  searchTerm,
  openModalForDay,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  if (!dayDate) {
    return <div className="p-1"></div>;
  }

  const dateStr = format(dayDate, "yyyy-MM-dd");
  const dayEvents = (events[dateStr] || [])
    .filter((ev) => filterCategory === "all" || ev.category === filterCategory)
    .filter((ev) => ev.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const hasEvents = dayEvents.length > 0;

  let circleStyle = {};
  if (hasEvents) {
    const uniqueCategories = [...new Set(dayEvents.map((ev) => ev.category))];
    const total = uniqueCategories.length;
    if (total === 1) {
      const cat = uniqueCategories[0];
      circleStyle.border = `2px solid ${categoryStyles[cat]?.borderColor || "#000"}`;
    } else {
      let gradientString = "conic-gradient(";
      uniqueCategories.forEach((cat, i) => {
        const start = (i / total) * 100;
        const end = ((i + 1) / total) * 100;
        const color = categoryStyles[cat]?.borderColor || "#000";
        gradientString += `${color} ${start}%, ${color} ${end}%${i < total - 1 ? "," : ""}`;
      });
      gradientString += ")";
      circleStyle.background = gradientString;
    }
  }

  const handleClick = () => {
    if (!hasEvents) {
      openModalForDay(dayDate, null);
    } else {
      setShowPopover((prev) => !prev);
    }
  };

  return (
    <motion.div
      className="p-1 relative"
      style={{ overflow: "visible" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer 
          ${!inMonth ? "text-gray-300" : "text-gray-700"} 
          ${isSelected ? "bg-purple-200" : "hover:bg-purple-100"}
        `}
        onClick={handleClick}
        style={circleStyle}
      >
        {hasEvents && circleStyle.background && (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">{format(dayDate, "d")}</span>
          </div>
        )}
        {!hasEvents && !circleStyle.background && (
          <span className="text-sm font-medium">{format(dayDate, "d")}</span>
        )}
        {hasEvents && circleStyle.border && (
          <span className="text-sm font-medium">{format(dayDate, "d")}</span>
        )}
      </div>

      <AnimatePresence>
        {showPopover && hasEvents && (
          <motion.div
            className="absolute z-[9999] shadow-xl rounded-lg p-2 text-sm border border-gray-300 bg-white left-1/2 transform -translate-x-1/2 max-w-[90vw]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ top: "calc(100% + 8px)" }}
          >
            {dayEvents.map((event) => {
              const bgColor = categoryStyles[event.category]?.backgroundColor || "#f0f0f0";
              const borderColor = categoryStyles[event.category]?.borderColor || "#000";
              return (
                <div
                  key={event.id}
                  className="mb-2 last:mb-0 rounded-sm cursor-pointer p-2 hover:opacity-90"
                  style={{
                    border: `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                  }}
                  onClick={() => {
                    openModalForDay(dayDate, event);
                    setShowPopover(false);
                  }}
                >
                  <div className="flex items-center mb-1 space-x-2">
                    <img
                      src={event.profileImg || defaultProfileImg}
                      alt="Profile"
                      className="w-5 h-5 rounded-full object-cover border border-gray-300"
                    />
                    <div className="text-xs font-semibold text-gray-700 flex-1 truncate">
                      {event.title}
                    </div>
                    {event.startTime && event.endTime && (
                      <span className="text-[10px] text-gray-700 border border-gray-300 px-1 py-0.5 rounded bg-white whitespace-nowrap">
                        {event.startTime} - {event.endTime}
                      </span>
                    )}
                  </div>
                  {event.note && <div className="text-[10px] text-gray-700 mt-1 line-clamp-2">{event.note}</div>}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const MiniMonthCalendar = ({
  currentDate,
  setCurrentDate,
  events,
  categoryStyles,
  filterCategory,
  searchTerm,
  openModalForDay,
}) => {
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const startOfCal = startOfWeek(startOfCurrentMonth, { weekStartsOn: 0 });
  const endOfCal = endOfWeek(endOfCurrentMonth, { weekStartsOn: 0 });

  const days = [];
  let day = startOfCal;
  while (day <= endOfCal) {
    days.push(day);
    day = add(day, { days: 1 });
  }

  const monthYear = format(currentDate, "MMMM yyyy");

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 space-y-4 flex-none overflow-visible w-full min-w-[300px]">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(subDays(currentDate, 28))}
          aria-label="Mes anterior"
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <IoIosArrowBack />
        </button>
        <span className="font-medium text-gray-800 text-sm md:text-base">{monthYear}</span>
        <button
          onClick={() => setCurrentDate(addDays(currentDate, 28))}
          aria-label="Mes siguiente"
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <IoIosArrowForward />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-600 mb-1 gap-2">
        {["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((d) => (
          <div key={d} className="text-[10px] md:text-xs">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm gap-2 overflow-visible w-full">
        {days.map((d, i) => {
          const inMonth = isSameMonth(d, currentDate);
          const selected = isSameDay(d, currentDate);
          return (
            <MiniDayCell
              key={d}
              dayDate={d}
              inMonth={inMonth}
              isSelected={selected}
              events={events}
              categoryStyles={categoryStyles}
              filterCategory={filterCategory}
              searchTerm={searchTerm}
              openModalForDay={openModalForDay}
            />
          );
        })}
      </div>
    </div>
  );
};

const EventDetailsPanel = ({ selectedEvent }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-auto hide-scrollbar">
      {selectedEvent ? (
        <>
          <h3 className="font-semibold text-gray-800 mb-2">{selectedEvent.title}</h3>
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Categoría:</span> {selectedEvent.category}
          </p>
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Hora:</span> {selectedEvent.startTime} - {selectedEvent.endTime}
          </p>
          {selectedEvent.note && (
            <p className="text-sm text-gray-700 mt-1 italic">{selectedEvent.note}</p>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500">Selecciona un evento para ver detalles.</p>
      )}
    </div>
  );
};

const QuickNotesPanel = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex-none">
      <h4 className="font-semibold text-gray-800 mb-2">Notas Rápidas</h4>
      <p className="text-sm text-gray-700">Agrega algunas notas o recordatorios aquí.</p>
    </div>
  );
};

const DayHeader = ({
  currentDate,
  handlePreviousDay,
  handleNextDay,
  setCurrentDate,
  setShowSearchBar,
  showSearchBar,
  searchTerm,
  setSearchTerm,
  setShowCategoryFilter,
  showCategoryFilter,
  filterCategory,
  setFilterCategory,
  categoryStyles,
}) => {
  return (
    <div className="flex items-center justify-between mb-6 relative z-20">
      <div className="flex items-center space-x-2">
        <SearchBar showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="flex flex-col items-center">
        <TodayButton setCurrentDate={setCurrentDate} />
        <DayNavigation currentDate={currentDate} handlePreviousDay={handlePreviousDay} handleNextDay={handleNextDay} />
      </div>
      <div className="flex items-center space-x-2">
        <CategoryFilter
          showCategoryFilter={showCategoryFilter}
          setShowCategoryFilter={setShowCategoryFilter}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categoryStyles={categoryStyles}
        />
      </div>
    </div>
  );
};

const arrangeEvents = (events) => {
  const parseTime = (timeStr) => {
    const [hh, mm] = timeStr.split(":").map(Number);
    return (hh - 8) + mm / 60;
  };

  const evts = events.map((ev) => ({
    ...ev,
    startFloat: parseTime(ev.startTime),
    endFloat: parseTime(ev.endTime),
  }));

  evts.sort((a, b) => a.startFloat - b.startFloat);

  const groups = [];

  evts.forEach((event) => {
    let placed = false;
    for (const group of groups) {
      const overlaps = group.some(
        (gEv) => !(event.endFloat <= gEv.startFloat || event.startFloat >= gEv.endFloat)
      );
      if (overlaps) {
        group.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      groups.push([event]);
    }
  });

  const arranged = [];
  groups.forEach((group) => {
    const count = group.length;
    group.forEach((ev, i) => {
      arranged.push({
        ...ev,
        widthFactor: 1 / count,
        offsetFactor: i,
      });
    });
  });

  return arranged;
};

const DayCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [events, setEvents] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const [showRightPanel, setShowRightPanel] = useState(false);

  const [categoryStyles, setCategoryStyles] = useState({
    important: {
      borderColor: "#E69835",
      backgroundColor: getLightColor("#E69835"),
      labelText: "Importante",
      color: "#E69835",
    },
    personal: {
      borderColor: "#3A72B4",
      backgroundColor: getLightColor("#3A72B4"),
      labelText: "Personal",
      color: "#3A72B4",
    },
    work: {
      borderColor: "#65A91B",
      backgroundColor: getLightColor("#65A91B"),
      labelText: "Trabajo",
      color: "#65A91B",
    },
  });

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00 a 20:00

  useEffect(() => {
    const storedEvents = localStorage.getItem("dayEvents");
    const storedCategories = localStorage.getItem("dayCategoryStyles");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories);
      const updatedCategories = Object.fromEntries(
        Object.entries(parsedCategories).map(([key, value]) => [
          key,
          {
            ...value,
            backgroundColor: getLightColor(value.color),
          },
        ])
      );
      setCategoryStyles(updatedCategories);
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaChange = (e) => {
      if (e.matches) {
        setShowRightPanel(true);
      } else {
        setShowRightPanel(false);
      }
    };
    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("dayEvents", JSON.stringify(events));
    localStorage.setItem("dayCategoryStyles", JSON.stringify(categoryStyles));
  }, [events, categoryStyles]);

  const handlePreviousDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const dateKey = format(currentDate, "yyyy-MM-dd");
  const dayEvents = events[dateKey] || [];

  const filteredEvents = dayEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const arrangedEvents = arrangeEvents(filteredEvents);

  const openModalForDay = (dayDate, eventToEdit) => {
    setSelectedDay(dayDate);
    setEditingEvent(eventToEdit || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedDay(null);
    setEditingEvent(null);
    setShowModal(false);
  };

  const addEvent = (newEvent) => {
    if (!events[newEvent.dateKey]) {
      events[newEvent.dateKey] = [];
    }

    setEvents((prev) => ({
      ...prev,
      [newEvent.dateKey]: [...prev[newEvent.dateKey], newEvent],
    }));

    if (!categoryStyles[newEvent.category]) {
      const newColor = getRandomColor();
      setCategoryStyles((prev) => ({
        ...prev,
        [newEvent.category]: {
          borderColor: newColor,
          backgroundColor: getLightColor(newColor),
          labelText: newEvent.category.charAt(0).toUpperCase() + newEvent.category.slice(1),
          color: newColor,
        },
      }));
    }
  };

  const editEvent = (updatedEvent) => {
    const originalDateKey = updatedEvent.dateKey;
    setEvents((prev) => ({
      ...prev,
      [originalDateKey]: prev[originalDateKey].map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      ),
    }));

    if (!categoryStyles[updatedEvent.category]) {
      const newColor = getRandomColor();
      setCategoryStyles((prev) => ({
        ...prev,
        [updatedEvent.category]: {
          borderColor: newColor,
          backgroundColor: getLightColor(newColor),
          labelText: updatedEvent.category.charAt(0).toUpperCase() + updatedEvent.category.slice(1),
          color: newColor,
        },
      }));
    }
  };

  const deleteEvent = (eventId) => {
    setEvents((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((event) => event.id !== eventId),
    }));
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(null);
    }
  };

  const handleTimeSlotClick = (hour) => {
    setEditingEvent(null);
    setSelectedDay(currentDate);
    setShowModal(true);
  };

  const toggleRightPanel = () => {
    setShowRightPanel((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto p-4">
        <DayHeader
          currentDate={currentDate}
          handlePreviousDay={handlePreviousDay}
          handleNextDay={handleNextDay}
          setCurrentDate={setCurrentDate}
          setShowSearchBar={setShowSearchBar}
          showSearchBar={showSearchBar}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setShowCategoryFilter={setShowCategoryFilter}
          showCategoryFilter={showCategoryFilter}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categoryStyles={categoryStyles}
        />

        <div className="relative">
          {/* Flecha para toggle del panel derecho en móvil, centrada verticalmente */}
          <button
            className="md:hidden absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full border border-purple-200 shadow-sm hover:shadow-md z-50"
            onClick={toggleRightPanel}
            aria-label="Toggle Panel Derecho"
          >
            {showRightPanel ? (
              <IoIosArrowForward className="text-purple-400" size={18} />
            ) : (
              <IoIosArrowBack className="text-purple-400" size={18} />
            )}
          </button>

          {/* Layout principal: Agenda diaria + Panel lateral */}
          <div className="flex h-[800px] overflow-hidden relative">
            {/* Columna Principal (Agenda diaria) */}
            <div className="flex-1 border rounded-lg relative grid grid-cols-[80px_1fr] overflow-auto hide-scrollbar">
              {/* Columna de Horas */}
              <div className="border-r bg-gray-50">
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-[100px] border-b px-2 py-1 text-sm text-gray-600 flex items-center">
                    {`${hour.toString().padStart(2, "0")}:00`}
                  </div>
                ))}
              </div>
              {/* Columna de eventos */}
              <div className="relative bg-white">
                {timeSlots.map((hour) => (
                  <motion.div
                    key={hour}
                    className="h-[100px] border-b relative"
                    onClick={(e) => {
                      handleTimeSlotClick(hour);
                      e.stopPropagation();
                    }}
                    whileHover={{ backgroundColor: "#F3E8FF", scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  ></motion.div>
                ))}
                {arrangedEvents.map((event) => {
                  const top = event.startFloat * 100 + "px";
                  const height = (event.endFloat - event.startFloat) * 100 + "px";
                  const widthPercent = event.widthFactor * 100;
                  const leftPercent = event.offsetFactor * widthPercent;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05, backgroundColor: "#EBF4FF" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        openModalForDay(currentDate, event);
                      }}
                      className="absolute p-2 rounded border cursor-pointer shadow-sm overflow-hidden"
                      style={{
                        top: top,
                        height: height,
                        width: `calc(${widthPercent}% - 8px)`,
                        left: `calc(${leftPercent}% + 4px)`,
                        borderColor: categoryStyles[event.category]?.borderColor,
                        backgroundColor: categoryStyles[event.category]?.backgroundColor,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <h3 className="font-semibold text-sm text-gray-700 truncate">{event.title}</h3>
                      <p className="text-xs text-gray-600">{`${event.startTime} - ${event.endTime}`}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Panel Lateral Derecho (en móvil se desliza, en escritorio más ancho) */}
            <AnimatePresence>
              {showRightPanel && (
                <motion.div
                  className="absolute md:static top-0 right-0 h-full w-full md:w-96 bg-white md:flex-shrink-0 flex flex-col p-8 z-40 shadow-xl md:shadow-none space-y-8 overflow-auto hide-scrollbar"
                  initial={{ x: "100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="flex flex-col space-y-8 overflow-auto hide-scrollbar">
                    <MiniMonthCalendar
                      currentDate={currentDate}
                      setCurrentDate={setCurrentDate}
                      events={events}
                      categoryStyles={categoryStyles}
                      filterCategory={filterCategory}
                      searchTerm={searchTerm}
                      openModalForDay={openModalForDay}
                    />
                    <EventDetailsPanel selectedEvent={selectedEvent} />
                    <QuickNotesPanel />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showModal && selectedDay && (
        <DayDetailsModal
          day={selectedDay}
          events={events}
          onClose={closeModal}
          onEdit={editEvent}
          onDelete={(id) => deleteEvent(id)}
          onAdd={addEvent}
          categoryStyles={categoryStyles}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
};

export default DayCalendar;
