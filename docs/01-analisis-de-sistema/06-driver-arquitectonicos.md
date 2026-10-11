# Drivers arquitectónicos

Los **drivers arquitectónicos** identificados para la plataforma de multioficios son los siguientes:

| ID | Driver arquitectónico | Origen | ¿Por qué influye en la arquitectura? |
|---|---|---|---|
| DA01 | El sistema debe soportar picos de demanda durante temporadas de alta solicitud de reparaciones del hogar (cambios de estación, emergencias). | AC03 – Escalabilidad | Determina la estrategia de almacenamiento en caché, desacoplamiento de componentes y despliegue modular. |
| DA02 | El sistema debe mantener tiempos de respuesta inmediatos en la búsqueda y filtrado de profesionales por oficio. | AC01 – Rendimiento | Influye en el diseño de consultas, el uso de memoria caché en el catálogo de oficios y paginación eficiente. |
| DA03 | El sistema debe salvaguardar la privacidad de las direcciones domiciliarias y procesar pagos en custodia de forma segura. | AC04 – Seguridad | Condiciona el modelo de autenticación (JWT), cifrado de datos sensibles y cumplimiento de estándares de pago. |
| DA04 | El sistema debe integrarse con pasarelas de pago y servicios de mensajería (WhatsApp/SMS) mediante API externa. | RC04, RC05 – Integraciones | Exige el uso de patrones desacopladores como Adapter e Inversión de Dependencias (DIP) para no atar el negocio a proveedores externos. |
| DA05 | La plataforma debe desacoplar completamente la aplicación web del servidor mediante una API REST bien documentada. | RC03 – API REST | Define una arquitectura orientada a servicios ligeros (SPA en frontend y monolito modular en backend). |
| DA06 | La plataforma debe permitir incorporar nuevos oficios o reglas de tarificación sin alterar el flujo de contratación existente. | AC05 – Mantenibilidad | Influye directamente en la adopción de Clean Architecture, separando entidades de dominio de la infraestructura tecnológica. |