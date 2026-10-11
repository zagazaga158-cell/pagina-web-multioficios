"use strict";
// =============================================================
// APLICACION · Caso de uso: Consultar Catálogo de Servicios
// =============================================================
// Solo importa entidades y contratos del Dominio.
// No conoce Angular, ni HttpClient ni ningún detalle tecnológico.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarServiciosCasoUso = exports.ConsultarCatalogoCasoUso = void 0;
class ConsultarCatalogoCasoUso {
    repositorioProductos;
    constructor(repositorioProductos) {
        this.repositorioProductos = repositorioProductos;
    }
    async ejecutar(filtro) {
        const productos = await this.repositorioProductos.listar(filtro);
        // REGLA DE NEGOCIO: el catálogo solo muestra profesionales con turnos disponibles.
        return productos.filter((producto) => producto.estaDisponible());
    }
}
exports.ConsultarCatalogoCasoUso = ConsultarCatalogoCasoUso;
exports.ConsultarServiciosCasoUso = ConsultarCatalogoCasoUso;
