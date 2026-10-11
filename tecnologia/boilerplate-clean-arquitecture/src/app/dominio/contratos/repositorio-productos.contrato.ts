// =============================================================
// DOMINIO · CONTRATO DE REPOSITORIO DE SERVICIOS
// =============================================================
// Este contrato vive en el DOMINIO, no en la infraestructura.
// Define qué operaciones de consulta y persistencia de profesionales
// y oficios técnicos necesita la plataforma.

import { Producto } from '../modelos/producto.modelo';

export interface FiltroCatalogo {
  oficio?: string;
  categoria?: string;
  mascota?: string; // Mantenido para retrocompatibilidad
}

export interface RepositorioProductos {
  listar(filtro?: FiltroCatalogo): Promise<Producto[]>;
  buscarPorId(id: string): Promise<Producto | null>;
  guardar(producto: Producto): Promise<void>;
}

// Alias de dominio
export type FiltroServicios = FiltroCatalogo;
export type RepositorioServicios = RepositorioProductos;
