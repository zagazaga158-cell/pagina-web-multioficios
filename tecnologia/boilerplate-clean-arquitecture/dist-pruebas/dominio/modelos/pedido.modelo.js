"use strict";
// =============================================================
// DOMINIO · Entidad Orden de Servicio (Contratación Técnica)
// =============================================================
// Modela el contrato formal de servicio técnico entre el cliente y el
// profesional capacitado, respaldado por la retención en custodia.
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenServicio = exports.Pedido = void 0;
class Pedido {
    id;
    clienteId;
    lineas;
    total;
    autorizacion;
    estado;
    fechaCreacion;
    constructor(id, clienteId, lineas, total, autorizacion, estado, fechaCreacion = new Date()) {
        this.id = id;
        this.clienteId = clienteId;
        this.lineas = lineas;
        this.total = total;
        this.autorizacion = autorizacion;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
    }
    /** REGLA DE NEGOCIO: una orden de servicio no nace vacía ni sin cliente identificado. */
    static crear(clienteId, lineas, total, autorizacion) {
        if (!clienteId)
            throw new Error('Un pedido debe tener un cliente');
        if (lineas.length === 0)
            throw new Error('Un pedido no puede estar vacio');
        if (total <= 0)
            throw new Error('El total del pedido debe ser mayor que cero');
        const id = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        return new Pedido(id, clienteId, lineas, total, autorizacion, 'pagado');
    }
    get estadoActual() {
        return this.estado;
    }
    /**
     * REGLA DE NEGOCIO: Una orden de servicio con fondos en custodia ('pagado')
     * puede cancelarse antes de que el técnico inicie el desplazamiento.
     * Una vez en ejecución o finalizado ('despachado' / 'entregado'), ya no se puede cancelar.
     */
    puedeCancelarse() {
        return this.estado === 'pagado';
    }
    cancelar() {
        if (!this.puedeCancelarse()) {
            throw new Error(`Un pedido ${this.estado} ya no puede cancelarse`);
        }
        this.estado = 'cancelado';
    }
}
exports.Pedido = Pedido;
exports.OrdenServicio = Pedido;
