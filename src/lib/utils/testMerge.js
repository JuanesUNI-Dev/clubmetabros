// src/lib/utils/mergeSpacesRates.js

// 1. Consolidar espacios únicos por id_space
export const consolidateSpaces = (spaces) => {
  const unique = new Map();

  spaces.forEach(s => {
    const id = s.id_space;

    if (!unique.has(id)) {
      unique.set(id, {
        id_space: s.id_space,
        id_unico: `${s.id_space}-${s.name.replace(/\s+/g, "")}`, // <-- 🔥 ID único para el frontend
        name: s.name,
        descrip: s.descrip,
        url_img: s.url_img,
        tipo: s.tipo || "Espacio", 
        disponibilidad_socio: true, 
        capacidad_max: s.pax || 0,
        tarifas: []
      });
    }
  });

  return Array.from(unique.values());
};


// 2. Adjuntar tarifas por fk_space
export const attachRatesToSpaces = (spaces, rates) => {
  return spaces.map(space => {
    const tarifas = rates.filter(r => r.fk_space === space.id_space);
    return { ...space, tarifas };
  });
};


// 3. Merge final
export const mergeSpacesAndRates = (spaces, rates) => {
  const base = consolidateSpaces(spaces);
  return attachRatesToSpaces(base, rates);
};
