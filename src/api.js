// -------------------- CONFIG --------------------
const ANIMALS_API = "https://8xqk2pb1wd.execute-api.us-east-1.amazonaws.com/dev/animals";
const CROPS_API = "https://8xqk2pb1wd.execute-api.us-east-1.amazonaws.com/dev/crops";
const PRODUCTION_API = "https://8xqk2pb1wd.execute-api.us-east-1.amazonaws.com/dev/production";
const INVENTORY_API = "https://8xqk2pb1wd.execute-api.us-east-1.amazonaws.com/dev/inventory";

// -------------------- UTIL --------------------
async function fetchAPI(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Error en la solicitud");
    }
    if (res.status === 204 || res.headers.get("content-length") === "0") return { message: "Eliminado" };
    return await res.json();
  } catch (error) {
    console.error("fetchAPI:", error);
    return null;
  }
}

// -------------------- ANIMALES --------------------
export async function getAnimals() {
  return fetchAPI(ANIMALS_API);
}

export async function addAnimal({ nombre, tipo, edad }) {
  return fetchAPI(ANIMALS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, tipo, edad: Number(edad) }),
  });
}

export async function updateAnimal({ id, nombre, tipo, edad }) {
  if (id == null) throw new Error("Falta el id para actualizar");
  return fetchAPI(ANIMALS_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(id), nombre, tipo, edad: Number(edad) }),
  });
}

export async function deleteAnimal(id) {
  if (id == null) throw new Error("Falta el id para eliminar");
  return fetchAPI(`${ANIMALS_API}?id=${Number(id)}`, { method: "DELETE" });
}

// -------------------- CULTIVOS --------------------
export async function getCrops() {
  return fetchAPI(CROPS_API);
}

export async function addCrop({ name, estado, siembra, hectareas }) {
  return fetchAPI(CROPS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, estado, siembra, hectareas: Number(hectareas) }),
  });
}

export async function updateCrop({ id, name, estado, siembra, hectareas }) {
  if (id == null) throw new Error("Falta el id para actualizar");
  return fetchAPI(CROPS_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(id), name, estado, siembra, hectareas: Number(hectareas) }),
  });
}

export async function deleteCrop(id) {
  if (id == null) throw new Error("Falta el id para eliminar");
  return fetchAPI(`${CROPS_API}?id=${Number(id)}`, { method: "DELETE" });
}

// -------------------- PRODUCCIÓN --------------------
export async function getProduction() {
  return fetchAPI(PRODUCTION_API);
}

export async function addProduction({ date, milk, eggs, pigsSold }) {
  return fetchAPI(PRODUCTION_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, milk: Number(milk), eggs: Number(eggs), pigsSold: Number(pigsSold) }),
  });
}

export async function updateProduction({ id, date, milk, eggs, pigsSold }) {
  if (id == null) throw new Error("Falta el id para actualizar");
  return fetchAPI(PRODUCTION_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(id), date, milk: Number(milk), eggs: Number(eggs), pigsSold: Number(pigsSold) }),
  });
}

export async function deleteProduction(id) {
  if (id == null) throw new Error("Falta el id para eliminar");
  return fetchAPI(`${PRODUCTION_API}?id=${Number(id)}`, { method: "DELETE" });
}

// -------------------- INVENTARIO --------------------
export async function getInventory() {
  return fetchAPI(INVENTORY_API);
}

export async function addInventory({ name, category, date, quantity, unit }) {
  return fetchAPI(INVENTORY_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, category, date, quantity: Number(quantity), unit }),
  });
}

export async function updateInventory({ id, name, category, date, quantity, unit }) {
  if (id == null) throw new Error("Falta el id para actualizar");
  return fetchAPI(INVENTORY_API, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(id), name, category, date, quantity: Number(quantity), unit }),
  });
}

export async function deleteInventory(id) {
  if (id == null) throw new Error("Falta el id para eliminar");
  return fetchAPI(`${INVENTORY_API}?id=${Number(id)}`, { method: "DELETE" });
}
