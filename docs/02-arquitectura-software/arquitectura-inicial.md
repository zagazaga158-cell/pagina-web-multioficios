# Arquitectura inicial del sistema

## Diagrama de arquitectura

```mermaid
flowchart TD

%% =========================
%% ACTORES
%% =========================
subgraph ACTORES["ACTORES"]
    Cliente["Cliente (Hogar/Empresa)"]
    Profesional["Profesional de Oficio"]
    Admin["Administrador"]
end

%% =========================
%% PRESENTACIÓN
%% =========================
subgraph PRESENTACION["PRESENTACIÓN"]
    Web["Aplicación Web (SPA Angular)"]
    API["API REST Gateway"]
end

%% =========================
%% LÓGICA DE NEGOCIO
%% =========================
subgraph NEGOCIO["LÓGICA DE NEGOCIO (MONOLITO MODULAR)"]
    Usuarios["Usuarios e Identidad"]
    Profesionales["Gestión de Profesionales"]
    Catalogo["Catálogo de Oficios y Servicios"]
    Solicitudes["Solicitudes y Agenda"]
    Ordenes["Órdenes de Servicio"]
    Calificaciones["Reseñas y Calificaciones"]
end

%% =========================
%% DATOS
%% =========================
subgraph DATOS["DATOS Y RENDIMIENTO"]
    BD["Base de Datos Relacional (PostgreSQL)"]
    Cache["Caché de Especialistas (Redis)"]
end

%% =========================
%% SISTEMAS EXTERNOS
%% =========================
subgraph EXTERNOS["SISTEMAS EXTERNOS"]
    Pago["Pasarela de Pago (Custodia / Tarjetas)"]
    Notificaciones["Servicio Notificaciones (WhatsApp/SMS)"]
    Facturacion["Facturación Electrónica (SUNAT)"]
end

%% =========================
%% FLUJO PRINCIPAL
%% =========================
ACTORES --> Web
Web --> API
API --> NEGOCIO
NEGOCIO --> BD
NEGOCIO --> Cache

%% =========================
%% INTEGRACIONES EXTERNAS
%% =========================
Ordenes --> Pago
Ordenes --> Notificaciones
Ordenes --> Facturacion

%% =========================
%% DISTRIBUCIÓN HORIZONTAL
%% =========================
Cliente ~~~ Profesional
Profesional ~~~ Admin

Usuarios ~~~ Profesionales
Profesionales ~~~ Catalogo
Catalogo ~~~ Solicitudes
Solicitudes ~~~ Ordenes
Ordenes ~~~ Calificaciones

Pago ~~~ Notificaciones
Notificaciones ~~~ Facturacion

%% =========================
%% ESTILOS
%% =========================
style ACTORES fill:#1a365d,stroke:#90cdf4,stroke-width:2px,color:#fff
style PRESENTACION fill:#2d3748,stroke:#cbd5e0,stroke-width:2px,color:#fff
style NEGOCIO fill:#1a202c,stroke:#e2e8f0,stroke-width:2px,color:#fff
style DATOS fill:#2c5282,stroke:#bee3f8,stroke-width:2px,color:#fff
style EXTERNOS fill:#744210,stroke:#fbd38d,stroke-width:2px,color:#fff

style Cliente fill:#2b6cb0,stroke:#fff,color:#fff
style Profesional fill:#2b6cb0,stroke:#fff,color:#fff
style Admin fill:#2b6cb0,stroke:#fff,color:#fff

style Web fill:#4a5568,stroke:#fff,color:#fff
style API fill:#4a5568,stroke:#fff,color:#fff

style Usuarios fill:#2d3748,stroke:#fff,color:#fff
style Profesionales fill:#2d3748,stroke:#fff,color:#fff
style Catalogo fill:#2d3748,stroke:#fff,color:#fff
style Solicitudes fill:#2d3748,stroke:#fff,color:#fff
style Ordenes fill:#2d3748,stroke:#fff,color:#fff
style Calificaciones fill:#2d3748,stroke:#fff,color:#fff

style BD fill:#2b6cb0,stroke:#fff,color:#fff
style Cache fill:#2b6cb0,stroke:#fff,color:#fff

style Pago fill:#b7791f,stroke:#fff,color:#fff
style Notificaciones fill:#b7791f,stroke:#fff,color:#fff
style Facturacion fill:#b7791f,stroke:#fff,color:#fff
```

## Descripción

La arquitectura del sistema **ConectaOficios** se estructura en capas y componentes desacoplados:

- **Presentación:** La aplicación web interactiva desarrollada como SPA en Angular ofrece interfaces específicas para clientes (búsqueda de oficios, solicitud de visita técnica y pagos) y para profesionales técnicos (gestión de perfil, agenda y órdenes). La comunicación hacia el servidor se efectúa mediante una API REST en formato JSON.
- **Lógica de negocio (Monolito Modular con Clean Architecture):** Agrupa los módulos centrales del dominio de servicios:
  - *Usuarios e Identidad:* Registro, inicio de sesión y control de acceso basado en roles.
  - *Gestión de Profesionales:* Validación de técnicos capacitados, acreditaciones y tarifas.
  - *Catálogo de Oficios y Servicios:* Organización por categorías (electricidad, gasfitería, carpintería, cerrajería, pintura, etc.).
  - *Solicitudes y Agenda:* Gestión de visitas programadas y verificación de disponibilidad horaria.
  - *Órdenes de Servicio:* Orquestación de la contratación, estados de avance del trabajo y garantía de satisfacción.
  - *Calificaciones:* Reputación, valoración con estrellas y comentarios verificados.
- **Datos y Rendimiento:** PostgreSQL garantiza la consistencia transaccional y financiera de los contratos y pagos; Redis se utiliza como memoria caché para acelerar la consulta de los técnicos más valorados y oficios frecuentes.
- **Sistemas Externos:** La pasarela de pagos retiene en custodia los fondos de la contratación hasta la conformidad del cliente, mientras que el servicio de mensajería (WhatsApp/SMS) notifica confirmaciones de visita técnica y llegadas a domicilio en tiempo real.