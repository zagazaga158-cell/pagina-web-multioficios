# Patrones de diseño en ConectaOficios

## Objetivo

Documentar los patrones de diseño aplicados en el backend de ConectaOficios, indicando dónde se usan, qué problema resuelven y con qué tecnología se implementan, para que el equipo programe de forma uniforme y desacoplada.

## Contexto

- **Estilo:** Monolito modular (Node.js + Express / TypeScript).
- **Enfoque interno:** Clean Architecture (Dominio, Aplicación, Infraestructura, Presentación).
- **Base:** Diagrama de componentes (C4 nivel 3).

## Patrones aplicados

| Patrón | Dónde se usa | Problema que resuelve | Se implementa con | Archivos en el código |
|---|---|---|---|---|
| **Adapter** | Órdenes / Pagos → Pasarela de pago | Las pasarelas de pago (Niubiz, Stripe) tienen APIs heterogéneas | SDK o API REST de la pasarela | `procesador-pagos.contrato.ts`, `procesador-pagos-niubiz.ts`, `procesador-pagos-simulado.ts` |
| **Adapter** | Órdenes → Notificaciones | Los clientes y técnicos reciben alertas por WhatsApp o SMS con formatos propios | API de WhatsApp Business / SMS | `notificador-cliente.contrato.ts`, `notificador-whatsapp.ts`, `notificador-consola.ts` |
| **Repository** | Todos los módulos → Base de datos | El dominio de oficios no debe conocer SQL ni detalles de PostgreSQL | PostgreSQL / Map en memoria | `repositorio-servicios.contrato.ts`, `repositorio-servicios-memoria.ts`, `repositorio-ordenes-memoria.ts` |
| **Decorator** | Catálogo → Caché | Acelerar la consulta de especialistas mejor calificados sin modificar el repositorio | Redis / In-memory Cache | `repositorio-servicios-cache.decorator.ts` |

## Cómo funciona cada patrón

| Patrón | En pocas palabras |
|---|---|
| **Adapter** | **Traduce:** El caso de uso invoca `procesarCobro(monto)` y el adaptador lo traduce al formato exacto requerido por Niubiz o Stripe. Lo mismo ocurre con `notificarConfirmacionVisita()` para enviar el mensaje vía WhatsApp. |
| **Repository** | **Abstrae el almacenamiento:** El dominio dice `guardar(ordenServicio)` y el repositorio ejecuta la sentencia `INSERT` o la actualización en memoria, encapsulando la tecnología de persistencia. |
| **Decorator** | **Agrega comportamiento transparente:** Consulta primero en Redis; si los técnicos de un oficio están en caché, los devuelve de inmediato; si no, delega en el repositorio SQL y almacena el resultado en caché para futuras consultas. |

## Beneficios obtenidos

- Es posible intercambiar la pasarela de pagos (por ejemplo de Niubiz a Stripe o PayPal) sin alterar ni una sola línea de la lógica de contratación.
- Se puede sustituir el mecanismo de mensajería (WhatsApp, SMS, correo) manteniendo intacto el caso de uso.
- Permite ejecutar pruebas unitarias ultrarrápidas en memoria sin necesidad de levantar bases de datos ni servicios externos.