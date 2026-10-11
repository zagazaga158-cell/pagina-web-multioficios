// =============================================================
// INFRAESTRUCTURA · Adaptador de Notificación por WhatsApp
// =============================================================
// Cumple el contrato NotificadorCliente. Si se requiere cambiar a
// SMS o Email, se implementa otro adaptador sin tocar Dominio ni Aplicación.

import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { NotificadorCliente } from '../dominio/contratos/notificador-cliente.contrato';

export class NotificadorWhatsApp implements NotificadorCliente {
  constructor(
    private readonly http: HttpClient,
    private readonly urlMensajeria: string,
  ) {}

  async confirmarPedido(clienteId: string, pedidoId: string, total: number): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.urlMensajeria}/mensajes`, {
        destinatario: clienteId,
        texto: `[ConectaOficios] Su orden ${pedidoId} por S/ ${total} fue confirmada con pago protegido en custodia. Su técnico asignado se presentará en el turno acordado.`,
      }),
    );
  }
}
