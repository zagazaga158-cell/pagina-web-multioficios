# Nivel 1 · Diagrama de contexto del sistema

> **Proyecto:** ConectaOficios · Plataforma Web de Servicios Multioficios  
> **Modelo:** C4 · Nivel 1 de 4 · **Versión:** 1.0

---

## 1. Objetivo

Mostrar la **Plataforma ConectaOficios como una sola caja**: quiénes la usan (clientes, profesionales técnicos de diversos oficios y administradores) y con qué sistemas externos se comunica. Es la vista de mayor nivel arquitectónico.

| Aspecto | Descripción |
|---|---|
| Pregunta que responde | ¿Qué es el sistema, quién lo usa y con qué entidades externas se integra? |
| Audiencia | Directivos, docentes evaluadores, equipo de ingeniería y operaciones |
| Qué **no** muestra | Tecnologías internas, bases de datos, librerías ni módulos de código |
| Siguiente nivel | `Nivel2-DiagramadeContenedores.md` |

---

## 2. Diagrama

![Diagrama de contexto de ConectaOficios](/img/nivel1-contexto.png)

> Archivo editable: `img/fuentes/nivel1-contexto.drawio`

---

## 3. Personas (usuarios)

| Persona | Descripción | Qué hace en el sistema |
|---|---|---|
| **Cliente** | Persona u organización que requiere un servicio técnico | Busca profesionales por oficio (electricista, gasfitero, carpintero, cerrajero, pintor), consulta perfiles y credenciales, programa visitas técnicas, paga con fondos protegidos y califica al especialista |
| **Profesional de Oficio** | Técnico calificado y capacitado que ofrece servicios | Registra su perfil, acredita certificados y años de experiencia, define sus tarifas base y horarios de atención, y reporta la culminación de cada labor técnica |
| **Administrador** | Responsable de la operación y confianza de la plataforma | Valida certificaciones técnicas, modera calificaciones, gestiona categorías de oficios y supervisa la resolución de reclamos |

---

## 4. Sistemas

| Sistema | Tipo | Responsabilidad | Quién lo construye |
|---|---|---|---|
| **ConectaOficios** | Sistema en alcance | Intermedia la contratación transparente y segura entre clientes y especialistas técnicos de oficio | El equipo del proyecto |
| **Pasarela de pago** | Sistema externo | Procesa cobros con tarjetas y custodia los fondos de la orden de servicio hasta la conformidad del cliente | Proveedor de pasarela (Niubiz / Stripe) |
| **Servicio de notificaciones** | Sistema externo | Envía notificaciones instantáneas (WhatsApp Business API / SMS) con detalles de citas técnicas y códigos de seguridad | Proveedor de mensajería externa |
| **Facturación electrónica** | Sistema externo | Emite comprobantes de pago autorizados (boletas y facturas) | Operador de Servicios Electrónicos / SUNAT |

---

## 5. Relaciones

| Origen | Destino | Descripción | Protocolo |
|---|---|---|---|
| Cliente | ConectaOficios | Busca especialistas, agenda visitas técnicas y realiza pagos protegidos | HTTPS |
| Profesional | ConectaOficios | Gestiona su perfil, consulta solicitudes y confirma ejecución del servicio | HTTPS |
| Administrador | ConectaOficios | Audita credenciales técnicas y supervisa transacciones | HTTPS |
| ConectaOficios | Pasarela de pago | Solicita autorización y retención de cobros en custodia | HTTPS/REST |
| ConectaOficios | Servicio de notificaciones | Solicita el envío de alertas de visitas programadas | HTTPS/REST |
| ConectaOficios | Facturación electrónica | Envía información de órdenes concluidas para emisión tributaria | HTTPS/REST |

---

## 6. Decisiones y supuestos

| # | Decisión o supuesto | Motivo |
|---|---|---|
| 1 | Las integraciones externas se realizan mediante APIs REST seguras | Estándar de la industria que no compromete las bases de datos de ninguna parte |
| 2 | El sistema **no almacena números ni códigos CVV de tarjetas** | Toda la tokenización financiera es delegada a la pasarela externa conforme a PCI-DSS |
| 3 | Pago con retención en custodia (Escrow) | Protege al cliente ante trabajos inconclusos y garantiza al profesional el pago una vez completada la labor técnica |
