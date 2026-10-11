# Requisitos funcionales

## Requisitos funcionales

| ID | Requisito funcional |
|---|---|
| RF01 | El sistema debe permitir buscar servicios técnicos filtrando por oficio (electricidad, gasfitería, carpintería, cerrajería, pintura) y criterios de urgencia. |
| RF02 | El sistema debe permitir consultar el perfil del profesional técnico: años de experiencia, certificaciones acreditadas, calificación promedio en estrellas y tarifa estimada. |
| RF03 | El sistema debe permitir a los profesionales registrar y actualizar sus oficios, tarifas base y disponibilidad horaria. |
| RF04 | El sistema debe permitir agregar, modificar y retirar servicios técnicos de la solicitud de contratación. |
| RF05 | El sistema debe permitir generar una orden de servicio calculando el subtotal, la comisión de garantía del servicio (10%) y el IGV (18%). |
| RF06 | El sistema debe permitir consultar las órdenes de servicio generadas y su estado en tiempo real (Pendiente, Confirmada, En ejecución, Completada, Cancelada). |
| RF07 | El sistema debe permitir al administrador verificar, aprobar y gestionar los perfiles de profesionales capacitados en la plataforma. |
| RF08 | El sistema debe permitir al cliente calificar el desempeño del técnico mediante valoración por estrellas y comentarios una vez finalizado el trabajo. |

---

## Relación entre historias de usuario y requisitos funcionales

| Historia de usuario | Requisitos funcionales relacionados |
|---|---|
| HU01 Buscar y consultar servicios de oficios | RF01, RF02 |
| HU02 Gestionar perfil profesional y oficios | RF03 |
| HU03 Gestionar solicitud de contratación | RF04 |
| HU04 Contratar servicio con pago protegido | RF05, RF06 |
| HU05 Validar y gestionar profesionales capacitados | RF07 |
| HU06 Consultar estado de orden y calificar | RF06, RF08 |