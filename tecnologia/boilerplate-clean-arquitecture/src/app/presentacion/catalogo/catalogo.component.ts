// =============================================================
// PRESENTACION · Componente del Catálogo de Multioficios
// =============================================================
// El componente NO calcula precios ni valida stock: le pide todo
// a los casos de uso del dominio. Su única responsabilidad es
// presentar los técnicos disponibles y capturar las interacciones.

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../dominio/modelos/producto.modelo';
import { precioParaElCliente } from '../../dominio/modelos/precios';
import { ConsultarCatalogoCasoUso } from '../../aplicacion/consultar-catalogo.caso-uso';
import { AgregarAlCarritoCasoUso } from '../../aplicacion/agregar-al-carrito.caso-uso';
import { EstadoCarrito } from '../estado-carrito.servicio';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="catalogo-contenedor">
      <div class="banner-presentacion">
        <div class="banner-info">
          <h2>Técnicos y Profesionales Capacitados</h2>
          <p>
            Encuentra electricistas, gasfiteros, carpinteros, cerrajeros y pintores certificados
            para reparaciones, mantenimiento e instalaciones seguras en tu hogar o empresa.
          </p>
        </div>
        <div class="insignia-garantia">
          <span class="icono-escudo">🛡️</span>
          <div>
            <strong>Garantía ConectaOficios</strong>
            <small>Pago protegido en custodia hasta tu conformidad</small>
          </div>
        </div>
      </div>

      <!-- Barra de Filtros por Oficio -->
      <div class="barra-filtros">
        <div class="chips-oficios">
          <button
            class="chip"
            [class.chip-activo]="oficioSeleccionado() === ''"
            (click)="filtrarPorOficio('')"
          >
            Todos los oficios
          </button>
          <button
            class="chip"
            [class.chip-activo]="oficioSeleccionado() === 'electricista'"
            (click)="filtrarPorOficio('electricista')"
          >
            ⚡ Electricidad
          </button>
          <button
            class="chip"
            [class.chip-activo]="oficioSeleccionado() === 'gasfitero'"
            (click)="filtrarPorOficio('gasfitero')"
          >
            🔧 Gasfitería
          </button>
          <button
            class="chip"
            [class.chip-activo]="oficioSeleccionado() === 'carpintero'"
            (click)="filtrarPorOficio('carpintero')"
          >
            🪚 Carpintería
          </button>
          <button
            class="chip"
            [class.chip-activo]="oficioSeleccionado() === 'cerrajero'"
            (click)="filtrarPorOficio('cerrajero')"
          >
            🔑 Cerrajería
          </button>
          <button
            class="chip"
            [class.chip-activo]="oficioSeleccionado() === 'pintor'"
            (click)="filtrarPorOficio('pintor')"
          >
            🎨 Pintura y Acabados
          </button>
        </div>

        <div class="contador-disponibles">
          <span>{{ productos().length }} especialistas disponibles</span>
        </div>
      </div>

      @if (mensajeError()) {
        <div class="alerta-error">
          <span>⚠️ {{ mensajeError() }}</span>
        </div>
      }

      @if (mensajeExito()) {
        <div class="alerta-exito">
          <span>✅ {{ mensajeExito() }}</span>
        </div>
      }

      <!-- Rejilla de Especialistas Técnicos -->
      <div class="rejilla-servicios">
        @for (servicio of productos(); track servicio.id) {
          <article class="tarjeta-servicio">
            <div class="tarjeta-cabecera">
              <span class="etiqueta-categoria" [attr.data-categoria]="servicio.categoria">
                {{ obtenerIconoOficio(servicio.oficio) }} {{ servicio.categoria | uppercase }}
              </span>
              <span class="insignia-certificacion" title="Certificación oficial verificada">
                ✓ Capacitado
              </span>
            </div>

            <h3 class="servicio-titulo">{{ servicio.nombre }}</h3>

            <div class="perfil-tecnico">
              <div class="avatar-tecnico">👨‍🔧</div>
              <div class="datos-tecnico">
                <strong>{{ obtenerNombreTecnico(servicio.sellerId) }}</strong>
                <span class="certificacion-texto">{{ servicio.certificacion }}</span>
              </div>
            </div>

            <div class="detalles-fila">
              <div class="calificacion-caja">
                <span class="estrellas">⭐ {{ servicio.calificacion }}</span>
                <span class="experiencia">({{ servicio.experienciaAnios }} años exp.)</span>
              </div>
              <div class="ubicacion">
                📍 {{ servicio.distrito }}
              </div>
            </div>

            <div class="tarifa-bloque">
              <div class="precios-info">
                <span class="etiqueta-precio">Tarifa por visita / diagnóstico</span>
                <span class="precio-monto">S/ {{ precioFinal(servicio) | number:'1.2-2' }}</span>
                <small class="precio-detalle">Base S/ {{ servicio.precioBase | number:'1.2-2' }} + 10% garantía</small>
              </div>
              <div class="turnos-disponibles">
                <span class="indicador-cupos">●</span> {{ servicio.stockDisponible }} turnos libres
              </div>
            </div>

            <button
              class="boton-contratar"
              (click)="agregar(servicio)"
              [disabled]="!servicio.estaDisponible()"
            >
              {{ servicio.estaDisponible() ? 'Solicitar Visita Técnica' : 'Sin turnos disponibles' }}
            </button>
          </article>
        } @empty {
          <div class="estado-vacio">
            <p>No se encontraron especialistas disponibles para el oficio seleccionado.</p>
            <button class="chip chip-activo" (click)="filtrarPorOficio('')">Ver todos los oficios</button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .catalogo-contenedor { display: flex; flex-direction: column; gap: 20px; }
    
    .banner-presentacion {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #0d3b66 0%, #001e3d 100%);
      color: #fff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    }
    .banner-info h2 { margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #f4d06f; }
    .banner-info p { margin: 0; font-size: 14px; opacity: 0.9; max-width: 620px; line-height: 1.5; }
    
    .insignia-garantia {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      padding: 12px 18px;
      border-radius: 10px;
    }
    .icono-escudo { font-size: 28px; }
    .insignia-garantia strong { display: block; font-size: 14px; color: #fff; }
    .insignia-garantia small { font-size: 12px; color: #cbd5e0; }

    .barra-filtros {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      background: #ffffff;
      padding: 14px 18px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .chips-oficios { display: flex; gap: 8px; flex-wrap: wrap; }
    .chip {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .chip:hover { background: #e2e8f0; color: #0f172a; }
    .chip-activo { background: #0d3b66; color: #ffffff; border-color: #0d3b66; }
    
    .contador-disponibles { font-size: 13px; color: #64748b; font-weight: 500; }

    .alerta-error {
      background: #fee2e2; border: 1px solid #ef4444; color: #b91c1c;
      padding: 12px; border-radius: 8px; font-weight: 600; font-size: 14px;
    }
    .alerta-exito {
      background: #dcfce7; border: 1px solid #22c55e; color: #15803d;
      padding: 12px; border-radius: 8px; font-weight: 600; font-size: 14px;
    }

    .rejilla-servicios {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 20px;
    }

    .tarjeta-servicio {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .tarjeta-servicio:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      border-color: #cbd5e1;
    }

    .tarjeta-cabecera {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .etiqueta-categoria {
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
      letter-spacing: 0.5px;
    }
    .insignia-certificacion {
      background: #ecfdf5;
      color: #047857;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #a7f3d0;
    }

    .servicio-titulo {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 12px;
      min-height: 44px;
      line-height: 1.35;
    }

    .perfil-tecnico {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 12px;
    }
    .avatar-tecnico {
      font-size: 24px;
      background: #e2e8f0;
      padding: 4px 8px;
      border-radius: 50%;
    }
    .datos-tecnico strong {
      display: block;
      font-size: 13px;
      color: #1e293b;
    }
    .certificacion-texto {
      display: block;
      font-size: 11px;
      color: #64748b;
    }

    .detalles-fila {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      font-size: 12px;
    }
    .estrellas { color: #d97706; font-weight: 700; }
    .experiencia { color: #64748b; margin-left: 4px; }
    .ubicacion { color: #475569; font-weight: 500; }

    .tarifa-bloque {
      border-top: 1px dashed #e2e8f0;
      padding-top: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .etiqueta-precio { display: block; font-size: 11px; color: #64748b; margin-bottom: 2px; }
    .precio-monto { display: block; font-size: 20px; font-weight: 800; color: #0d3b66; }
    .precio-detalle { font-size: 10px; color: #94a3b8; }
    .turnos-disponibles { font-size: 12px; color: #16a34a; font-weight: 600; }
    .indicador-cupos { color: #22c55e; font-size: 14px; }

    .boton-contratar {
      width: 100%;
      background: #0d3b66;
      color: #ffffff;
      border: 0;
      padding: 12px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .boton-contratar:hover { background: #00254d; }
    .boton-contratar:disabled { background: #94a3b8; cursor: not-allowed; }

    .estado-vacio {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      background: #fff;
      border-radius: 12px;
      border: 1px dashed #cbd5e1;
    }
  `],
})
export class CatalogoComponent implements OnInit {
  private readonly consultarCatalogo = inject(ConsultarCatalogoCasoUso);
  private readonly agregarAlCarrito = inject(AgregarAlCarritoCasoUso);
  private readonly estadoCarrito = inject(EstadoCarrito);

  readonly productos = signal<Producto[]>([]);
  readonly oficioSeleccionado = signal<string>('');
  readonly mensajeError = signal<string>('');
  readonly mensajeExito = signal<string>('');

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  private async cargar(oficio?: string): Promise<void> {
    const filtro = oficio ? { oficio, mascota: oficio } : undefined;
    this.productos.set(await this.consultarCatalogo.ejecutar(filtro));
  }

  async filtrarPorOficio(oficio: string): Promise<void> {
    this.oficioSeleccionado.set(oficio);
    await this.cargar(oficio || undefined);
  }

  // Compatibilidad con versiones previas
  async filtrarPorMascota(filtro: string): Promise<void> {
    await this.filtrarPorOficio(filtro);
  }

  precioFinal(servicio: Producto): number {
    return precioParaElCliente(servicio.precioBase);
  }

  obtenerIconoOficio(oficio: string): string {
    switch (oficio.toLowerCase()) {
      case 'electricista': return '⚡';
      case 'gasfitero': return '🔧';
      case 'carpintero': return '🪚';
      case 'cerrajero': return '🔑';
      case 'pintor': return '🎨';
      default: return '🛠️';
    }
  }

  obtenerNombreTecnico(sellerId: string): string {
    switch (sellerId) {
      case 'TEC-01': return 'Ing. Carlos Mendoza (Electricidad)';
      case 'TEC-02': return 'Mtro. José Huamán (Gasfitería)';
      case 'TEC-03': return 'Mtro. Pedro Quispe (Carpintería)';
      case 'TEC-04': return 'Téc. Luis Alarcón (Cerrajería)';
      case 'TEC-05': return 'Mtro. Raúl Gómez (Pintura)';
      default: return 'Técnico Especialista Calificado';
    }
  }

  async agregar(servicio: Producto): Promise<void> {
    this.mensajeError.set('');
    this.mensajeExito.set('');
    try {
      const nuevoCarrito = await this.agregarAlCarrito.ejecutar({
        carritoActual: this.estadoCarrito.carrito(),
        productoId: servicio.id,
        cantidad: 1,
      });
      this.estadoCarrito.actualizar(nuevoCarrito);
      this.mensajeExito.set(`"${servicio.nombre}" fue añadido a su solicitud.`);
      setTimeout(() => this.mensajeExito.set(''), 3500);
    } catch (error) {
      this.mensajeError.set((error as Error).message);
      setTimeout(() => this.mensajeError.set(''), 4000);
    }
  }
}
