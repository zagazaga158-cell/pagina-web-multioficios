// =============================================================
// PRUEBAS DEL DOMINIO — SIN ANGULAR (ConectaOficios)
// =============================================================
// Este archivo se compila y se ejecuta con Node y TypeScript
// puro, SIN Angular, SIN navegador y SIN servidor.
//
// Demuestra que el Dominio y los Casos de Uso son totalmente
// independientes del framework web.

import assert from 'assert';
import { Producto } from '../dominio/modelos/producto.modelo';
import { Carrito } from '../dominio/modelos/carrito.modelo';
import { Pedido } from '../dominio/modelos/pedido.modelo';
import { precioParaElCliente, totalConIgv } from '../dominio/modelos/precios';
import { RegistrarCompraCasoUso } from '../aplicacion/registrar-compra.caso-uso';
import { AgregarAlCarritoCasoUso } from '../aplicacion/agregar-al-carrito.caso-uso';
import { ConsultarCatalogoCasoUso } from '../aplicacion/consultar-catalogo.caso-uso';
import { RepositorioProductosMemoria } from '../infraestructura/repositorio-productos-memoria';
import { RepositorioPedidosMemoria } from '../infraestructura/repositorio-pedidos-memoria';
import { ProcesadorPagosSimulado } from '../infraestructura/procesador-pagos-simulado';
import { NotificadorConsola } from '../infraestructura/notificador-consola';

let pasadas = 0;

async function prueba(nombre: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    pasadas++;
    console.log(`   OK    ${nombre}`);
  } catch (error) {
    console.log(`   FALLO ${nombre}: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

function productoDemo(stock = 10): Producto {
  return new Producto(
    'PR001',
    'Servicio Electricista - Tableros Eléctricos',
    'electricidad',
    'electricista',
    100,
    stock,
    'TEC-01',
    'SENATI Electricista Industrial',
    8,
    4.9,
    'Huamanga',
  );
}

async function main(): Promise<void> {
  const inicio = Date.now();
  console.log('\n=== PRUEBAS DEL DOMINIO DE CONECTAOFICIOS (sin Angular, sin navegador) ===\n');

  console.log('-- Entidad Producto / Servicio Técnico');
  await prueba('un servicio técnico con tarifa cero es inválido', () => {
    assert.throws(
      () => new Producto('P1', 'Instalación', 'electricidad', 'electricista', 0, 5, 'TEC-01'),
      /mayor que cero/,
    );
  });

  await prueba('no se puede reservar más turnos de los disponibles en la agenda', () => {
    const servicio = productoDemo(3);
    assert.throws(() => servicio.descontar(5), /Stock insuficiente/);
  });

  await prueba('descontar reduce los turnos disponibles en la agenda del especialista', () => {
    const servicio = productoDemo(10);
    servicio.descontar(4);
    assert.strictEqual(servicio.stockDisponible, 6);
  });

  console.log('\n-- Reglas de Precio y Garantía de ConectaOficios');
  await prueba('la tarifa al cliente incluye el 10% del fondo de garantía y protección', () => {
    assert.strictEqual(precioParaElCliente(100), 110);
  });

  await prueba('el total final incluye el IGV legal (18%)', () => {
    assert.strictEqual(totalConIgv(100), 118);
  });

  console.log('\n-- Entidad Carrito / Solicitud de Servicios');
  await prueba('la solicitud de contratación vacía no tiene servicios', () => {
    assert.strictEqual(Carrito.vacio().estaVacio(), true);
  });

  await prueba('agregar dos veces el mismo servicio técnico acumula la cantidad de turnos', () => {
    const servicio = productoDemo(10);
    const carrito = Carrito.vacio().agregar(servicio, 2).agregar(servicio, 3);
    assert.strictEqual(carrito.cantidadDeItems, 5);
    assert.strictEqual(carrito.items.length, 1);
  });

  await prueba('la solicitud rechaza más turnos de los que el especialista tiene disponibles', () => {
    const servicio = productoDemo(3);
    assert.throws(() => Carrito.vacio().agregar(servicio, 5), /Stock insuficiente/);
  });

  await prueba('el cálculo total de la solicitud aplica garantía e IGV correctamente', () => {
    const carrito = Carrito.vacio().agregar(productoDemo(10), 2);
    assert.strictEqual(carrito.calcularSubtotal(), 220);
    assert.strictEqual(carrito.calcularTotal(), 259.6);
  });

  console.log('\n-- Entidad Pedido / Orden de Servicio');
  await prueba('una orden de servicio no puede crearse vacía', () => {
    assert.throws(() => Pedido.crear('CLI-01', [], 100, 'AUT'), /no puede estar vacio/);
  });

  await prueba('una orden cancelada no puede volver a cancelarse', () => {
    const carrito = Carrito.vacio().agregar(productoDemo(), 1);
    const pedido = Pedido.crear('CLI-01', carrito.items, 118, 'AUT');
    pedido.cancelar();
    assert.throws(() => pedido.cancelar(), /ya no puede cancelarse/);
  });

  console.log('\n-- Casos de Uso de Aplicación');
  await prueba('el catálogo solo muestra especialistas con turnos disponibles', async () => {
    const repositorio = new RepositorioProductosMemoria([
      productoDemo(5),
      new Producto(
        'PR002',
        'Reparación Fugas',
        'gasfiteria',
        'gasfitero',
        200,
        0, // Sin turnos disponibles
        'TEC-02',
      ),
    ]);
    const productos = await new ConsultarCatalogoCasoUso(repositorio).ejecutar();
    assert.strictEqual(productos.length, 1);
    assert.strictEqual(productos[0].id, 'PR001');
  });

  await prueba('agregar a la solicitud utiliza la entidad real del repositorio', async () => {
    const repositorio = new RepositorioProductosMemoria([productoDemo(10)]);
    const carrito = await new AgregarAlCarritoCasoUso(repositorio).ejecutar({
      carritoActual: Carrito.vacio(),
      productoId: 'PR001',
      cantidad: 2,
    });
    assert.strictEqual(carrito.cantidadDeItems, 2);
  });

  await prueba('contratar servicio cobra en custodia, reserva turno y emite la orden', async () => {
    const productos = new RepositorioProductosMemoria([productoDemo(10)]);
    const pedidos = new RepositorioPedidosMemoria();
    const casoUso = new RegistrarCompraCasoUso(
      productos,
      pedidos,
      new ProcesadorPagosSimulado(),
      new NotificadorConsola(),
    );

    const servicio = (await productos.buscarPorId('PR001'))!;
    const carrito = Carrito.vacio().agregar(servicio, 2);

    const orden = await casoUso.ejecutar({
      clienteId: 'CLI-01',
      carrito,
      medioPago: '4111111111111111',
    });

    assert.strictEqual(orden.total, 259.6);
    assert.strictEqual(orden.estadoActual, 'pagado');
    assert.strictEqual((await productos.buscarPorId('PR001'))!.stockDisponible, 8);
    assert.strictEqual((await pedidos.listarPorCliente('CLI-01')).length, 1);
  });

  await prueba('si el pago con la pasarela es rechazado no se registra la orden ni se consumen turnos', async () => {
    const productos = new RepositorioProductosMemoria([productoDemo(10)]);
    const pedidos = new RepositorioPedidosMemoria();
    const casoUso = new RegistrarCompraCasoUso(
      productos,
      pedidos,
      new ProcesadorPagosSimulado(false),
      new NotificadorConsola(),
    );

    const servicio = (await productos.buscarPorId('PR001'))!;
    const carrito = Carrito.vacio().agregar(servicio, 1);

    await assert.rejects(
      casoUso.ejecutar({ clienteId: 'CLI-01', carrito, medioPago: '4111111111111111' }),
      /rechazado/,
    );
    assert.strictEqual((await pedidos.listarPorCliente('CLI-01')).length, 0);
    // Un pago rechazado NO consume los turnos del técnico
    assert.strictEqual((await productos.buscarPorId('PR001'))!.stockDisponible, 10);
  });

  await prueba('no se puede contratar con una solicitud vacía', async () => {
    const casoUso = new RegistrarCompraCasoUso(
      new RepositorioProductosMemoria([]),
      new RepositorioPedidosMemoria(),
      new ProcesadorPagosSimulado(),
      new NotificadorConsola(),
    );
    await assert.rejects(
      casoUso.ejecutar({ clienteId: 'CLI-01', carrito: Carrito.vacio(), medioPago: '4111111111111111' }),
      /carrito vacio/,
    );
  });

  console.log(`\n   ${pasadas} pruebas pasadas con éxito en ${Date.now() - inicio} ms, sin levantar Angular.\n`);
}

main();
