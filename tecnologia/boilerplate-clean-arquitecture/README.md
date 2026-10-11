# ConectaOficios · Plataforma Web de Servicios Multioficios — Arquitectura Limpia con Angular

Curso: **IS-488 Arquitectura de Software** · UNSCH · Semestre 2026-II  
Docente: **Ing. Lizbeth Jaico Quispe**

Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) v18.  
Todo el código —clases, variables, contratos, funciones y comentarios— está en español.

---

## Propósito del Proyecto

**ConectaOficios** es una plataforma web que conecta a clientes (hogares y empresas) con profesionales técnicos capacitados y certificados (electricistas, gasfiteros, carpinteros, cerrajeros, pintores, entre otros). Incorpora un modelo de contratación con **pago protegido en custodia (escrow)** y cálculo transparente de garantías (10%) e impuestos (18% IGV).

El proyecto demuestra de forma práctica y rigurosa los conceptos de:
- **Clean Architecture (Arquitectura Limpia):** El Dominio y los Casos de Uso son agnósticos a Angular y a cualquier librería externa.
- **Monolito Modular:** Alta cohesión y bajo acoplamiento entre módulos funcionales.
- **Inversión de Dependencias (DIP) y Patrón Adapter:** Contratos en el Dominio e implementaciones intercambiables en Infraestructura.

---

## Puesta en marcha

```bash
npm install
npm start          # Inicia la aplicación en http://localhost:4200
npm run pruebas    # Pruebas unitarias puras del dominio, SIN Angular ni navegador
npm run build      # Compilación de producción
```

> **Nota:** No requiere base de datos externa ni credenciales para ejecutarse: arranca de forma inmediata con adaptadores en memoria.

---

## Las cuatro capas de Clean Architecture

```text
src/app/
│
├── dominio/                    ← EL CENTRO. No importa Angular ni nada externo.
│   ├── modelos/
│   │   ├── producto.modelo.ts      entidad ServicioTecnico/Producto y regla de turnos
│   │   ├── carrito.modelo.ts       entidad Solicitud/Carrito inmutable y reglas
│   │   ├── pedido.modelo.ts        entidad OrdenServicio/Pedido y estados
│   │   └── precios.ts              fondo de garantía (10%) e IGV (18%) en UN solo lugar
│   └── contratos/              ← los puertos viven AQUÍ, no afuera
│       ├── repositorio-productos.contrato.ts
│       ├── repositorio-pedidos.contrato.ts
│       ├── procesador-pagos.contrato.ts
│       └── notificador-cliente.contrato.ts
│
├── aplicacion/                 ← CASOS DE USO. Solo importan Dominio.
│   ├── consultar-catalogo.caso-uso.ts
│   ├── agregar-al-carrito.caso-uso.ts
│   └── registrar-compra.caso-uso.ts
│
├── infraestructura/            ← ADAPTADORES. Intercambiables.
│   ├── tokens.ts                   InjectionToken de Angular para cada contrato
│   ├── repositorio-productos-memoria.ts   catálogo de electricistas, gasfiteros, carpinteros...
│   ├── repositorio-productos-http.ts      mismo contrato, consumiendo API REST
│   ├── repositorio-pedidos-memoria.ts
│   ├── procesador-pagos-simulado.ts
│   ├── procesador-pagos-niubiz.ts         adaptador para pasarela real
│   ├── notificador-consola.ts
│   └── notificador-whatsapp.ts            adaptador para WhatsApp Business API
│
├── presentacion/               ← COMPONENTES ANGULAR Y ESTADO REACTIVO
│   ├── estado-carrito.servicio.ts         servicio reactivo con Signals
│   ├── catalogo/catalogo.component.ts     catálogo visual con filtros por oficio
│   └── carrito/carrito.component.ts       formulario de visita domiciliaria y pago en custodia
│
├── app.config.ts               ← RAÍZ DE COMPOSICIÓN (Inyección de dependencias)
└── app.component.ts            ← Componente raíz con navegación y branding
```

---

## Los cuatro momentos clave para sustentar en clase

### 1. El dominio no conoce Angular
Abra `dominio/modelos/producto.modelo.ts` y demuestre que **no tiene ninguna importación de framework**. Contiene reglas de negocio puras (validación de turnos, tarifas y asignación de técnicos certificados).

### 2. El contrato vive en el dominio
Abra `dominio/contratos/repositorio-productos.contrato.ts` y resalte que el contrato está dentro del Dominio. La regla de dependencia establece que quien necesita una operación define cómo la necesita.

### 3. El token es de Angular, el contrato no
Abra `infraestructura/tokens.ts`. Aquí reside `@angular/core` para solventar la desaparición de interfaces de TypeScript en tiempo de compilación. El contrato sigue siendo puro y el mecanismo de inyección queda fuera del Dominio.

### 4. La raíz de composición
Abra `app.config.ts`. Es el **único** archivo donde se acoplan las implementaciones concretas. Cambiar de memoria a HTTP o de pago simulado a Niubiz es solo modificar una línea.
