"use strict";
// =============================================================
// PRUEBAS DEL DOMINIO — SIN ANGULAR (ConectaOficios)
// =============================================================
// Este archivo se compila y se ejecuta con Node y TypeScript
// puro, SIN Angular, SIN navegador y SIN servidor.
//
// Demuestra que el Dominio y los Casos de Uso son totalmente
// independientes del framework web.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const producto_modelo_1 = require("../dominio/modelos/producto.modelo");
const carrito_modelo_1 = require("../dominio/modelos/carrito.modelo");
const pedido_modelo_1 = require("../dominio/modelos/pedido.modelo");
const precios_1 = require("../dominio/modelos/precios");
const registrar_compra_caso_uso_1 = require("../aplicacion/registrar-compra.caso-uso");
const agregar_al_carrito_caso_uso_1 = require("../aplicacion/agregar-al-carrito.caso-uso");
const consultar_catalogo_caso_uso_1 = require("../aplicacion/consultar-catalogo.caso-uso");
const repositorio_productos_memoria_1 = require("../infraestructura/repositorio-productos-memoria");
const repositorio_pedidos_memoria_1 = require("../infraestructura/repositorio-pedidos-memoria");
const procesador_pagos_simulado_1 = require("../infraestructura/procesador-pagos-simulado");
const notificador_consola_1 = require("../infraestructura/notificador-consola");
let pasadas = 0;
async function prueba(nombre, fn) {
    try {
        await fn();
        pasadas++;
        console.log(`   OK    ${nombre}`);
    }
    catch (error) {
        console.log(`   FALLO ${nombre}: ${error.message}`);
        process.exitCode = 1;
    }
}
function productoDemo(stock = 10) {
    return new producto_modelo_1.Producto('PR001', 'Servicio Electricista - Tableros Eléctricos', 'electricidad', 'electricista', 100, stock, 'TEC-01', 'SENATI Electricista Industrial', 8, 4.9, 'Huamanga');
}
async function main() {
    const inicio = Date.now();
    console.log('\n=== PRUEBAS DEL DOMINIO DE CONECTAOFICIOS (sin Angular, sin navegador) ===\n');
    console.log('-- Entidad Producto / Servicio Técnico');
    await prueba('un servicio técnico con tarifa cero es inválido', () => {
        assert_1.default.throws(() => new producto_modelo_1.Producto('P1', 'Instalación', 'electricidad', 'electricista', 0, 5, 'TEC-01'), /mayor que cero/);
    });
    await prueba('no se puede reservar más turnos de los disponibles en la agenda', () => {
        const servicio = productoDemo(3);
        assert_1.default.throws(() => servicio.descontar(5), /Stock insuficiente/);
    });
    await prueba('descontar reduce los turnos disponibles en la agenda del especialista', () => {
        const servicio = productoDemo(10);
        servicio.descontar(4);
        assert_1.default.strictEqual(servicio.stockDisponible, 6);
    });
    console.log('\n-- Reglas de Precio y Garantía de ConectaOficios');
    await prueba('la tarifa al cliente incluye el 10% del fondo de garantía y protección', () => {
        assert_1.default.strictEqual((0, precios_1.precioParaElCliente)(100), 110);
    });
    await prueba('el total final incluye el IGV legal (18%)', () => {
        assert_1.default.strictEqual((0, precios_1.totalConIgv)(100), 118);
    });
    console.log('\n-- Entidad Carrito / Solicitud de Servicios');
    await prueba('la solicitud de contratación vacía no tiene servicios', () => {
        assert_1.default.strictEqual(carrito_modelo_1.Carrito.vacio().estaVacio(), true);
    });
    await prueba('agregar dos veces el mismo servicio técnico acumula la cantidad de turnos', () => {
        const servicio = productoDemo(10);
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(servicio, 2).agregar(servicio, 3);
        assert_1.default.strictEqual(carrito.cantidadDeItems, 5);
        assert_1.default.strictEqual(carrito.items.length, 1);
    });
    await prueba('la solicitud rechaza más turnos de los que el especialista tiene disponibles', () => {
        const servicio = productoDemo(3);
        assert_1.default.throws(() => carrito_modelo_1.Carrito.vacio().agregar(servicio, 5), /Stock insuficiente/);
    });
    await prueba('el cálculo total de la solicitud aplica garantía e IGV correctamente', () => {
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(productoDemo(10), 2);
        assert_1.default.strictEqual(carrito.calcularSubtotal(), 220);
        assert_1.default.strictEqual(carrito.calcularTotal(), 259.6);
    });
    console.log('\n-- Entidad Pedido / Orden de Servicio');
    await prueba('una orden de servicio no puede crearse vacía', () => {
        assert_1.default.throws(() => pedido_modelo_1.Pedido.crear('CLI-01', [], 100, 'AUT'), /no puede estar vacio/);
    });
    await prueba('una orden cancelada no puede volver a cancelarse', () => {
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(productoDemo(), 1);
        const pedido = pedido_modelo_1.Pedido.crear('CLI-01', carrito.items, 118, 'AUT');
        pedido.cancelar();
        assert_1.default.throws(() => pedido.cancelar(), /ya no puede cancelarse/);
    });
    console.log('\n-- Casos de Uso de Aplicación');
    await prueba('el catálogo solo muestra especialistas con turnos disponibles', async () => {
        const repositorio = new repositorio_productos_memoria_1.RepositorioProductosMemoria([
            productoDemo(5),
            new producto_modelo_1.Producto('PR002', 'Reparación Fugas', 'gasfiteria', 'gasfitero', 200, 0, // Sin turnos disponibles
            'TEC-02'),
        ]);
        const productos = await new consultar_catalogo_caso_uso_1.ConsultarCatalogoCasoUso(repositorio).ejecutar();
        assert_1.default.strictEqual(productos.length, 1);
        assert_1.default.strictEqual(productos[0].id, 'PR001');
    });
    await prueba('agregar a la solicitud utiliza la entidad real del repositorio', async () => {
        const repositorio = new repositorio_productos_memoria_1.RepositorioProductosMemoria([productoDemo(10)]);
        const carrito = await new agregar_al_carrito_caso_uso_1.AgregarAlCarritoCasoUso(repositorio).ejecutar({
            carritoActual: carrito_modelo_1.Carrito.vacio(),
            productoId: 'PR001',
            cantidad: 2,
        });
        assert_1.default.strictEqual(carrito.cantidadDeItems, 2);
    });
    await prueba('contratar servicio cobra en custodia, reserva turno y emite la orden', async () => {
        const productos = new repositorio_productos_memoria_1.RepositorioProductosMemoria([productoDemo(10)]);
        const pedidos = new repositorio_pedidos_memoria_1.RepositorioPedidosMemoria();
        const casoUso = new registrar_compra_caso_uso_1.RegistrarCompraCasoUso(productos, pedidos, new procesador_pagos_simulado_1.ProcesadorPagosSimulado(), new notificador_consola_1.NotificadorConsola());
        const servicio = (await productos.buscarPorId('PR001'));
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(servicio, 2);
        const orden = await casoUso.ejecutar({
            clienteId: 'CLI-01',
            carrito,
            medioPago: '4111111111111111',
        });
        assert_1.default.strictEqual(orden.total, 259.6);
        assert_1.default.strictEqual(orden.estadoActual, 'pagado');
        assert_1.default.strictEqual((await productos.buscarPorId('PR001')).stockDisponible, 8);
        assert_1.default.strictEqual((await pedidos.listarPorCliente('CLI-01')).length, 1);
    });
    await prueba('si el pago con la pasarela es rechazado no se registra la orden ni se consumen turnos', async () => {
        const productos = new repositorio_productos_memoria_1.RepositorioProductosMemoria([productoDemo(10)]);
        const pedidos = new repositorio_pedidos_memoria_1.RepositorioPedidosMemoria();
        const casoUso = new registrar_compra_caso_uso_1.RegistrarCompraCasoUso(productos, pedidos, new procesador_pagos_simulado_1.ProcesadorPagosSimulado(false), new notificador_consola_1.NotificadorConsola());
        const servicio = (await productos.buscarPorId('PR001'));
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(servicio, 1);
        await assert_1.default.rejects(casoUso.ejecutar({ clienteId: 'CLI-01', carrito, medioPago: '4111111111111111' }), /rechazado/);
        assert_1.default.strictEqual((await pedidos.listarPorCliente('CLI-01')).length, 0);
        // Un pago rechazado NO consume los turnos del técnico
        assert_1.default.strictEqual((await productos.buscarPorId('PR001')).stockDisponible, 10);
    });
    await prueba('no se puede contratar con una solicitud vacía', async () => {
        const casoUso = new registrar_compra_caso_uso_1.RegistrarCompraCasoUso(new repositorio_productos_memoria_1.RepositorioProductosMemoria([]), new repositorio_pedidos_memoria_1.RepositorioPedidosMemoria(), new procesador_pagos_simulado_1.ProcesadorPagosSimulado(), new notificador_consola_1.NotificadorConsola());
        await assert_1.default.rejects(casoUso.ejecutar({ clienteId: 'CLI-01', carrito: carrito_modelo_1.Carrito.vacio(), medioPago: '4111111111111111' }), /carrito vacio/);
    });
    console.log(`\n   ${pasadas} pruebas pasadas con éxito en ${Date.now() - inicio} ms, sin levantar Angular.\n`);
}
main();
