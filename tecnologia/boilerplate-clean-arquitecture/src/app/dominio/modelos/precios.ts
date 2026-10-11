// =============================================================
// DOMINIO · Reglas de precios y tarifas de ConectaOficios
// =============================================================
// Este archivo NO importa nada de Angular ni de librerías externas.
// La comisión de garantía y el IGV son decisiones de NEGOCIO puras:
// protegen al cliente mediante custodia de fondos y formalidad tributaria.

/** Comisión de la plataforma por garantía de satisfacción y custodia (10%). */
export const COMISION_MARKETPLACE = 0.10;
export const COMISION_GARANTIA = 0.10;

/** Tasa legal del Impuesto General a las Ventas (18%). */
export const IGV = 0.18;

/**
 * Tarifa al cliente: incluye la tarifa técnica del especialista más
 * el 10% del fondo de garantía y protección del servicio.
 */
export function precioParaElCliente(precioBase: number): number {
  return redondear(precioBase * (1 + COMISION_MARKETPLACE));
}

/** Monto del IGV sobre un subtotal con garantía incluida. */
export function calcularIgv(subtotal: number): number {
  return redondear(subtotal * IGV);
}

/** Total final facturado a cobrar al cliente en custodia. */
export function totalConIgv(subtotal: number): number {
  return redondear(subtotal * (1 + IGV));
}

export function redondear(monto: number): number {
  return Math.round(monto * 100) / 100;
}
