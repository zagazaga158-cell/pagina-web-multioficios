# Principios de diseño (SOLID) en ConectaOficios

## Objetivo

Documentar cómo se aplican los principios SOLID en la plataforma ConectaOficios con Clean Architecture, asegurando que las reglas de negocio de servicios multioficios permanezcan desacopladas de las tecnologías de soporte.

## Contexto

- **Estilo:** Monolito modular.
- **Enfoque interno:** Clean Architecture (Presentación, Aplicación, Dominio, Infraestructura).
- **Módulo de referencia:** Órdenes de Servicio (`ordenes`), porque integra base de datos, pasarela de pago en custodia y mensajería de confirmación de visitas.

---

## SOLID en el módulo de Órdenes de Servicio

![SOLID en el módulo de Órdenes](/img/solid-modulo-pedidos.png)

| Principio | Dónde se aplica (Capa) | Cómo se cumple en ConectaOficios | Archivos clave |
|---|---|---|---|
| **S** · Responsabilidad Única | Todas las capas | Cada clase tiene un único motivo para cambiar: el controlador recibe peticiones HTTP, el caso de uso orquesta la contratación técnica, la entidad `OrdenServicio` calcula importes y estados, y el repositorio almacena en BD. | `orden.controller.ts`, `contratar-servicio.caso-uso.ts`, `orden-servicio.modelo.ts`, `repositorio-ordenes-memoria.ts` |
| **O** · Abierto / Cerrado | Infraestructura | Para incorporar un nuevo método de pago (ej. Yape, Plin o Stripe) se crea un nuevo adaptador sin modificar el caso de uso `ContratarServicioCasoUso`. | `procesador-pagos-niubiz.ts`, `procesador-pagos-simulado.ts` |
| **L** · Sustitución de Liskov | Infraestructura | Tanto la pasarela simulada como la real implementan el mismo contrato y devuelven `{ exito: boolean, autorizacion?: string }`; el caso de uso opera de forma idéntica con cualquiera. | `procesador-pagos.contrato.ts`, adaptadores concretos |
| **I** · Segregación de Interfaces | Dominio | Los contratos del dominio son específicos y concisos: `ProcesadorPagos` solo cobra en custodia, `NotificadorCliente` solo envía mensajes y `RepositorioServicios` solo gestiona catálogo técnico. | `procesador-pagos.contrato.ts`, `notificador-cliente.contrato.ts`, `repositorio-servicios.contrato.ts` |
| **D** · Inversión de Dependencias | Aplicación | El caso de uso recibe las interfaces en su constructor y no conoce si se usa PostgreSQL, memoria, Niubiz o WhatsApp; las dependencias se conectan en la raíz de composición. | `contratar-servicio.caso-uso.ts`, `app.config.ts` |

---

## Escenarios comparativos: con y sin SOLID

| Situación del negocio | Sin SOLID | Con SOLID en ConectaOficios |
|---|---|---|
| Se añade pasarela de pago móvil (Yape/Plin) | Se altera todo el código del caso de uso y controladores. | Se crea un nuevo adaptador `ProcesadorPagosYape` y se registra en la raíz de composición. |
| Se cambia el canal de alertas de WhatsApp a SMS | Se reescribe la lógica de notificación en múltiples servicios. | Solo se implementa un adaptador `NotificadorSms` cumpliendo `NotificadorCliente`. |
| Se ejecutan pruebas de contratación | Es obligatorio conectar una base de datos real y realizar cobros bancarios. | Se prueban todas las reglas en milisegundos con adaptadores en memoria (`npm run pruebas`). |
| Se modifica la comisión de garantía del servicio | Se debe rastrear en vistas frontend, backend y consultas SQL. | Se actualiza únicamente la regla en la entidad o función pura de precios del Dominio. |
