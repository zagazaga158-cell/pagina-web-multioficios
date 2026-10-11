// =============================================================
// APLICACION · Caso de uso: Consultar Catálogo de Servicios
// =============================================================
// Solo importa entidades y contratos del Dominio.
// No conoce Angular, ni HttpClient ni ningún detalle tecnológico.

import { Producto } from '../dominio/modelos/producto.modelo';
import {
  RepositorioProductos,
  FiltroCatalogo,
} from '../dominio/contratos/repositorio-productos.contrato';

export class ConsultarCatalogoCasoUso {
  constructor(private readonly repositorioProductos: RepositorioProductos) {}

  async ejecutar(filtro?: FiltroCatalogo): Promise<Producto[]> {
    const productos = await this.repositorioProductos.listar(filtro);
    // REGLA DE NEGOCIO: el catálogo solo muestra profesionales con turnos disponibles.
    return productos.filter((producto) => producto.estaDisponible());
  }
}

// Alias de aplicación
export { ConsultarCatalogoCasoUso as ConsultarServiciosCasoUso };
