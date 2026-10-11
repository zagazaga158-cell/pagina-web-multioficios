// =============================================================
// DOMINIO · Entidad Solicitud de Servicios (Carrito de Servicios)
// =============================================================
// La solicitud es inmutable: agregar o quitar servicios devuelve
// una nueva instancia de Solicitud/Carrito, protegiendo la integridad
// del agendamiento y los cálculos de garantía.

import { Producto } from './producto.modelo';
import { precioParaElCliente, totalConIgv, redondear } from './precios';

export interface LineaCarrito {
  producto: Producto; // Servicio técnico o profesional asignado
  cantidad: number;   // Cantidad de visitas técnicas o turnos requeridos
}

export class Carrito {
  private constructor(private readonly lineas: LineaCarrito[]) {}

  static vacio(): Carrito {
    return new Carrito([]);
  }

  get items(): ReadonlyArray<LineaCarrito> {
    return this.lineas;
  }

  get cantidadDeItems(): number {
    return this.lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
  }

  estaVacio(): boolean {
    return this.lineas.length === 0;
  }

  /** REGLA DE NEGOCIO: no se puede agendar más turnos de los disponibles en la agenda del especialista. */
  agregar(producto: Producto, cantidad: number): Carrito {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor que cero');
    }
    const existente = this.lineas.find((l) => l.producto.id === producto.id);
    const cantidadFinal = (existente?.cantidad ?? 0) + cantidad;

    if (!producto.hayStockPara(cantidadFinal)) {
      throw new Error(`Stock insuficiente para ${producto.nombre}`);
    }

    const nuevas = existente
      ? this.lineas.map((l) =>
          l.producto.id === producto.id ? { producto, cantidad: cantidadFinal } : l,
        )
      : [...this.lineas, { producto, cantidad }];

    return new Carrito(nuevas);
  }

  quitar(productoId: string): Carrito {
    return new Carrito(this.lineas.filter((l) => l.producto.id !== productoId));
  }

  vaciar(): Carrito {
    return Carrito.vacio();
  }

  /** Tarifa unitaria que paga el cliente por turno/visita (incluye garantía del 10%). */
  precioUnitario(producto: Producto): number {
    return precioParaElCliente(producto.precioBase);
  }

  /** Importe de una línea de servicio contratada. */
  importeLinea(linea: LineaCarrito): number {
    return redondear(this.precioUnitario(linea.producto) * linea.cantidad);
  }

  /** Subtotal: suma de las tarifas al cliente con la garantía de protección incluida. */
  calcularSubtotal(): number {
    const suma = this.lineas.reduce(
      (total, linea) => total + this.importeLinea(linea),
      0,
    );
    return redondear(suma);
  }

  /** Total final a retener en custodia, incluyendo el IGV. */
  calcularTotal(): number {
    return totalConIgv(this.calcularSubtotal());
  }
}

// Alias de dominio para mayor expresividad
export { Carrito as SolicitudServicio };
export type { LineaCarrito as LineaServicio };
