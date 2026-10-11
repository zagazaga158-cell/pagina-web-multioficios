# Nivel 4 · Diagrama de código

> **Proyecto:** ConectaOficios · **Módulos detallados:** Órdenes de Servicio y Pagos  
> **Modelo:** C4 · Nivel 4 de 4 · **Notación:** UML · **Versión:** 1.0

---

## 1. Objetivo

Mostrar **cómo está organizado el código** en el módulo más crítico del backend: sus clases, interfaces y cómo colaboran en el flujo de **Contratación de Servicio de Oficio con Pago Protegido**.

| Aspecto | Descripción |
|---|---|
| Pregunta que responde | ¿Qué clases existen en el módulo y qué relaciones de herencia, dependencia y composición mantienen? |
| Audiencia | Desarrolladores y evaluadores técnicos |
| Notación | Diagrama de clases y diagrama de secuencia UML |
| Módulos ilustrados | **Órdenes de Servicio** y **Pagos**, por concentrar las reglas de negocio de contratación y la interacción con pasarelas externas |
| Nivel anterior | `Nivel3-Diagrama-de-Componentes.md` |

---

## 2. Diagrama de clases

![Diagrama de clases de los módulos Órdenes y Pagos](/img/nivel4-clases.png)

> Archivo editable: `img/fuentes/nivel4-clases.svg`

### 2.1 Capas de Clean Architecture

| Capa | Contiene | Regla |
|---|---|---|
| **Presentación** | Controladores HTTP | Traduce solicitudes HTTP en llamadas a casos de uso |
| **Aplicación** | Casos de uso | Orquesta el flujo de negocio sin conocer librerías externas |
| **Dominio** | Entidades, objetos de valor e interfaces (puertos) | Contiene la lógica nuclear; no importa nada de capas externas |
| **Infraestructura** | Repositorios y adaptadores | Implementa los contratos del dominio con tecnologías concretas |

### 2.2 Clases del módulo Órdenes de Servicio

| Clase | Tipo | Capa | Responsabilidad |
|---|---|---|---|
| `OrdenController` | Controlador | Presentación | Recibe `POST /api/v1/ordenes` y responde con el resultado de la contratación |
| `ContratarServicioUseCase` | Caso de uso | Aplicación | Valida la solicitud, solicita cobro en custodia, persiste la orden y notifica |
| `OrdenServicio` | Entidad | Dominio | Aplica reglas de negocio: cálculo de garantía (10%), total con IGV y transición de estados |
| `ItemServicio` | Objeto de valor | Dominio | Representa el oficio solicitado, técnico asignado, turno y tarifa base |
| `EstadoOrdenServicio` | Enumeración | Dominio | `PENDIENTE`, `CONFIRMADO`, `EN_EJECUCION`, `COMPLETADO`, `CANCELADO` |
| `OrdenRepository` | Interfaz (puerto) | Dominio | Contrato para guardar y consultar órdenes |
| `NotificadorPort` | Interfaz (puerto) | Dominio | Contrato para emitir confirmaciones de visita técnica |
| `PostgresOrdenRepository` | Repositorio | Infraestructura | Implementa `OrdenRepository` con PostgreSQL |
| `WhatsAppNotificadorAdapter` | Adaptador | Infraestructura | Implementa `NotificadorPort` mediante la API de WhatsApp |

### 2.3 Clases del módulo Pagos

| Clase | Tipo | Capa | Responsabilidad |
|---|---|---|---|
| `ProcesarPagoUseCase` | Caso de uso | Aplicación | Punto de entrada para tramitar pagos y retenciones en custodia |
| `PaymentPort` | Interfaz (puerto) | Dominio | Contrato para ejecutar la transacción con la pasarela |
| `ResultadoCobro` | DTO | Dominio | Información de aprobación (`exito`, `autorizacion`, `mensaje`) |
| `NiubizPaymentAdapter` | Adaptador | Infraestructura | Implementa `PaymentPort` con la pasarela de pagos Niubiz |

---

## 3. Diagrama de secuencia: Contratación de servicio técnico

![Diagrama de secuencia de contratación de servicio](/img/nivel4-secuencia.png)

> Archivo editable: `img/fuentes/nivel4-secuencia.svg`

| Paso | Origen → Destino | Acción |
|---|---|---|
| 1 | Cliente Web → `OrdenController` | Envía `POST /api/v1/ordenes` con datos del oficio, fecha/turno, dirección y token de pago |
| 2 | `OrdenController` → `ContratarServicioUseCase` | Invoca el caso de uso con los parámetros validados |
| 3–4 | `ContratarServicioUseCase` → `OrdenServicio` | Crea la orden en estado `PENDIENTE` y calcula el total (tarifa + garantía 10% + IGV) |
| 5 | `ContratarServicioUseCase` → `ProcesarPagoUseCase` | Solicita cobro en custodia al módulo de Pagos |
| 6–7 | `NiubizPaymentAdapter` → Pasarela Externa | Realiza la transacción segura vía HTTPS |
| 8 | `ContratarServicioUseCase` → `OrdenServicio` | Al confirmarse el cobro, actualiza el estado a `CONFIRMADO` con código de autorización |
| 9 | `ContratarServicioUseCase` → `OrdenRepository` | Almacena la orden en la base de datos |
| 10 | `ContratarServicioUseCase` → `WhatsAppNotificadorAdapter` | Envía mensaje al cliente y al técnico con los datos de la visita programada |
| 11 | `OrdenController` → Cliente Web | Responde `201 Created` con el ID de la orden y la confirmación |

---

## 4. Patrones y principios visibles en este nivel

- **Adapter:** `NiubizPaymentAdapter` y `WhatsAppNotificadorAdapter` traducen llamadas internas a protocolos de proveedores externos.
- **Repository:** `PostgresOrdenRepository` oculta la complejidad del SQL y permite sustituir el motor sin afectar al dominio.
- **Inversión de Dependencias (DIP):** `ContratarServicioUseCase` interactúa exclusivamente con interfaces del Dominio (`OrdenRepository`, `PaymentPort`), garantizando máxima testeabilidad.
