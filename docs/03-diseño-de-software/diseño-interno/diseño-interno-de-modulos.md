# Diseño interno de módulos

> **Proyecto:** ConectaOficios · **Backend:** Node.js + TypeScript · **Módulo de referencia:** Órdenes de Servicio (`ordenes`)  
> **Enfoque arquitectónico:** Clean Architecture dentro de cada módulo del monolito modular  
> **Nivel C4:** 4 – Código · **Versión:** 1.0

---

## 1. Propósito

Este documento describe **cómo se organiza el código dentro de un módulo** de la plataforma ConectaOficios. Tiene tres objetivos:

- Que todos los módulos (Profesionales, Servicios, Solicitudes, Órdenes, Pagos) se construyan con la misma estructura uniforme;
- Que las reglas de negocio de oficios técnicos (cálculo de tarifas, retención en custodia, turnos de visita) queden aisladas de la tecnología;
- Que cualquier integrante del equipo de desarrollo sepa con precisión dónde se ubica cada archivo y qué dependencias tiene permitidas.

---

## 2. Estructura de carpetas

```text
src/
└── modules/
    └── ordenes/
        ├── dominio/
        │   ├── orden-servicio.ts            Entidad OrdenServicio y reglas de negocio
        │   ├── item-servicio.ts             Objeto de valor ItemServicio (oficio, técnico, turno)
        │   ├── estado-orden.ts              Enumeración EstadoOrdenServicio
        │   ├── orden-repository.ts          Interfaz (puerto) de persistencia de órdenes
        │   ├── payment-port.ts              Interfaz (puerto) de cobro en custodia
        │   └── resultado-cobro.ts           DTO de respuesta del cobro
        ├── aplicacion/
        │   ├── contratar-servicio.use-case.ts Caso de uso ContratarServicio
        │   └── contratar-servicio.command.ts  Datos de entrada validados
        ├── infraestructura/
        │   ├── postgres-orden-repository.ts   Implementación con PostgreSQL
        │   ├── stripe-payment.adapter.ts      Implementación con pasarela Stripe
        │   └── niubiz-payment.adapter.ts      Implementación con pasarela Niubiz
        ├── presentacion/
        │   ├── orden.controller.ts          Traduce HTTP ⇄ caso de uso
        │   └── ordenes.routes.ts            Rutas Express /api/v1/ordenes
        ├── ordenes.module.ts                Raíz de composición del módulo
        └── index.ts                         API pública del módulo
```

| Archivo | Capa | Responsabilidad | Importa de |
|---|---|---|---|
| `orden-servicio.ts` | Dominio | Crear órdenes válidas, calcular total con garantía, transicionar estados | Solo dominio |
| `item-servicio.ts` | Dominio | Representar el servicio técnico, especialista asignado y tarifa | Nada |
| `estado-orden.ts` | Dominio | Estados: `PENDIENTE`, `CONFIRMADO`, `EN_EJECUCION`, `COMPLETADO`, `CANCELADO` | Nada |
| `orden-repository.ts` | Dominio | Declarar **qué** persistencia necesita el módulo de órdenes | `orden-servicio.ts` |
| `payment-port.ts` | Dominio | Declarar **qué** se requiere para procesar el cobro en custodia | `resultado-cobro.ts` |
| `resultado-cobro.ts` | Dominio | Estructura del resultado del cobro (aprobación, código de autorización) | Nada |
| `contratar-servicio.use-case.ts` | Aplicación | Coordinar los pasos de la contratación del técnico | Dominio |
| `contratar-servicio.command.ts` | Aplicación | DTO de entrada con datos del cliente, servicio y medio de pago | Nada |
| `postgres-orden-repository.ts` | Infraestructura | Persistir y recuperar órdenes en base de datos PostgreSQL | Dominio + driver de BD |
| `stripe-payment.adapter.ts` | Infraestructura | Traducir `cobrar()` a la API del proveedor Stripe | Dominio + SDK de Stripe |
| `niubiz-payment.adapter.ts` | Infraestructura | Traducir `cobrar()` a la API del proveedor Niubiz | Dominio + SDK de Niubiz |
| `orden.controller.ts` | Presentación | Recibir peticiones HTTP, llamar al caso de uso y responder JSON | Aplicación |
| `ordenes.routes.ts` | Presentación | Mapear endpoints REST `/api/v1/ordenes` | Presentación |
| `ordenes.module.ts` | Composición | Instanciar repositorios y adaptadores concretos e inyectarlos | Todas las capas |
| `index.ts` | Composición | Exponer la interfaz pública que otros módulos pueden consumir | `ordenes.module.ts` |

---

## 3. Capas del módulo y regla de dependencia

![Diagrama de paquetes del módulo de Órdenes](/img/paquetes-modulo-pedidos.png)

**Regla de dependencia:** El código solo puede importar hacia el centro (Dominio). El Dominio no conoce Express, PostgreSQL, Angular ni pasarelas externas.

| Capa | Contiene | Responsabilidad | Puede depender de | **No** puede depender de |
|---|---|---|---|---|
| **Dominio** | Entidades (`OrdenServicio`), objetos de valor (`ItemServicio`), puertos | Reglas de negocio puras (validación de turnos, cálculo de tarifa + 10% de garantía + 18% IGV) | Nada externo | Aplicación, infraestructura, presentación, bases de datos o librerías externas |
| **Aplicación** | Casos de uso (`ContratarServicioUseCase`) | Orquestar el flujo: validar solicitud, llamar a pasarela, guardar orden y notificar al técnico | Dominio | Infraestructura, presentación, Express |
| **Infraestructura** | Repositorios PostgreSQL/memoria, adaptadores de pagos y WhatsApp | Implementar los puertos del dominio usando tecnologías específicas | Dominio, librerías externas | Aplicación, presentación |
| **Presentación** | Controladores, rutas | Traducir peticiones HTTP a comandos de aplicación y viceversa | Aplicación | Infraestructura, base de datos |
| **Composición** | `ordenes.module.ts` | Conectar dependencias concretas en tiempo de ejecución | Todas | — |

---

## 4. Diagrama de clases

![Diagrama de clases del módulo de Órdenes](/img/clases-modulo-pedidos.png)

---

## 5. Flujo de ejecución: contratar servicio de oficio

![Diagrama de secuencia de contratar servicio](/img/secuencia-crear-pedido.png)

| Paso | Origen → Destino | Acción | Capa |
|---|---|---|---|
| 1 | Cliente Web → `OrdenController` | `POST /api/v1/ordenes` con `clienteId`, `servicioId`, fecha, turno y medio de pago | Presentación |
| 2 | `OrdenController` → `ContratarServicioUseCase` | `ejecutar(command)` | Presentación → Aplicación |
| 3 | `ContratarServicioUseCase` → `OrdenServicio` | `crear(clienteId, items, fechaVisita)`; valida reglas de negocio (estado inicial PENDIENTE) | Aplicación → Dominio |
| 4 | `ContratarServicioUseCase` → `OrdenServicio` | `calcularTotal()` (tarifa + garantía de servicio + IGV) | Aplicación → Dominio |
| 5 | `ContratarServicioUseCase` → `PaymentPort` | `cobrarEnCustodia(montoTotal, tokenMedioPago)` | Aplicación → Dominio (puerto) |
| 6 | `NiubizPaymentAdapter` → Pasarela Externa | Petición HTTPS para retención de fondos | Infraestructura → Externo |
| 7 | `ContratarServicioUseCase` → `OrdenServicio` | Si es exitoso: `marcarConfirmado(autorizacion)` | Aplicación → Dominio |
| 8 | `ContratarServicioUseCase` → `OrdenRepository` | `guardar(orden)` | Aplicación → Dominio (puerto) |
| 9 | `PostgresOrdenRepository` → PostgreSQL | Registro transaccional de la orden de servicio | Infraestructura → BD |
| 10 | `ContratarServicioUseCase` → `NotificadorCliente` | Envío de alerta WhatsApp al cliente y al técnico asignado | Aplicación → Dominio (puerto) |
| 11 | `OrdenController` → Cliente Web | `201 Created` con ID de orden y confirmación de visita | Presentación |

---

## 6. Código de referencia

### 6.1 Dominio · Entidad e interfaces

```ts
// dominio/orden-servicio.ts
export class OrdenServicio {
  private constructor(
    readonly id: string,
    readonly clienteId: string,
    private readonly items: ItemServicio[],
    public readonly fechaVisita: string,
    private estado: EstadoOrdenServicio,
    private autorizacion?: string,
  ) {}

  static crear(clienteId: string, items: ItemServicio[], fechaVisita: string): OrdenServicio {
    if (!clienteId) throw new Error('RN-01: La orden de servicio debe tener un cliente');
    if (!items || items.length === 0) throw new Error('RN-02: Debe incluir al menos un servicio técnico');
    if (!fechaVisita) throw new Error('RN-03: Debe especificar la fecha de visita técnica');
    return new OrdenServicio(crypto.randomUUID(), clienteId, items, fechaVisita, EstadoOrdenServicio.PENDIENTE);
  }

  total(): number {
    const subtotal = this.items.reduce((acc, item) => acc + item.tarifaBase, 0);
    const garantiaPlataforma = Math.round(subtotal * 0.10 * 100) / 100;
    const conGarantia = subtotal + garantiaPlataforma;
    return Math.round(conGarantia * 1.18 * 100) / 100;
  }

  marcarConfirmado(autorizacion: string): void {
    if (this.estado !== EstadoOrdenServicio.PENDIENTE) {
      throw new Error('RN-04: Solo una orden pendiente puede ser confirmada');
    }
    this.estado = EstadoOrdenServicio.CONFIRMADO;
    this.autorizacion = autorizacion;
  }
}
```
