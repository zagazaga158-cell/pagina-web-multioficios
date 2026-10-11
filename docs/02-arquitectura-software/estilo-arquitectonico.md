# Estilo arquitectónico de ConectaOficios

Se utiliza el estilo arquitectónico: **Monolito modular en capas**.

- **Monolito Modular:** Todos los componentes se empaquetan y despliegan de manera unificada para simplificar la infraestructura y la latencia entre servicios, pero manteniendo fronteras de dominio estrictas entre módulos (`Usuarios`, `Profesionales`, `Catalogo`, `Solicitudes`, `Ordenes`, `Pagos`).
- **Capas Concéntricas:** Cada módulo se organiza internamente con Clean Architecture para garantizar alta cohesión interna y bajo acoplamiento externo.

![Arquitectura Monolítica en Capas de ConectaOficios](../../img/ArquitecturaMonoliticaMarketplaceEnCapas.png)