// =============================================================
// PRESENTACION · Componente de Solicitud y Contratación Técnica
// =============================================================
// Este componente NO recalcula la comisión ni el IGV por su cuenta:
// le pide el total al carrito/solicitud del dominio. La regla de negocio
// vive en un solo lugar y no puede contradecirse.

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../dominio/modelos/pedido.modelo';
import { LineaCarrito } from '../../dominio/modelos/carrito.modelo';
import { RegistrarCompraCasoUso } from '../../aplicacion/registrar-compra.caso-uso';
import { EstadoCarrito } from '../estado-carrito.servicio';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="solicitud-contenedor">
      <div class="cabecera-solicitud">
        <h2>Mi Solicitud de Contratación Técnica</h2>
        <p>Revise los servicios técnicos seleccionados, programe la fecha y confirme con pago protegido.</p>
      </div>

      @if (estadoCarrito.estaVacio()) {
        <div class="vacio-tarjeta">
          <div class="icono-vacio">📋</div>
          <h3>No tiene servicios técnicos seleccionados</h3>
          <p>Explore nuestro catálogo de electricistas, gasfiteros, carpinteros, cerrajeros y pintores certificados.</p>
        </div>
      } @else {
        <div class="resumen-grid">
          <!-- Lista de servicios técnicos -->
          <div class="panel-servicios">
            <h3>Servicios Técnicos Seleccionados</h3>
            
            <div class="lista-items">
              @for (linea of estadoCarrito.carrito().items; track linea.producto.id) {
                <div class="item-tarjeta">
                  <div class="item-info">
                    <span class="oficio-chip">{{ linea.producto.categoria | uppercase }}</span>
                    <h4>{{ linea.producto.nombre }}</h4>
                    <small>Técnico responsable: {{ linea.producto.sellerId }} · {{ linea.producto.certificacion }}</small>
                  </div>
                  <div class="item-valores">
                    <div class="item-cantidad">Turnos: <strong>{{ linea.cantidad }}</strong></div>
                    <div class="item-precio">Tarifa: S/ {{ precioUnitario(linea) | number:'1.2-2' }}</div>
                    <div class="item-importe">Total: S/ {{ importe(linea) | number:'1.2-2' }}</div>
                    <button class="boton-quitar" (click)="quitar(linea.producto.id)" title="Quitar servicio">✕</button>
                  </div>
                </div>
              }
            </div>

            <div class="datos-visita-card">
              <h3>Datos para la Visita a Domicilio</h3>
              <div class="formulario-visita">
                <div class="campo">
                  <label>Distrito en Ayacucho:</label>
                  <select [(ngModel)]="distrito">
                    <option value="Huamanga Centro">Huamanga Centro</option>
                    <option value="San Juan Bautista">San Juan Bautista</option>
                    <option value="Carmen Alto">Carmen Alto</option>
                    <option value="Jesús Nazareno">Jesús Nazareno</option>
                  </select>
                </div>
                <div class="campo">
                  <label>Dirección exacta / Referencia:</label>
                  <input type="text" [(ngModel)]="direccion" placeholder="Ej. Jr. 28 de Julio 450 - Cerca a la plaza" />
                </div>
                <div class="campo">
                  <label>Turno preferido de atención:</label>
                  <select [(ngModel)]="turno">
                    <option value="Mañana (08:00 - 12:00)">Mañana (08:00 - 12:00)</option>
                    <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                    <option value="Atención de Urgencia">Atención de Urgencia</option>
                  </select>
                </div>
                <div class="campo">
                  <label>Teléfono para alertas WhatsApp:</label>
                  <input type="text" [(ngModel)]="telefono" placeholder="966123456" />
                </div>
              </div>
            </div>
          </div>

          <!-- Desglose de Pago Protegido -->
          <div class="panel-pago">
            <div class="tarjeta-totales">
              <h3>Resumen de Contratación</h3>
              
              <div class="linea-desglose">
                <span>Subtotal técnico (con garantía 10%):</span>
                <strong>S/ {{ estadoCarrito.subtotal() | number:'1.2-2' }}</strong>
              </div>
              <div class="linea-desglose">
                <span>Garantía de Satisfacción ConectaOficios:</span>
                <span class="badge-incluido">Incluida</span>
              </div>
              <div class="linea-desglose">
                <span>IGV (18%):</span>
                <span>S/ {{ calcularMontoIgv() | number:'1.2-2' }}</span>
              </div>
              
              <hr class="divisor" />

              <div class="linea-total">
                <span>Total a Pagar (en custodia):</span>
                <strong class="monto-total">S/ {{ estadoCarrito.total() | number:'1.2-2' }}</strong>
              </div>

              <div class="formulario-tarjeta">
                <label>Número de Tarjeta (Pago Seguro Simulado):
                  <input type="text" [(ngModel)]="medioPago" placeholder="4111111111111111" />
                </label>
                <small class="nota-seguridad">
                  🔒 Sus fondos se retienen de forma segura y solo se liberan tras su visto bueno de la labor realizada.
                </small>

                <button
                  class="boton-confirmar"
                  (click)="confirmarCompra()"
                  [disabled]="procesando()"
                >
                  {{ procesando() ? 'Validando con la pasarela...' : 'Confirmar Contratación con Pago en Custodia' }}
                </button>
              </div>

              @if (mensajeError()) {
                <div class="alerta-error">{{ mensajeError() }}</div>
              }
            </div>
          </div>
        </div>
      }

      @if (pedidoConfirmado(); as pedido) {
        <div class="confirmacion-modal">
          <div class="icono-check">🎉</div>
          <h3>¡Orden de Servicio Confirmada con Éxito!</h3>
          <p class="numero-orden">Código de Orden: <strong>{{ pedido.id }}</strong></p>
          <div class="detalles-confirmacion">
            <p><strong>Monto Retenido en Custodia:</strong> S/ {{ pedido.total | number:'1.2-2' }}</p>
            <p><strong>Código de Autorización Pasarela:</strong> {{ pedido.autorizacion }}</p>
            <p><strong>Estado del Contrato:</strong> <span class="badge-estado">{{ pedido.estadoActual | uppercase }}</span></p>
            <p><strong>Lugar de Visita:</strong> {{ direccion }}, {{ distrito }} ({{ turno }})</p>
          </div>
          <div class="alerta-notificacion">
            📲 <strong>Notificación Enviada:</strong> Se emitió la orden de visita técnica al especialista y se envió la confirmación al cliente por WhatsApp ({{ telefono }}).
          </div>
        </div>
      }
    </section>
  `,
  styles: [`
    .solicitud-contenedor { display: flex; flex-direction: column; gap: 20px; }
    .cabecera-solicitud h2 { margin: 0 0 6px; font-size: 22px; color: #0d3b66; }
    .cabecera-solicitud p { margin: 0; font-size: 14px; color: #64748b; }

    .vacio-tarjeta {
      background: #ffffff;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
      color: #64748b;
    }
    .icono-vacio { font-size: 40px; margin-bottom: 12px; }

    .resumen-grid {
      display: grid;
      grid-template-columns: 1.6fr 1.1fr;
      gap: 24px;
    }

    @media (max-width: 768px) {
      .resumen-grid { grid-template-columns: 1fr; }
    }

    .panel-servicios h3, .panel-pago h3 { margin: 0 0 16px; font-size: 17px; color: #1e293b; }

    .lista-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .item-tarjeta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 18px;
    }
    .oficio-chip {
      background: #e0f2fe; color: #0369a1; font-size: 10px; font-weight: 700;
      padding: 2px 8px; border-radius: 6px; display: inline-block; margin-bottom: 4px;
    }
    .item-info h4 { margin: 0 0 4px; font-size: 15px; color: #0f172a; }
    .item-info small { color: #64748b; font-size: 12px; }

    .item-valores { display: flex; align-items: center; gap: 16px; }
    .item-cantidad { font-size: 13px; color: #334155; }
    .item-precio { font-size: 13px; color: #64748b; }
    .item-importe { font-size: 15px; font-weight: 700; color: #0d3b66; }
    .boton-quitar {
      background: #fee2e2; border: 0; color: #ef4444; border-radius: 6px;
      padding: 6px 10px; cursor: pointer; font-weight: bold; font-size: 12px;
    }
    .boton-quitar:hover { background: #fecaca; }

    .datos-visita-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 18px;
    }
    .formulario-visita {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    @media (max-width: 600px) {
      .formulario-visita { grid-template-columns: 1fr; }
    }
    .campo label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px; }
    .campo input, .campo select {
      width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;
      font-size: 13px; box-sizing: border-box;
    }

    .tarjeta-totales {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .linea-desglose { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 10px; color: #475569; }
    .badge-incluido { color: #16a34a; font-weight: 700; font-size: 12px; }
    .divisor { border: 0; border-top: 1px dashed #cbd5e1; margin: 14px 0; }
    
    .linea-total { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
    .monto-total { font-size: 22px; color: #0d3b66; font-weight: 800; }

    .formulario-tarjeta label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px; }
    .formulario-tarjeta input {
      width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;
      font-size: 14px; font-family: monospace; box-sizing: border-box; margin-bottom: 6px;
    }
    .nota-seguridad { display: block; font-size: 11px; color: #64748b; line-height: 1.4; margin-bottom: 16px; }

    .boton-confirmar {
      width: 100%;
      background: #16a34a;
      color: #ffffff;
      border: 0;
      padding: 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .boton-confirmar:hover { background: #15803d; }
    .boton-confirmar:disabled { background: #94a3b8; cursor: not-allowed; }

    .alerta-error {
      background: #fee2e2; border: 1px solid #ef4444; color: #b91c1c;
      padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 600; margin-top: 12px;
    }

    .confirmacion-modal {
      background: #f0fdf4;
      border: 2px solid #22c55e;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-top: 20px;
    }
    .icono-check { font-size: 40px; margin-bottom: 8px; }
    .confirmacion-modal h3 { margin: 0 0 6px; color: #166534; font-size: 20px; }
    .numero-orden { font-size: 16px; color: #1e293b; margin: 0 0 16px; }
    .detalles-confirmacion {
      background: #ffffff;
      padding: 14px;
      border-radius: 8px;
      display: inline-block;
      text-align: left;
      font-size: 13px;
      color: #334155;
      margin-bottom: 14px;
      border: 1px solid #bbf7d0;
    }
    .detalles-confirmacion p { margin: 4px 0; }
    .badge-estado { background: #dcfce7; color: #15803d; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
    .alerta-notificacion { font-size: 13px; color: #15803d; font-weight: 500; }
  `],
})
export class CarritoComponent {
  private readonly registrarCompra = inject(RegistrarCompraCasoUso);
  readonly estadoCarrito = inject(EstadoCarrito);

  medioPago = '4111111111111111';
  direccion = 'Jr. 28 de Julio 450 - Centro';
  distrito = 'Huamanga Centro';
  turno = 'Mañana (08:00 - 12:00)';
  telefono = '966 123 456';

  readonly mensajeError = signal<string>('');
  readonly procesando = signal<boolean>(false);
  readonly pedidoConfirmado = signal<Pedido | null>(null);

  precioUnitario(linea: LineaCarrito): number {
    return this.estadoCarrito.carrito().precioUnitario(linea.producto);
  }

  importe(linea: LineaCarrito): number {
    return this.estadoCarrito.carrito().importeLinea(linea);
  }

  calcularMontoIgv(): number {
    const subtotal = this.estadoCarrito.subtotal();
    return Math.round(subtotal * 0.18 * 100) / 100;
  }

  quitar(productoId: string): void {
    const nuevo = this.estadoCarrito.carrito().quitar(productoId);
    this.estadoCarrito.actualizar(nuevo);
  }

  async confirmarCompra(): Promise<void> {
    this.mensajeError.set('');
    this.procesando.set(true);
    try {
      const pedido = await this.registrarCompra.ejecutar({
        clienteId: 'CLI-AYACUCHO-01',
        carrito: this.estadoCarrito.carrito(),
        medioPago: this.medioPago,
      });
      this.pedidoConfirmado.set(pedido);
      this.estadoCarrito.vaciar();
    } catch (error) {
      this.mensajeError.set((error as Error).message);
    } finally {
      this.procesando.set(false);
    }
  }
}
