// =============================================================
// INFRAESTRUCTURA · Adaptador de Notificación en Consola
// =============================================================
import { NotificadorCliente } from '../dominio/contratos/notificador-cliente.contrato';

export class NotificadorConsola implements NotificadorCliente {
  async confirmarPedido(clienteId: string, pedidoId: string, total: number): Promise<void> {
    console.log(
      `[ConectaOficios] Cliente ${clienteId}: su orden de servicio ${pedidoId} por S/ ${total} fue confirmada con pago protegido en custodia.`,
    );
  }
}
