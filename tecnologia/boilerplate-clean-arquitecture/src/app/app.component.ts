// =============================================================
// PRESENTACION · Componente Raíz de ConectaOficios
// =============================================================
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoComponent } from './presentacion/catalogo/catalogo.component';
import { CarritoComponent } from './presentacion/carrito/carrito.component';
import { EstadoCarrito } from './presentacion/estado-carrito.servicio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CatalogoComponent, CarritoComponent],
  template: `
    <div class="contenedor-principal">
      <header class="barra-navegacion">
        <div class="marca-contenedor">
          <div class="logo-icono">⚡🛠️</div>
          <div>
            <h1 class="marca-titulo">ConectaOficios</h1>
            <p class="marca-subtitulo">Plataforma Web de Servicios Multioficios · UNSCH</p>
          </div>
        </div>

        <nav class="pestanias-navegacion">
          <button
            class="boton-nav"
            [class.activo]="vista === 'catalogo'"
            (click)="vista = 'catalogo'"
          >
            🔍 Catálogo de Especialistas
          </button>
          <button
            class="boton-nav boton-carrito"
            [class.activo]="vista === 'carrito'"
            (click)="vista = 'carrito'"
          >
            📋 Mi Solicitud
            @if (estadoCarrito.cantidadDeItems() > 0) {
              <span class="insignia-conteo">{{ estadoCarrito.cantidadDeItems() }}</span>
            }
          </button>
        </nav>
      </header>

      <main class="cuerpo-aplicacion">
        @if (vista === 'catalogo') {
          <app-catalogo />
        } @else {
          <app-carrito />
        }
      </main>

      <footer class="pie-pagina">
        <div class="pie-contenido">
          <p>
            <strong>ConectaOficios</strong> · Proyecto Académico de Arquitectura de Software
          </p>
          <p>
            UNSCH · Escuela Profesional de Ingeniería de Sistemas · Docente: Ing. Lizbeth Jaico Quispe
          </p>
          <div class="tecnologias-badges">
            <span class="badge-tech">Clean Architecture</span>
            <span class="badge-tech">Monolito Modular</span>
            <span class="badge-tech">Angular 18</span>
            <span class="badge-tech">TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .contenedor-principal {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 1140px;
      margin: 0 auto;
      padding: 20px 24px 40px;
      color: #1e293b;
    }

    .barra-navegacion {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      margin-bottom: 24px;
      border-bottom: 2px solid #e2e8f0;
      flex-wrap: wrap;
      gap: 16px;
    }

    .marca-contenedor {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-icono {
      font-size: 32px;
      background: #0d3b66;
      padding: 8px 12px;
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(13, 59, 102, 0.2);
    }
    .marca-titulo {
      color: #0d3b66;
      font-size: 24px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .marca-subtitulo {
      color: #64748b;
      font-size: 13px;
      margin: 2px 0 0;
      font-weight: 500;
    }

    .pestanias-navegacion {
      display: flex;
      gap: 10px;
    }
    .boton-nav {
      padding: 10px 18px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      font-size: 14px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .boton-nav:hover {
      background: #f8fafc;
      border-color: #94a3b8;
    }
    .boton-nav.activo {
      background: #0d3b66;
      color: #ffffff;
      border-color: #0d3b66;
      box-shadow: 0 4px 12px rgba(13, 59, 102, 0.25);
    }

    .insignia-conteo {
      background: #f4d06f;
      color: #0d3b66;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .cuerpo-aplicacion {
      min-height: 480px;
    }

    .pie-pagina {
      margin-top: 50px;
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
      text-align: center;
      color: #64748b;
      font-size: 13px;
    }
    .pie-contenido p { margin: 4px 0; }
    .tecnologias-badges {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .badge-tech {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 14px;
    }
  `],
})
export class AppComponent {
  readonly estadoCarrito = inject(EstadoCarrito);
  vista: 'catalogo' | 'carrito' = 'catalogo';
}
