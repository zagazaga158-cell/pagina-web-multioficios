"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificadorConsola = void 0;
class NotificadorConsola {
    async confirmarPedido(clienteId, pedidoId, total) {
        console.log(`[ConectaOficios] Cliente ${clienteId}: su orden de servicio ${pedidoId} por S/ ${total} fue confirmada con pago protegido en custodia.`);
    }
}
exports.NotificadorConsola = NotificadorConsola;
