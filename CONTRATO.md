# Contrato de modulos

Los tests de `tests/` usan exactamente estos nombres. No renombrar.

## Modelos (`src/models/`)
- `tipos.ts`: `type Variedad = 'Brasil' | 'Colombia' | 'Etiopia'` y `type Tamano = 'Pocillo' | 'Mediano' | 'Taza grande'`.
- `Producto.ts`: `abstract class Producto(id, nombre, precioBase)`; `calcularPrecio()` devuelve `precioBase`.
- `Cafe.ts`: `abstract class Cafe extends Producto(id, nombre, precioBase, tamano, variedad, gramos)`; `calcularCostoCafe()` = gramos x precio por gramo (toma `PRECIO_POR_GRAMO` de `config/precios.ts`); `calcularPrecio()` = `super.calcularPrecio()` + costo.
- `Expreso.ts`: `Expreso(id, tamano, variedad)`; precioBase 2500; gramos Pocillo 18, Mediano 27, Taza grande 36; nombre `Expreso ${tamano} ${variedad}`.
- `Filtrado.ts`: `Filtrado(id, tamano, variedad)`; precioBase 3200; gramos 6, 15, 25; nombre `Filtrado ${tamano} ${variedad}`.
- `Pasteleria.ts`: `Pasteleria(id, nombre, precioBase)` extiende `Producto`.
- `Pedido.ts`: tipos `EstadoPedido` ('pendiente' | 'en preparacion' | 'entregado'), `ItemPedido {productoId, cantidad}`, `Pedido {id, items, estado}`, `PedidoConTotal` (Pedido + total). Exporta `ESTADOS_VALIDOS`.

## Configuracion y datos
- `src/config/precios.ts`: exporta `PRECIO_BASE_EXPRESO` (2500), `PRECIO_BASE_FILTRADO` (3200), `GRAMOS_EXPRESO` y `GRAMOS_FILTRADO` (por tamano), `PRECIO_POR_GRAMO` (Brasil 140, Colombia 180, Etiopia 240), `PRECIO_MUFFIN` (2500) y `PRECIO_TORTA` (4200).
- `src/data/catalogo.ts`: `crearCatalogo()` devuelve los 20 productos: ids 1-9 expresos, 10-18 filtrados (en ambos: tamano Pocillo, Mediano, Taza grande; dentro de cada tamano Brasil, Colombia, Etiopia), 19 `Muffin de chocolate`, 20 `Torta selva negra`.

## Repositorios (`src/repositories/`)
- `ProductoRepository(productos = crearCatalogo())`: `listar()` (devuelve copia), `buscarPorId(id)`.
- `PedidoRepository`: `crear({items, estado})` asigna id desde 1, `listar()` (devuelve copia), `buscarPorId(id)`.

## Servicios (`src/services/`)
- `errors.ts`: `ValidacionError` y `NoEncontradoError` (ya esta en el setup).
- `ProductoService(productoRepo)`: `listar()` y `obtener(id)` devuelven `{id, nombre, precioBase, precio}`; `obtener` lanza `NoEncontradoError`.
- `PedidoService(pedidoRepo, productoRepo)`: `calcularTotal(pedido)`, `crear(body)`, `listar()`, `obtener(id)`. Valida: items no vacio, productoId entero, cantidad entera mayor a 0, producto existente (`NoEncontradoError`), estado valido (por defecto 'pendiente').
- `ReporteService(pedidoRepo, productoRepo, pedidoService)`: `facturacionTotal()`, `cantidadVendidaPorProducto()` ({nombre: cantidad}), `productoMasVendido()` ({producto, cantidad}; lanza `NoEncontradoError` si no hay ventas).

## Utilidades (`src/utils/`)
- `parseId.ts`: `parseId(valor: string | string[] | undefined): number`. Acepta solo cadenas de digitos; si no, lanza `ValidacionError`.

## Controladores (`src/controllers/`)
Cada controlador recibe su servicio en el constructor y define sus metodos como arrow functions (propiedades), para no perder `this` al pasarlos a las rutas. Los errores no se atrapan aca: se lanzan y los maneja el middleware de `app.ts`.
- `ProductoController(productoService)`: `listar`, `obtener` (usa `parseId(req.params.id)`).
- `PedidoController(pedidoService)`: `crear` (responde 201), `listar`, `obtener` (usa `parseId(req.params.id)`).
- `ReporteController(reporteService)`: `facturacion` (responde `{facturacionTotal}`), `masVendido` (responde `{producto, cantidad}`).

## Rutas (`src/routes/`)
Un archivo por recurso, con nombre `<recurso>.routes.ts`, que exporta una funcion `<recurso>Router(controlador): Router`.
- `productos.routes.ts`: `productosRouter(controller)` con `GET /` y `GET /:id`.
- `pedidos.routes.ts`: `pedidosRouter(controller)` con `POST /`, `GET /` y `GET /:id`.
- `reportes.routes.ts`: `reportesRouter(controller)` con `GET /facturacion` y `GET /mas-vendido`.

## App y servidor
- `src/app.ts`: `createApp()` crea repositorios, servicios, controladores y routers nuevos en cada llamada (sin estado compartido entre llamadas) y devuelve la app de Express. Orden: `express.json()`, routers montados en `/productos`, `/pedidos` y `/reportes`, y al final el middleware de errores (4 parametros), definido dentro de `app.ts`.
- `src/server.ts`: levanta `createApp()` en el puerto 3000 (o en `PORT`). Es el unico lugar con `listen`; esta excluido de la cobertura.

## Endpoints
- `GET /productos`, `GET /productos/:id`, `POST /pedidos` (201), `GET /pedidos`, `GET /pedidos/:id`, `GET /reportes/facturacion` ({facturacionTotal}), `GET /reportes/mas-vendido` ({producto, cantidad}).

## Errores
Todas las respuestas de error tienen la forma `{ error: mensaje }`.
- `ValidacionError` da 400.
- `NoEncontradoError` da 404.
- JSON invalido (`SyntaxError` de `express.json()`) da 400.
- Un id de ruta que no es un entero (`/productos/abc`) da 400 (lo valida `parseId`).
- Cualquier otro error da 500.