# Contrato de modulos

Los tests de `tests/` usan exactamente estos nombres. No renombrar.

## Modelos (`src/models/`)
- `tipos.ts`: `type Variedad = 'Brasil' | 'Colombia' | 'Etiopia'` y `type Tamano = 'Pocillo' | 'Mediano' | 'Taza grande'`.
- `Producto.ts`: `abstract class Producto(id, nombre, precioBase)`; `calcularPrecio()` devuelve `precioBase`.
- `Cafe.ts`: `abstract class Cafe extends Producto(id, nombre, precioBase, tamano, variedad, gramos)`; `calcularCostoCafe()` = gramos x precio por gramo; `calcularPrecio()` = `super.calcularPrecio()` + costo. Exporta `PRECIO_POR_GRAMO` (Brasil 140, Colombia 180, Etiopia 240).
- `Expreso.ts`: `Expreso(id, tamano, variedad)`; precioBase 2500; gramos Pocillo 18, Mediano 27, Taza grande 36; nombre `Expreso ${tamano} ${variedad}`.
- `Filtrado.ts`: `Filtrado(id, tamano, variedad)`; precioBase 3200; gramos 6, 15, 25; nombre `Filtrado ${tamano} ${variedad}`.
- `Pasteleria.ts`: `Pasteleria(id, nombre, precioBase)` extiende `Producto`.
- `Pedido.ts`: tipos `EstadoPedido` ('pendiente' | 'en preparacion' | 'entregado'), `ItemPedido {productoId, cantidad}`, `Pedido {id, items, estado}`, `PedidoConTotal` (Pedido + total). Exporta `ESTADOS_VALIDOS`.

## Repositorios (`src/repositories/`)
- `ProductoRepository`: `listar()` (devuelve copia), `buscarPorId(id)`. Catalogo de 20 productos: ids 1-9 expresos, 10-18 filtrados (en ambos: tamano Pocillo, Mediano, Taza grande; dentro de cada tamano Brasil, Colombia, Etiopia), 19 muffin de chocolate (2500), 20 torta selva negra (4200).
- `PedidoRepository`: `crear({items, estado})` asigna id desde 1, `listar()`, `buscarPorId(id)`.

## Servicios (`src/services/`)
- `errors.ts`: `ValidacionError` y `NoEncontradoError` (ya esta en el setup).
- `ProductoService(productoRepo)`: `listar()` y `obtener(id)` devuelven `{id, nombre, precioBase, precio}`; `obtener` lanza `NoEncontradoError`.
- `PedidoService(pedidoRepo, productoRepo)`: `calcularTotal(pedido)`, `crear(body)`, `listar()`, `obtener(id)`. Valida: items no vacio, productoId entero, cantidad entera mayor a 0, producto existente (`NoEncontradoError`), estado valido (por defecto 'pendiente').
- `ReporteService(pedidoRepo, productoRepo, pedidoService)`: `facturacionTotal()`, `cantidadVendidaPorProducto()` ({nombre: cantidad}), `productoMasVendido()` ({producto, cantidad}; lanza `NoEncontradoError` si no hay ventas).

## App y rutas
- `src/app.ts`: `createApp()` crea repositorios y servicios nuevos y devuelve la app de Express.
- `src/server.ts`: levanta `createApp()` en el puerto 3000.
- `GET /productos`, `GET /productos/:id`, `POST /pedidos` (201), `GET /pedidos`, `GET /pedidos/:id`, `GET /reportes/facturacion` ({facturacionTotal}), `GET /reportes/mas-vendido` ({producto, cantidad}).
- Errores: `ValidacionError` da 400, `NoEncontradoError` da 404, JSON invalido da 400.
