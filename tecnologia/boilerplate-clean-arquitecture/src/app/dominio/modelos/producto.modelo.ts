// =============================================================
// DOMINIO · Entidad Servicio / Profesional de Oficio
// =============================================================
// Sin Angular, sin HttpClient, sin base de datos.
// Modela un servicio técnico prestado por un profesional capacitado
// (electricista, gasfitero, carpintero, cerrajero, pintor, etc.).

export const CATEGORIAS_OFICIOS = [
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
] as const;

export type CategoriaOficio = (typeof CATEGORIAS_OFICIOS)[number];
export type Categoria = CategoriaOficio;
export const CATEGORIAS_PERMITIDAS = CATEGORIAS_OFICIOS;

export class Producto {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly categoria: CategoriaOficio,
    public readonly oficio: string, // Oficio ('electricista', 'gasfitero', 'carpintero', etc.)
    public readonly precioBase: number, // Tarifa base por visita técnica o diagnóstico
    private stock: number, // Cupos / turnos de atención disponibles en la agenda
    public readonly sellerId: string, // ID del profesional capacitado
    public readonly certificacion: string = 'Técnico Calificado SENATI / CAPECO',
    public readonly experienciaAnios: number = 5,
    public readonly calificacion: number = 4.9,
    public readonly distrito: string = 'Huamanga',
  ) {
    if (!nombre || nombre.trim().length < 3) {
      throw new Error('El nombre del producto debe tener al menos 3 caracteres');
    }
    if (precioBase <= 0) {
      throw new Error('El precio debe ser mayor que cero');
    }
    if (!CATEGORIAS_OFICIOS.includes(categoria)) {
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
  get mascota(): string {
    return this.oficio;
  }

  get stockDisponible(): number {
    return this.stock;
  }

  get cuposDisponibles(): number {
    return this.stock;
  }

  estaDisponible(): boolean {
    return this.stock > 0;
  }

  /** REGLA DE NEGOCIO: solo se puede agendar si hay cupos de turno disponibles. */
  hayStockPara(cantidad: number): boolean {
    return cantidad > 0 && this.stock >= cantidad;
  }

  /** REGLA DE NEGOCIO: reservar descuenta turnos de la agenda del técnico. */
  descontar(cantidad: number): void {
    if (!this.hayStockPara(cantidad)) {
      throw new Error(`Stock insuficiente para ${this.nombre}`);
    }
    this.stock -= cantidad;
  }
}

// Alias de dominio
export { Producto as ServicioTecnico };
