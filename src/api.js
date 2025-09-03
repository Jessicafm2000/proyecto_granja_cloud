const API_URL = "https://8xqk2pb1wd.execute-api.us-east-1.amazonaws.com/dev/animals"; // Tu URL de API Gateway

// ---------------- GET: obtener todos los animales ----------------
export async function getAnimals() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener animales");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAnimals:", error);
    return [];
  }
}

// ---------------- POST: agregar un animal ----------------
export async function addAnimal(nombre, tipo, edad) {
  try {
    const body = {
      nombre,
      tipo,
      edad: Number(edad), // aseguramos que edad se mande como número
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Error al agregar animal");
    return await res.json(); // <- devuelve { message, id }
  } catch (error) {
    console.error("addAnimal:", error);
    return null;
  }
}

// ---------------- PUT: actualizar un animal ----------------
export async function updateAnimal(id, nombre, tipo, edad) {
  try {
    const body = { id, nombre, tipo, edad: Number(edad) };

    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Error al actualizar animal");
    return await res.json();
  } catch (error) {
    console.error("updateAnimal:", error);
    return null;
  }
}

// ---------------- DELETE: eliminar un animal ----------------
export async function deleteAnimal(id) {
  try {
    // DELETE usa query param, no body
    const res = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });

    if (!res.ok) throw new Error("Error al eliminar animal");
    return await res.json();
  } catch (error) {
    console.error("deleteAnimal:", error);
    return null;
  }
}

