"use strict";
// =============================================================
// INFRAESTRUCTURA · Adaptador de Repositorio en Memoria
// =============================================================
// Implementa el contrato RepositorioProductos / RepositorioServicios.
// La regla de dependencia se cumple estrictamente: este archivo
// implementa el contrato del Dominio, y el Dominio no sabe que este archivo existe.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioProductosMemoria = void 0;
const producto_modelo_1 = require("../dominio/modelos/producto.modelo");
const CATALOGO_INICIAL = [
    new producto_modelo_1.Producto('SRV-E01', 'Instalación y Mantenimiento de Tableros Eléctricos', 'electricidad', 'electricista', 80.0, 6, 'TEC-01', 'Certificación SENATI Electricista Industrial', 8, 4.9, 'Huamanga Centro'),
    new producto_modelo_1.Producto('SRV-G01', 'Detección y Reparación de Fugas de Agua y Desagüe', 'gasfiteria', 'gasfitero', 65.0, 8, 'TEC-02', 'Acreditación SENCICO Instalaciones Sanitarias', 10, 4.8, 'San Juan Bautista'),
    new producto_modelo_1.Producto('SRV-C01', 'Fabricación y Reparación de Muebles en Melamina y Madera', 'carpinteria', 'carpintero', 90.0, 4, 'TEC-03', 'Maestro Carpintero Certificado CAPECO', 12, 5.0, 'Jesús Nazareno'),
    new producto_modelo_1.Producto('SRV-L01', 'Apertura de Cerraduras y Cambio de Chapas de Seguridad', 'cerrajeria', 'cerrajero', 50.0, 10, 'TEC-04', 'Técnico Cerrajero de Seguridad 24 Horas', 6, 4.9, 'Carmen Alto'),
    new producto_modelo_1.Producto('SRV-P01', 'Pintura Integral de Interiores, Fachadas y Empastado', 'pintura', 'pintor', 75.0, 5, 'TEC-05', 'Pintor Profesional Certificado en Acabados Finos', 7, 4.7, 'Huamanga'),
    new producto_modelo_1.Producto('SRV-E02', 'Cableado Residencial y Diagnóstico de Cortocircuitos', 'electricidad', 'electricista', 95.0, 5, 'TEC-01', 'SENATI - Redes e Instalaciones Residenciales', 8, 4.9, 'San Juan Bautista'),
    new producto_modelo_1.Producto('SRV-G02', 'Instalación y Mantenimiento de Termas Solares y Eléctricas', 'gasfiteria', 'gasfitero', 110.0, 3, 'TEC-02', 'SENCICO - Redes de Agua Caliente y Termas', 10, 4.9, 'Huamanga'),
    new producto_modelo_1.Producto('SRV-C02', 'Ajuste y Reparación de Puertas, Bisagras y Marcos', 'carpinteria', 'carpintero', 55.0, 7, 'TEC-03', 'Ebanistería y Reparación Fina de Carpintería', 12, 4.8, 'Carmen Alto'),
];
class RepositorioProductosMemoria {
    productos = new Map();
    constructor(iniciales = CATALOGO_INICIAL) {
        iniciales.forEach((producto) => this.productos.set(producto.id, producto));
    }
    async listar(filtro) {
        let resultado = [...this.productos.values()];
        if (filtro?.oficio) {
            resultado = resultado.filter((p) => p.oficio === filtro.oficio || p.categoria === filtro.oficio);
        }
        else if (filtro?.mascota) {
            resultado = resultado.filter((p) => p.oficio === filtro.mascota ||
                p.categoria === filtro.mascota ||
                p.mascota === filtro.mascota);
        }
        if (filtro?.categoria) {
            resultado = resultado.filter((p) => p.categoria === filtro.categoria);
        }
        return resultado;
    }
    async buscarPorId(id) {
        return this.productos.get(id) ?? null;
    }
    async guardar(producto) {
        this.productos.set(producto.id, producto);
    }
}
exports.RepositorioProductosMemoria = RepositorioProductosMemoria;
