/**
 * Utilidades para manejo de fechas y horas
 */

/**
 * Convierte una fecha y hora en formato string a un objeto Date
 * @param {string} fechaStr - Fecha en formato YYYY-MM-DD o ISO
 * @param {string} horaStr - Hora en formato HH:MM
 * @returns {Date} - Objeto Date combinado
 */
const combinarFechaHora = (fechaStr, horaStr) => {
  // Extraer la parte de fecha (YYYY-MM-DD)
  const fechaBase =
    typeof fechaStr === "string" ? fechaStr.split("T")[0] : new Date(fechaStr).toISOString().split("T")[0]

  // Crear y retornar el objeto Date
  return new Date(`${fechaBase}T${horaStr}`)
}

/**
 * Formatea una fecha para mostrarla en la interfaz
 * @param {Date} fecha - Objeto Date a formatear
 * @returns {string} - Fecha formateada en español
 */
const formatearFecha = (fecha) => {
  if (!fecha) return ""

  return fecha.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Formatea una hora para mostrarla en la interfaz
 * @param {Date} fecha - Objeto Date del que extraer la hora
 * @returns {string} - Hora formateada en formato HH:MM
 */
const formatearHora = (fecha) => {
  if (!fecha) return ""

  return fecha.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

/**
 * Verifica si una fecha/hora es posterior al tiempo actual más un margen
 * @param {Date} fecha - Fecha a verificar
 * @param {number} horasMinimas - Horas mínimas de diferencia requeridas
 * @returns {boolean} - true si la fecha cumple con el tiempo mínimo
 */
const cumpleTiempoMinimo = (fecha, horasMinimas = 6) => {
  const ahora = new Date()
  const tiempoDiferencia = fecha.getTime() - ahora.getTime()
  const horasDiferencia = tiempoDiferencia / (1000 * 60 * 60)

  return horasDiferencia >= horasMinimas
}

/**
 * Extrae la hora de un objeto Date en formato HH:MM
 * @param {Date} fecha - Objeto Date
 * @returns {string} - Hora en formato HH:MM
 */
const extraerHora = (fecha) => {
  if (!fecha) return ""

  const horas = fecha.getHours().toString().padStart(2, "0")
  const minutos = fecha.getMinutes().toString().padStart(2, "0")

  return `${horas}:${minutos}`
}

module.exports = {
  combinarFechaHora,
  formatearFecha,
  formatearHora,
  cumpleTiempoMinimo,
  extraerHora,
}
