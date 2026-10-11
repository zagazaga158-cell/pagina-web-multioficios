// =============================================================
// INFRAESTRUCTURA · Adaptador HTTP REST
// =============================================================
// Cumple EL MISMO contrato que la versión en memoria, pero consumiendo
// una API REST real. Cambiar entre memoria y HTTP solo requiere cambiar
// una línea en app.config.ts. Ni el dominio ni los casos de uso se enteran.

import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Producto, CategoriaOficio } from '../dominio/modelos/producto.modelo';
import {
  RepositorioProductos,
  FiltroCatalogo,
} from '../dominio/contratos/repositorio-productos.contrato';

interface ProductoJson {
  id: string;
  nombre: string;
  categoria: string;
  oficio?: string;
  mascota?: string;
  precio: number;
  stock: number;
  sellerId: string;
  certificacion?: string;
  experienciaAnios?: number;
  calificacion?: number;
  distrito?: string;
}

export class RepositorioProductosHttp implements RepositorioProductos {
  constructor(
    private readonly http: HttpClient,
    private readonly urlBase: string,
  ) {}

  async listar(filtro?: FiltroCatalogo): Promise<Producto[]> {
    const parametros: Record<string, string> = {};
    if (filtro?.oficio) parametros['oficio'] = filtro.oficio;
    if (filtro?.mascota) parametros['mascota'] = filtro.mascota;
    if (filtro?.categoria) parametros['categoria'] = filtro.categoria;

    const respuesta = await firstValueFrom(
      this.http.get<ProductoJson[]>(`${this.urlBase}/servicios`, { params: parametros }),
    );
    return respuesta.map((json) => this.aEntidad(json));
  }

  async buscarPorId(id: string): Promise<Producto | null> {
    const json = await firstValueFrom(
      this.http.get<ProductoJson>(`${this.urlBase}/servicios/${id}`),
    );
    return json ? this.aEntidad(json) : null;
  }

  async guardar(producto: Producto): Promise<void> {
    await firstValueFrom(
      this.http.put(`${this.urlBase}/servicios/${producto.id}`, {
        stock: producto.stockDisponible,
      }),
    );
  }

  /** Traduce el JSON recibido de la API a una entidad pura del dominio. */
  private aEntidad(json: ProductoJson): Producto {
    return new Producto(
      json.id,
      json.nombre,
      json.categoria as CategoriaOficio,
      json.oficio || json.mascota || 'general',
      json.precio,
      json.stock,
      json.sellerId,
      json.certificacion || 'Técnico Calificado SENATI / CAPECO',
      json.experienciaAnios ?? 5,
      json.calificacion ?? 4.9,
      json.distrito || 'Huamanga',
    );
  }
}
