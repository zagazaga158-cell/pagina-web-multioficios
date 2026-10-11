# Escenarios de atributos de calidad de ConectaOficios

## EQ-01. Rendimiento: consulta de técnicos y oficios

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Rendimiento |
| **Fuente** | Cliente |
| **Estímulo** | El cliente busca servicios filtrando por oficio (ej. "gasfiteros de urgencia" o "electricistas certificados") o consulta el perfil y reseñas de un profesional. |
| **Condición** | La plataforma opera bajo condiciones habituales de tráfico. |
| **Respuesta esperada** | El sistema entrega el listado de técnicos disponibles o el perfil detallado sin latencia perceptible. |
| **Medida** | El 95 % de las búsquedas y consultas de perfil responden en menos de 1.5 segundos bajo una carga de hasta 200 usuarios concurrentes. |
| **Verificación** | Pruebas de carga automatizadas midiendo percentil 95 de tiempo de respuesta HTTP y tasa de fallos inferior al 0.5 %. |
| **Estado** | Aprobado para la arquitectura monolítica modular con almacenamiento en caché. |

---

## EQ-02. Disponibilidad: continuidad del servicio y emergencias

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Disponibilidad |
| **Fuente** | Cliente y Técnicos |
| **Estímulo** | El cliente necesita solicitar un técnico para una reparación urgente o registrar la conformidad de un servicio terminado. |
| **Condición** | Operación continua 24/7 en entorno de producción. |
| **Respuesta esperada** | La plataforma procesa las solicitudes sin interrupción; si un servicio externo (como WhatsApp) presenta latencia, el flujo principal no se bloquea (degradación elegante). |
| **Medida** | Disponibilidad mensual global del 99.7 % para los módulos de Catálogo y Contratación. |
| **Verificación** | Monitorización de uptime mediante health-checks y métricas de disponibilidad de endpoints críticos. |
| **Estado** | Aprobado con diseño desacoplado tolerante a fallos externos. |

---

## EQ-03. Escalabilidad: aumento de profesionales y servicios

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Escalabilidad |
| **Fuente** | Campaña de captación de clientes y registro masivo de técnicos de diversos oficios. |
| **Estímulo** | Se triplica la cantidad de solicitudes de contratación concurrentes en un periodo corto. |
| **Condición** | Despliegue en contenedor con balanceo de carga y conexión a base de datos relacional optimizada. |
| **Respuesta esperada** | El sistema procesa el incremento de solicitudes manteniendo la integridad de las transacciones de pago y la agenda de los técnicos. |
| **Medida** | Capacidad de escalar vertical y horizontalmente para soportar 500 solicitudes por minuto sin superar 2.5 segundos de respuesta. |
| **Verificación** | Pruebas de estrés progresivas evaluando uso de CPU, memoria y saturación de conexiones a base de datos. |
| **Estado** | Aprobado bajo el modelo monolítico modular con base de datos particionada lógicamente por módulo. |

---

## EQ-04. Seguridad: acceso a operaciones protegidas y datos domiciliarios

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Seguridad |
| **Fuente** | Usuario malintencionado o sin sesión activa. |
| **Estímulo** | Intento de acceder a domicilios particulares de clientes, modificar tarifas de otros profesionales o alterar el estado de pago de una orden. |
| **Condición** | Peticiones HTTP directas hacia la API REST sin credenciales o con tokens adulterados. |
| **Respuesta esperada** | El sistema deniega el acceso con código HTTP 401/403, registra el intento sospechoso y no expone ninguna información sensible. |
| **Medida** | 100 % de intentos no autorizados bloqueados; datos de pago procesados mediante tokens seguros sin almacenar números de tarjeta en la plataforma. |
| **Verificación** | Pruebas de penetración automatizadas (OWASP Top 10) y validación de autorización por roles (RBAC). |
| **Estado** | Aprobado con autenticación JWT y roles (Cliente, Profesional, Administrador). |

---

## EQ-05. Mantenibilidad: incorporación de nuevos oficios e integraciones

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Mantenibilidad |
| **Fuente** | Equipo de ingeniería y desarrollo. |
| **Estímulo** | Requerimiento de incorporar un nuevo oficio (ej. cerrajería automotriz o mantenimiento de paneles solares) o cambiar el proveedor de pasarela de pago (de Stripe a Niubiz). |
| **Condición** | Ciclo de mantenimiento regular del código fuente. |
| **Respuesta esperada** | El cambio se realiza agregando un nuevo adaptador de infraestructura o actualizando el catálogo sin necesidad de refactorizar las entidades de dominio ni los casos de uso. |
| **Medida** | Tiempo de integración inferior a 1 jornada de desarrollo sin generar regresiones en las pruebas unitarias del dominio. |
| **Verificación** | Ejecución de la suite de pruebas unitarias puras (`npm run pruebas`) sin errores tras la incorporación del nuevo adaptador. |
| **Estado** | Aprobado mediante el cumplimiento de Clean Architecture y principio Open/Closed (OCP). |
