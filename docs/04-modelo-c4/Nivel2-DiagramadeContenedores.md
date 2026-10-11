# Nivel 2 · Diagrama de contenedores

> **Proyecto:** ConectaOficios · Plataforma Web de Servicios Multioficios  
> **Modelo:** C4 · Nivel 2 de 4 · **Versión:** 1.0

---

## 1. Objetivo

Abrir la caja «ConectaOficios» del nivel 1 y mostrar los **contenedores** que la forman: las aplicaciones y almacenes de datos que se ejecutan por separado, la tecnología de cada uno y cómo se comunican.

| Aspecto | Descripción |
|---|---|
| Pregunta que responde | ¿De qué piezas ejecutables y de almacenamiento se compone el sistema y qué tecnologías emplean? |
| Audiencia | Arquitectos de software, desarrolladores, devops y docentes evaluadores |
| Qué es un contenedor | Unidad autónoma de ejecución o almacenamiento: SPA web, API REST, base de datos relacional, memoria caché |
| Nivel anterior | `Nivel1-DiagramadeContextodelSistema.md` |
| Siguiente nivel | `Nivel3-Diagrama-de-Componentes.md` |

---

## 2. Diagrama

![Diagrama de contenedores de ConectaOficios](/img/nivel2-contenedores.png)

> Archivo editable: `img/fuentes/nivel2-contenedores.drawio`

---

## 3. Contenedores

| Contenedor | Tecnología | Responsabilidad | Datos que maneja |
|---|---|---|---|
| **Aplicación Web** | SPA · Angular (TypeScript) | Interfaz interactiva y moderna para búsqueda de técnicos por oficio, gestión de perfil profesional, agendamiento de visitas técnicas y panel de contratación. Se ejecuta en el navegador del usuario | Estado reactivo de pantalla (Signals), sesión temporal del usuario |
| **API ConectaOficios** | Node.js + Express (TypeScript) | Expone la API REST, ejecuta los casos de uso, valida reglas de negocio (Clean Architecture) e integra sistemas externos. Monolito modular | Lógica y flujos en memoria; no persiste por sí mismo |
| **Base de Datos** | PostgreSQL | Almacena de forma permanente, consistente y transaccional la información del negocio | Usuarios, técnicos, certificados, oficios, tarifas, solicitudes, órdenes de servicio y calificaciones |
| **Caché** | Redis | Almacena en memoria de alta velocidad las listas de técnicos mejor valorados y especialidades más consultadas | Copia temporal de técnicos y oficios en memoria RAM |

---

## 4. Relaciones

| Origen | Destino | Descripción | Protocolo |
|---|---|---|---|
| Cliente, Técnico, Administrador | Aplicación Web | Acceden y operan mediante navegador web de escritorio o móvil | HTTPS |
| Aplicación Web | API ConectaOficios | Consume endpoints REST para operaciones de negocio | HTTPS / JSON con JWT |
| API ConectaOficios | Base de Datos | Consultas y transacciones ACID | SQL sobre TCP (Puerto 5432) |
| API ConectaOficios | Caché | Lectura y escritura de datos frecuentes | TCP (Puerto 6379) |
| API ConectaOficios | Pasarela de Pago | Solicitud y retención de cobros con tarjeta | HTTPS / REST |
| API ConectaOficios | Notificaciones | Envío de mensajes de confirmación de cita técnica | HTTPS / REST |
| API ConectaOficios | Facturación | Generación de comprobantes de pago por comisión | HTTPS / REST |

---

## 5. Decisiones arquitectónicas reflejadas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Monolito modular en backend | Microservicios distribuidos | Reduce la complejidad operacional, elimina la latencia de red entre servicios y simplifica el despliegue sin perder orden modular |
| SPA en Angular separada de la API REST | Renderizado en servidor tradicional (SSR monolítico acoplado) | Permite una experiencia de usuario fluida e interactiva (Single Page Application) y desacopla el ciclo de vida de frontend y backend |
| PostgreSQL como motor de datos | Base de datos NoSQL sin esquema | Las órdenes de servicio, retenciones de pago y estados contractuales demandan consistencia relacional y transacciones ACID |
| Redis para caché | Consultas repetidas a PostgreSQL | Alivia la carga de la base de datos en búsquedas masivas de oficios en horas pico |
