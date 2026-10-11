"use strict";
// =============================================================
// DOMINIO · Reglas de precios y tarifas de ConectaOficios
// =============================================================
// Este archivo NO importa nada de Angular ni de librerías externas.
// La comisión de garantía y el IGV son decisiones de NEGOCIO puras:
// protegen al cliente mediante custodia de fondos y formalidad tributaria.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGV = exports.COMISION_GARANTIA = exports.COMISION_MARKETPLACE = void 0;
exports.precioParaElCliente = precioParaElCliente;
exports.calcularIgv = calcularIgv;
exports.totalConIgv = totalConIgv;
exports.redondear = redondear;
/** Comisión de la plataforma por garantía de satisfacción y custodia (10%). */
exports.COMISION_MARKETPLACE = 0.10;
exports.COMISION_GARANTIA = 0.10;
/** Tasa legal del Impuesto General a las Ventas (18%). */
exports.IGV = 0.18;
/**
 * Tarifa al cliente: incluye la tarifa técnica del especialista más
 * el 10% del fondo de garantía y protección del servicio.
 */
function precioParaElCliente(precioBase) {
    return redondear(precioBase * (1 + exports.COMISION_MARKETPLACE));
}
/** Monto del IGV sobre un subtotal con garantía incluida. */
function calcularIgv(subtotal) {
    return redondear(subtotal * exports.IGV);
}
/** Total final facturado a cobrar al cliente en custodia. */
function totalConIgv(subtotal) {
    return redondear(subtotal * (1 + exports.IGV));
}
function redondear(monto) {
    return Math.round(monto * 100) / 100;
}
