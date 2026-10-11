# Restricciones

Identificar las **restricciones** que condicionan las decisiones de diseño y arquitectura del sistema.

| ID | Restricción | Descripción |
|---|---|---|
| RC01 | **Aplicación web** | El sistema debe implementarse como una Single Page Application (SPA) accesible desde navegadores web de escritorio y dispositivos móviles. |
| RC02 | **Control de versiones** | El código fuente debe gestionarse mediante Git bajo una estructura modular de ramas y control de cambios. |
| RC03 | **API REST** | La comunicación entre la interfaz de usuario y los servicios del backend debe basarse en el protocolo HTTP y estándar REST con formato JSON. |
| RC04 | **Pasarela de pago** | El sistema debe integrarse con una pasarela de pago externa (simulada y adaptable a Niubiz/Stripe) para pagos con tarjeta y retención en custodia. |
| RC05 | **Servicio de notificaciones** | El sistema debe integrarse con un servicio externo de mensajería (WhatsApp Business API / SMS) para notificar asignaciones y estados de visita técnica. |