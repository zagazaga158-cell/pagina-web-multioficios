# Nivel 3 · Diagrama de componentes

> **Proyecto:** ConectaOficios · **Contenedor detallado:** API ConectaOficios  
> **Modelo:** C4 · Nivel 3 de 4 · **Versión:** 1.0

---

## 1. Objetivo

Abrir el contenedor **API ConectaOficios** del nivel 2 y mostrar sus **componentes**: los módulos que conforman el monolito modular, la responsabilidad de cada uno y cómo colaboran entre sí, con la base de datos, la caché y los sistemas externos.

| Aspecto | Descripción |
|---|---|
| Pregunta que responde | ¿Cómo se divide internamente el backend y cuál es la responsabilidad de cada módulo? |
| Audiencia | Arquitectos de software y desarrolladores del equipo |
| Qué es un componente | Conjunto de funcionalidades con límites claros (Bounded Context / Módulo), accesible mediante una API pública (`index.ts`) |
| Nivel anterior | `Nivel2-DiagramadeContenedores.md` |
| Siguiente nivel | `Nivel4-DiagramadeCodigo.md` |

---

## 2. Diagrama

![Diagrama de componentes de la API ConectaOficios](/img/nivel3-componentes.png)

> Archivo editable: `img/fuentes/nivel3-componentes.drawio`

---

## 3. Componentes

| Componente | Responsabilidad | Funcionalidades principales | Carpeta en el código |
|---|---|---|---|
| **API REST** | Gateway HTTP de entrada | Enrutamiento `/api/v1`, autenticación JWT, validación de payloads y manejo homogéneo de errores | `src/api/` |
| **Usuarios** | Identidad y acceso | Registro de clientes y técnicos, inicio de sesión seguro, autorización por roles (Cliente, Técnico, Administrador) | `src/modules/usuarios/` |
| **Profesionales** | Gestión de técnicos de oficio | Registro de perfil técnico, validación de certificados de capacitación, tarifas y disponibilidad de turnos | `src/modules/profesionales/` |
| **Catálogo de Oficios** | Oferta de servicios técnicos | Categorías de oficio (electricidad, gasfitería, carpintería, cerrajería, pintura), búsqueda y filtros avanzados | `src/modules/catalogo/` |
| **Solicitudes / Agenda** | Planificación previa | Selección de servicio, fecha y turno de visita técnica, especificación del problema a reparar | `src/modules/solicitudes/` |
| **Órdenes de Servicio** | Proceso de contratación | Generación de la orden, cálculo de garantía de servicio (10%) e IGV (18%), ciclo de vida y conformidad | `src/modules/ordenes/` |
| **Pagos** | Procesamiento financiero | Cobro y retención en custodia mediante pasarela externa (Niubiz/Stripe) | `src/modules/pagos/` |
| **Notificaciones** | Alertas y comunicación | Envío de confirmaciones de visita técnica y recordatorios vía WhatsApp y SMS | `src/modules/notificaciones/` |
| **Calificaciones** | Reputación técnica | Registro de valoración en estrellas (1-5) y opiniones verificadas tras la finalización del servicio | `src/modules/calificaciones/` |

---

## 4. Relaciones entre componentes

| Origen | Destino | Descripción | Tipo de comunicación |
|---|---|---|---|
| Aplicación Web | API REST | Envía peticiones HTTP autenticadas | HTTPS / JSON |
| API REST | Módulos de negocio | Despacha la ejecución hacia los casos de uso | Llamada en memoria |
| Profesionales | Usuarios | Asocia el perfil del especialista a su cuenta de usuario | En memoria (`index.ts` público) |
| Catálogo | Profesionales | Vincula servicios con técnicos calificados | En memoria |
| Solicitudes | Catálogo | Valida tarifas base y disponibilidad del oficio | En memoria |
| Órdenes de Servicio | Solicitudes | Convierte la solicitud agendada en orden formal | En memoria |
| Órdenes de Servicio | Pagos | Solicita retención en custodia del importe total | En memoria |
| Órdenes de Servicio | Notificaciones | Notifica la cita al cliente y al técnico seleccionado | Evento / llamada en memoria |
| Calificaciones | Órdenes de Servicio | Verifica que el servicio esté concluido antes de calificar | En memoria |

---

## 5. Relaciones con contenedores y sistemas externos

| Componente | Destino | Descripción | Protocolo | Patrón aplicado |
|---|---|---|---|---|
| Todos los módulos | Base de Datos (PostgreSQL) | Cada módulo gestiona exclusivamente sus propias tablas | SQL sobre TCP | Repository |
| Catálogo | Caché (Redis) | Lee y almacena en memoria los técnicos más destacados | TCP | Decorator |
| Pagos | Pasarela de Pago | Procesa la transacción y retención de fondos | HTTPS / REST | Adapter |
| Notificaciones | Proveedor WhatsApp/SMS | Emite mensajes estructurados a clientes y técnicos | HTTPS / REST | Adapter |

---

## 6. Reglas del monolito modular

1. Todos los módulos se compilan y despliegan juntos dentro del proceso de la API ConectaOficios.
2. La comunicación entre módulos se realiza exclusivamente a través de sus interfaces públicas (`index.ts`).
3. Ningún módulo puede acceder directamente a tablas o esquemas de base de datos de otro módulo.
4. Las integraciones con sistemas externos se encapsulan mediante el patrón **Adapter**, garantizando que el núcleo de negocio sea independiente de proveedores externos.
5. Cada módulo aplica internamente **Clean Architecture**, aislando Dominio, Aplicación, Infraestructura y Presentación.
