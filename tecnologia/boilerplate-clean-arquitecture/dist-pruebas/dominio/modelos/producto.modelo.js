"use strict";
// =============================================================
// DOMINIO · Entidad Servicio / Profesional de Oficio
// =============================================================
// Sin Angular, sin HttpClient, sin base de datos.
// Modela un servicio técnico prestado por un profesional capacitado
// (electricista, gasfitero, carpintero, cerrajero, pintor, etc.).
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioTecnico = exports.Producto = exports.CATEGORIAS_PERMITIDAS = exports.CATEGORIAS_OFICIOS = void 0;
exports.CATEGORIAS_OFICIOS = [
    'electricidad',
    'gasfiteria',
    'carpinteria',
    'cerrajeria',
    'pintura',
    'albanileria',
    'general',
    // Categorías base para compatibilidad
    'alimento',
    'higiene',
    'juguete',
    'accesorio',
    'salud',
];
exports.CATEGORIAS_PERMITIDAS = exports.CATEGORIAS_OFICIOS;
class Producto {
    id;
    nombre;
    categoria;
    oficio;
    precioBase;
    stock;
    sellerId;
    certificacion;
    experienciaAnios;
    calificacion;
    distrito;
    constructor(id, nombre, categoria, oficio, // Oficio ('electricista', 'gasfitero', 'carpintero', etc.)
    precioBase, // Tarifa base por visita técnica o diagnóstico
    stock, // Cupos / turnos de atención disponibles en la agenda
    sellerId, // ID del profesional capacitado
    certificacion = 'Técnico Calificado SENATI / CAPECO', experienciaAnios = 5, calificacion = 4.9, distrito = 'Huamanga') {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.oficio = oficio;
        this.precioBase = precioBase;
        this.stock = stock;
        this.sellerId = sellerId;
        this.certificacion = certificacion;
        this.experienciaAnios = experienciaAnios;
        this.calificacion = calificacion;
        this.distrito = distrito;
        if (!nombre || nombre.trim().length < 3) {
            throw new Error('El nombre del producto debe tener al menos 3 caracteres');
        }
        if (precioBase <= 0) {
            throw new Error('El precio debe ser mayor que cero');
        }
        if (!exports.CATEGORIAS_OFICIOS.includes(categoria)) {
            throw new Error(`Categoria no permitida: ${categoria}`);
        }
        if (!Number.isInteger(stock) || stock < 0) {
            throw new Error('El stock debe ser un entero mayor o igual a cero');
        }
        if (!sellerId) {
            throw new Error('Todo producto debe tener un seller responsable');
        }
    }
    // Compatibilidad con contratos
    get mascota() {
        return this.oficio;
    }
    get stockDisponible() {
        return this.stock;
    }
    get cuposDisponibles() {
        return this.stock;
    }
    estaDisponible() {
        return this.stock > 0;
    }
    /** REGLA DE NEGOCIO: solo se puede agendar si hay cupos de turno disponibles. */
    hayStockPara(cantidad) {
        return cantidad > 0 && this.stock >= cantidad;
    }
    /** REGLA DE NEGOCIO: reservar descuenta turnos de la agenda del técnico. */
    descontar(cantidad) {
        if (!this.hayStockPara(cantidad)) {
            throw new Error(`Stock insuficiente para ${this.nombre}`);
        }
        this.stock -= cantidad;
    }
}
exports.Producto = Producto;
exports.ServicioTecnico = Producto;
